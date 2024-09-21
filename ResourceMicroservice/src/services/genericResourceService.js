import { GenericResource } from '../models/genericResource.js'
import { checkOwnershipOrTutor } from '../helpers/authorisationHelper.js'
import { Example } from '../models/example.js'

export class GenericResourceService {
  async createGenericResource(
    reqUser,
    targetLanguage,
    resource,
    genericData,
    studentIds = []
  ) {
    try {
      const ownerIds = []

      if (reqUser.permissionLevel === 1) {
        for (const studentId of studentIds) {
          if (reqUser.students.includes(studentId)) {
            ownerIds.push(studentId)
          } else {
            throw new Error(
              `Unauthorized attempt to create resource for student ID: ${studentId}`
            )
          }
        }

        if (ownerIds.length === 0) {
          ownerIds.push(reqUser.id)
        }
      } else {
        ownerIds.push(reqUser.id)
      }

      const createdResources = []
      const skippedOwners = []

      for (const ownerId of ownerIds) {
        const existingResource = await GenericResource.findOne({
          resource: resource,
          owner: ownerId,
        })

        if (existingResource) {
          skippedOwners.push(ownerId)
          continue
        }

        const genericResourceInformation = {
          owner: ownerId,
          targetLanguage,
          resource,
          ...genericData,
        }
        const newResource = new GenericResource(genericResourceInformation)
        await newResource.save()
        createdResources.push(newResource)
      }

      if (skippedOwners.length > 0) {
        console.log(
          `Skipped creating resource for owner IDs: ${skippedOwners.join(', ')}`
        )
      }

      return createdResources
    } catch (error) {
      throw new Error(`Error creating resource: ${error.message}`)
    }
  }

  async getAllGenericResources(reqUser, studentIds = []) {
    try {
      let query = {}

      if (reqUser.permissionLevel === 1) {
        const validStudentIds = studentIds.filter((studentId) =>
          reqUser.students.includes(studentId)
        )

        // Fetch only the tutor's resources if studentIds is empty
        const ownerIds =
          validStudentIds.length > 0
            ? [reqUser.id, ...validStudentIds]
            : [reqUser.id]

        query = { owner: { $in: ownerIds } }
      } else if (reqUser.permissionLevel === 0) {
        query = {} // Admin has access to everything
      } else {
        query = { owner: reqUser.id } // Regular users can only fetch their own resources
      }

      const genericResources = await GenericResource.find(query)
      return genericResources
    } catch (error) {
      throw new Error(`Error fetching resources: ${error.message}`)
    }
  }

  async getGenericResourceById(reqUser, genericResourceId) {
    try {
      const genericResource = await GenericResource.findById(genericResourceId)

      if (!genericResource) {
        throw new Error('Resource not found')
      }

      if (!checkOwnershipOrTutor(reqUser, genericResource.owner)) {
        throw new Error('You are not authorized to view this resource')
      }

      return genericResource
    } catch (error) {
      throw new Error(`Error fetching resource: ${error.message}`)
    }
  }

  async updateResource(reqUser, genericResourceId, resourceData) {
    try {
      const genericResource = await GenericResource.findById(genericResourceId)

      if (!genericResource) {
        throw new Error('Resource not found')
      }

      if (!checkOwnershipOrTutor(reqUser, genericResource.owner)) {
        throw new Error('You are not authorized to update this resource')
      }

      const updatedResource = await GenericResource.findByIdAndUpdate(
        genericResourceId,
        resourceData,
        { new: true }
      )
      return updatedResource
    } catch (error) {
      throw new Error(`Error updating resource: ${error.message}`)
    }
  }

  async deleteResource(reqUser, genericResourceId) {
    try {
      const genericResource = await GenericResource.findById(genericResourceId)

      if (!genericResource) {
        throw new Error('Resource not found')
      }

      if (!checkOwnershipOrTutor(reqUser, genericResource.owner)) {
        throw new Error('You are not authorized to delete this resource')
      }

      for (const exampleId of genericResource.examples){
        await Example.findByIdAndDelete(exampleId)
      }

      await GenericResource.findByIdAndDelete(genericResourceId)
      return { message: 'Resource deleted successfully' }
    } catch (error) {
      throw new Error(`Error deleting resource: ${error.message}`)
    }
  }

  async searchGeneric(reqUser, query) {
    try {
      let searchQuery = { owner: reqUser.id }

      if (reqUser.permissionLevel === 1) {
        searchQuery = { owner: { $in: [reqUser.id, ...reqUser.students] } }
      } else if (reqUser.permissionLevel === 0) {
        searchQuery = {} // Admin has access to everything
      }

      searchQuery.$or = [
        { resource: { $regex: query, $options: 'i' } },
        { comment: { $regex: query, $options: 'i' } },
      ]

      const generics = await GenericResource.find(searchQuery)
      return generics
    } catch (error) {
      throw new Error(`Error searching generic resources: ${error.message}`)
    }
  }
}
