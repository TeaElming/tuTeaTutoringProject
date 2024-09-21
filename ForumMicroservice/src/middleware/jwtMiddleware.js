import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

export const jwtMiddleware = (minPermissionLevel = 2) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization

      if (!authHeader) {
        return res
          .status(403)
          .json({ message: 'Access denied. No credentials sent.' })
      }

      const [authenticationScheme, token] = authHeader.split(' ')
      if (authenticationScheme !== 'Bearer' || !token) {
        return res
          .status(401)
          .json({ message: 'Invalid or missing authentication token.' })
      }

      const relativePath = 'public.pem' // Ensure the correct path to your public key
      const filePath = path.join(process.cwd(), relativePath)
      const publicKey = fs.readFileSync(filePath, 'utf8')

      // Verify the token and extract payload
      const decodedJWT = jwt.verify(token, publicKey, { algorithms: ['RS256'] })

      req.user = {
        id: decodedJWT.sub,
        permissionLevel: decodedJWT.permissionLevel,
        students: decodedJWT.students || [],
      }

      // Check permission level
      if (req.user.permissionLevel > minPermissionLevel) {
        return res.status(403).json({ message: 'Insufficient permissions.' })
      }

      next()
    } catch (err) {
      return res
        .status(401)
        .json({ message: 'Invalid or expired token', error: err.message })
    }
  }
}
