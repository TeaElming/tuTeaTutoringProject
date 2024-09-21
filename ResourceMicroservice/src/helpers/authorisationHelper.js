// Exporting the ownership to be reusable in other files
export const checkOwnershipOrTutor = (reqUser, resourceOwnerId) => {
  const isOwner = resourceOwnerId.equals(reqUser.id)
  const isTutorOfOwner = reqUser.students.includes(resourceOwnerId.toString())

  // Allow if the user is the owner, the tutor of the owner, or an admin
  if (isOwner || isTutorOfOwner || reqUser.permissionLevel === 0) {
    return true
  }

  return false
}
