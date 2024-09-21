import { Example } from '../models/example.js'
import resourceModelMap from '../helpers/resourceModelMap.js'

export class ExampleService {
  async createExample(
    reqUser,
    exampleTargetString,
    exampleNativeString,
    targetLanguageString,
    nativeLanguageString,
    exampleData,
    resourceId,
    resourceType
  ) {
    try {
      const exampleInformation = {
        owner: reqUser,
        exampleTarget: exampleTargetString,
        exampleNative: exampleNativeString,
        targetLanguage: targetLanguageString,
        nativeLanguage: nativeLanguageString,
        ...exampleData,
      }
      const newExample = new Example(exampleInformation)
      await newExample.save()

      // Use resourceType to get the correct Mongoose model from the map
      const ResourceModel = resourceModelMap[resourceType]

      if (!ResourceModel) {
        throw new Error(`Unsupported resource type: ${resourceType}`)
      }

      const resource = await ResourceModel.findById(resourceId)

      if (!resource) {
        throw new Error(
          `Resource not found for type: ${resourceType} with ID: ${resourceId}`
        )
      }

      // Add the new example's ID to the resource's examples array
      if (!resource.examples) {
        throw new Error(
          `Examples array not defined in resource type: ${resourceType}`
        )
      }

      resource.examples.push(newExample._id)

      console.log(
        'Here is ther esource after it has had the example added: ',
        resource
      )
      await resource.save()

      return newExample
    } catch (error) {
      console.error(`Error creating example: ${error.message}`)
      throw new Error(`Error creating example: ${error.message}`)
    }
  }

  async getAllExamples(req) {
    try {
      console.log('Starting the process of getting all examples')
      // Extract resourceId and resourceType from the request
      const { resourceId, resourceType } = req

      if (!resourceId || !resourceType) {
        throw new Error('Resource ID or type not provided')
      }

      // Use resourceType to get the correct Mongoose model from the map
      const ResourceModel = resourceModelMap[resourceType]

      if (!ResourceModel) {
        throw new Error(`Unsupported resource type: ${resourceType}`)
      }

      // Find the resource by ID
      const resource = await ResourceModel.findById(resourceId)

      console.log('This is the resource that has been identified: ', resource)

      if (!resource) {
        throw new Error(
          `Resource not found for type: ${resourceType} with ID: ${resourceId}`
        )
      }

      // Return the examples associated with the resource
      return resource.examples
    } catch (error) {
      throw new Error(`Error fetching examples: ${error.message}`)
    }
  }

  async getExampleById(exampleId) {
    try {
      const example = await Example.findById(exampleId)
      return example
    } catch (error) {
      throw new Error(`Error fetching example: ${error.message}`)
    }
  }

  async updateExample(exampleId, exampleData) {
    try {
      const updatedExample = await Example.findByIdAndUpdate(
        exampleId,
        exampleData,
        { new: true }
      )
      return updatedExample
    } catch (error) {
      throw new Error(`Error updating example: ${error.message}`)
    }
  }

  async deleteExample(exampleId, resourceId, resourceType) {
    try {
      // Fetch the example to get resource information
      const example = await Example.findById(exampleId)

      if (!example) {
        throw new Error(`Example not found with ID: ${exampleId}`)
      }

      // Use provided resourceType and resourceId
      const ResourceModel = resourceModelMap[resourceType]

      if (!ResourceModel) {
        throw new Error(`Unsupported resource type: ${resourceType}`)
      }

      // Find the resource by ID and remove the example reference
      const resource = await ResourceModel.findById(resourceId)

      if (!resource) {
        throw new Error(
          `Resource not found for type: ${resourceType} with ID: ${resourceId}`
        )
      }

      // Remove the example reference from the resource's examples array
      resource.examples = resource.examples.filter(
        (exampleRef) => !exampleRef.equals(exampleId)
      )

      // Save the updated resource
      await resource.save()

      console.log('Successfully deleted the example and updated the resource.')
      return {
        message:
          'Example deleted successfully and reference removed from resource',
      }
    } catch (error) {
      console.error(`Error deleting example: ${error.message}`)
      throw new Error(`Error deleting example: ${error.message}`)
    }
  }
}
