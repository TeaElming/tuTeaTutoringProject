export class AuthController {
  constructor(authService) {
    this.authService = authService
  }

  async registerUser(req, res) {
    try {
      const { name, email, password, permissionLevel } = req.body
      const user = await this.authService.registerUser(
        name,
        email,
        password,
        permissionLevel
      )
      res.status(201).json(user)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  async loginUser(req, res) {
    try {
      const { email, password } = req.body
      const { token, currentUser, permissionLevel, students } =
        await this.authService.loginUser(email, password)

      return res
        .status(201)
        .json({ token, currentUser, permissionLevel, students }) // Return both token, user ID, permission level, and students
    } catch (error) {
      return res
        .status(400)
        .json({ message: 'Error logging in the user ' + error.message })
    }
  }

  async quickAuth(req, res) {
    try {
      const authHeader = req.headers.authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res
          .status(401)
          .json({ message: 'No token provided or token format is incorrect' })
      }

      const token = authHeader.split(' ')[1]
      const isValid = await this.authService.quickAuth(token)

      if (!isValid) {
        return res.status(401).json({ message: 'Invalid or expired token' })
      }

      res.status(200).json({ message: 'Token is valid' })
    } catch (error) {
      console.error('Error in quickAuth controller:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}
