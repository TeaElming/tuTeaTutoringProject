/** @format */

import React, { useEffect, useState } from "react"
import "./css/forumPage.css"
import PostManager from "../lists/forum/postManager"

const ForumPage: React.FC = () => {
	const [username, setUsername] = useState("")

	useEffect(() => {
		const fetchUser = async () => {
			const userId = sessionStorage.getItem("currentUserId")
			const jwtToken = sessionStorage.getItem("jwt")
			if (userId && jwtToken) {
				try {
					const response = await fetch(
						`${process.env.REACT_APP_USER_URL_USERS}/${userId}`,
						{
							headers: {
								Authorization: `Bearer ${jwtToken}`, // Include JWT token in the request headers
							},
						}
					)
					if (response.ok) {
						const user = await response.json()
						setUsername(user.name) // Assuming the user object has a 'name' field
					} else {
						console.error("Error fetching user:", response.statusText)
					}
				} catch (error) {
					console.error("Error fetching user:", error)
				}
			}
		}

		fetchUser()
	}, [])

	return (
		<div className="postManagerDiv">
			<PostManager />
		</div>
	)
}

export default ForumPage
