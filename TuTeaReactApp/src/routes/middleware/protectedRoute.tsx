/** @format */

import React, { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"

interface ProtectedRouteProps {
	isAuthenticated: boolean
	redirectPath: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	isAuthenticated,
	redirectPath,
}) => {
	const [isChecking, setIsChecking] = useState(true)
	const [isTokenValid, setIsTokenValid] = useState(false)

	useEffect(() => {
		if (isAuthenticated) {
			// If isAuthenticated is true, skip the token validation
			setIsTokenValid(true)
			setIsChecking(false)
			return
		}

		const validateTokenWithBackend = async () => {
			const token = sessionStorage.getItem("jwt")
			if (!token) {
				setIsChecking(false)
				return
			}

			try {
				const response = await fetch(
					`${process.env.REACT_APP_USER_URL_AUTH}/quickAuth`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					}
				)

				if (response.ok) {
					setIsTokenValid(true)
				} else {
					setIsTokenValid(false)
				}
			} catch (error) {
				console.error("Error validating token with backend:", error)
				setIsTokenValid(false)
			}

			setIsChecking(false)
		}

		validateTokenWithBackend()
	}, [isAuthenticated])

	if (isChecking) {
		return <div>Loading...</div>
	}

	if (!isAuthenticated && !isTokenValid) {
		return <Navigate to={"/"} replace />
	}

	return <Outlet />
}

export default ProtectedRoute
