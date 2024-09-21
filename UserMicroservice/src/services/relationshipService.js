import { User } from '../models/user.js'
import { Relationship } from '../models/pendingRelationship.js'

export class RelationshipService {
  // added to work for forum service
  async findAllRelationships(userId) {
    try {
      const relationships = await Relationship.find({
        $or: [{ studentId: userId }, { tutorId: userId }],
      }).populate('studentId tutorId')

      // Add role information to each relationship
      const relationshipsWithRoles = relationships.map((relationship) => {
        const role = relationship.studentId._id.equals(userId)
          ? 'student'
          : 'tutor'
        return {
          ...relationship.toJSON(),
          role,
        }
      })

      return relationshipsWithRoles
    } catch (error) {
      throw new Error(`Error fetching relationships: ${error.message}`)
    }
  }

  async findPendingRelationships(userId) {
    const relationships = await Relationship.find({
      $or: [{ studentId: userId }, { tutorId: userId }],
      status: 'pending',
    })
    return relationships
  }

  async findUserByEmails(studentEmail, tutorEmail) {
    const student = await User.findOne({ email: studentEmail })
    const tutor = await User.findOne({ email: tutorEmail })

    if (!student || !tutor) {
      throw new Error('Student or tutor not found')
    }

    await this.findUser(student, tutor)
  }

  async findUser(student, tutor) {
    console.log(JSON.stringify(student))
    console.log(JSON.stringify(tutor))

    const student1 = await User.findById(student.id)
    const tutor1 = await User.findById(tutor.id)

    if (!student1 || !tutor1) {
      throw new Error('Student or tutor not found')
    }
    console.log('Student', student1)
    console.log('Tutor', tutor1)
  }

  async createPendingRelationshipByEmails(studentEmail, tutorEmail, createdBy) {
    const student = await User.findOne({ email: studentEmail })
    const tutor = await User.findOne({ email: tutorEmail })

    if (!student || !tutor) {
      throw new Error('Student or tutor not found')
    }

    return this.createPendingRelationship(student.id, tutor.id, createdBy)
  }

  async createPendingRelationship(studentId, tutorId, createdBy) {
    const student = await User.findById(studentId)
    const tutor = await User.findById(tutorId)

    if (!student || !tutor) {
      throw new Error('Student or tutor not found')
    }

    const existingRelationship = await Relationship.findOne({
      studentId,
      tutorId,
      status: 'pending',
    })

    if (existingRelationship) {
      throw new Error('Pending relationship already exists')
    }

    const relationship = new Relationship({ studentId, tutorId, createdBy })

    console.log('New relationship pending: ', relationship)
    await relationship.save()

    return { relationship }
  }

  async confirmRelationshipByEmails(studentEmail, tutorEmail) {
    const student = await User.findOne({ email: studentEmail })
    const tutor = await User.findOne({ email: tutorEmail })

    if (!student || !tutor) {
      throw new Error('Student or tutor not found')
    }

    return this.confirmRelationship(student._id, tutor._id)
  }

  async confirmRelationship(studentId, tutorId) {
    const student = await User.findById(studentId)
    const tutor = await User.findById(tutorId)

    if (!student || !tutor) {
      throw new Error('Student or tutor not found')
    }

    const relationship = await Relationship.findOne({
      studentId,
      tutorId,
      status: 'pending',
    })

    if (!relationship) {
      throw new Error('Pending relationship not found')
    }

    relationship.status = 'confirmed'
    relationship.confirmedAt = new Date()
    await relationship.save()

    tutor.students.push(studentId)
    student.tutors.push(tutorId)
    await tutor.save()
    await student.save()

    console.log('Relationship confirmed: ', relationship)

    return { relationship, student, tutor }
  }

  async getRelationshipDetails(relationshipId) {
    const relationship = await Relationship.findById(relationshipId)
    if (!relationship) {
      throw new Error('Relationship not found')
    }

    const student = await User.findById(relationship.studentId)
    if (!student) {
      throw new Error('Student not found')
    }

    const studentInfo = {
      name: student.name,
      email: student.email,
    }

    const tutor = await User.findById(relationship.tutorId)
    if (!tutor) {
      throw new Error('Tutor not found')
    }

    const tutorInfo = {
      name: tutor.name,
      email: tutor.email,
    }
    return { relationship, studentInfo, tutorInfo }
  }

  async deleteRelationshipByEmails(studentEmail, tutorEmail) {
    console.log(
      'Student email: ',
      studentEmail,
      ' and tutor email: ',
      tutorEmail
    )

    console.log(studentEmail)

    const student = await User.findOne({ email: studentEmail })
    const tutor = await User.findOne({ email: tutorEmail })



    if (!student || !tutor) {
      throw new Error('Student or tutor not found')
    }

    return this.deleteRelationship(student._id, tutor._id)
  }

  async deleteRelationship(studentId, tutorId) {
    const student = await User.findById(studentId)
    const tutor = await User.findById(tutorId)

    if (!student || !tutor) {
      throw new Error('Student or tutor not found')
    }

    const relationship = await Relationship.findOneAndDelete({
      studentId,
      tutorId,
    })

    if (!relationship) {
      throw new Error('Relationship not found')
    }

    const studentIndex = tutor.students.indexOf(studentId)
    if (studentIndex !== -1) {
      tutor.students.splice(studentIndex, 1)
    }

    const tutorIndex = student.tutors.indexOf(tutorId)
    if (tutorIndex !== -1) {
      student.tutors.splice(tutorIndex, 1)
    }

    await tutor.save()
    await student.save()

    return {
      student: studentId,
      tutor: tutorId,
      message: 'Relationship deleted successfully',
    }
  }

  async declinePendingRelationshipByEmails(studentEmail, tutorEmail) {
    const student = await User.findOne({ email: studentEmail })
    const tutor = await User.findOne({ email: tutorEmail })

    if (!student || !tutor) {
      throw new Error('Student or tutor not found')
    }

    return this.declinePendingRelationship(student._id, tutor._id)
  }

  async declinePendingRelationship(studentId, tutorId) {
    const relationship = await Relationship.findOneAndDelete({
      studentId,
      tutorId,
      status: 'pending',
    })

    if (!relationship) {
      throw new Error('Pending relationship not found')
    }

    return {
      message: 'Pending relationship declined successfully',
    }
  }
}
