export class UserController {
  constructor(userService) {
    this.userService = userService
  }

  async getUserById(req, res) {
    try {
      const user = await this.userService.getUserById(req.params.id)
      res.status(200).json(user)
    } catch (error) {
      res.status(404).json({ error: 'Error finding the user ' + error.message })
    }
  }

  // Useful? 
  async getUserByEmail(req, res) {
    try {
      const user = await this.userService.getUserIdByEmail(req.body.email)
      res.status(200).json(user)
    } catch (error) {
      res.status(404).json({ error: 'Error finding the user ' + error.message })
    }
  }

  async updateUserById(req, res) {
    try {
      const user = await this.userService.updateUserById(
        req.params.id,
        req.body
      )
      res.status(200).json(user)
    } catch (error) {
      res
        .status(400)
        .json({ error: 'Error updating the user ' + error.message })
    }
  }

  async deleteUserById(req, res) {
    try {
      const user = await this.userService.deleteUserById(req.params.id)
      res.status(200).json(user)
    } catch (error) {
      res
        .status(404)
        .json({ error: 'Error deleting the user ' + error.message })
    }
  }
}
