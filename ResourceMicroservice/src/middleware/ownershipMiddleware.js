export const ownershipMiddleware = (Model) => async (req, res, next) => {
  try {
    const resourceId = req.params.id // Assuming id is passed in the request params

    // Fetch the resource by id
    const resource = await Model.findById(resourceId)

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' })
    }

    // Check if the requesting user is the owner of the resource
    const isOwner = resource.owner.equals(req.user.id)

    // Check if the requesting user is a tutor of the owner
    const isTutorOfOwner = req.user.students.includes(resource.owner.toString())

    // Allow if the user is the owner, the tutor of the owner, or an admin
    if (isOwner || isTutorOfOwner || req.user.permissionLevel === 0) {
      return next()
    }

    // If neither, return a 403 Forbidden
    return res
      .status(403)
      .json({ message: 'You are not authorized to perform this action' })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
