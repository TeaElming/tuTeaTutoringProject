/** @format */

import React, { useEffect, useState } from "react"
import "./css/homePage.css"
import LatestPosts from "../miniComponents/forum/latestPosts"
import RandomVocab from "../miniComponents/resources/randomVocab"
import RandomSentence from "../miniComponents/resources/randomSentence"

const HomePage: React.FC = () => {
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
		<div className="blahblah">
			<h2>Welcome {username}</h2>
			<div className="homePageContainer">
				<div className="comp1">
					<LatestPosts />
				</div>
				<div className="comp2">
					<RandomVocab />{" "}
				</div>
				<div className="comp3">
					<RandomSentence />
				</div>
			</div>
		</div>
	)
}

export default HomePage
