/** @format */

import React, { useState } from "react"
import ActivitySelector from "../activities/activitySelector"
import styles from "./css/createGoal.module.css"

const CreateGoal: React.FC = () => {
	const [selectedActivityIds, setSelectedActivityIds] = useState<string[]>([])
	const [duration, setDuration] = useState<number>(0)
	const [period, setPeriod] = useState<string>("week")
	const [deadline, setDeadline] = useState<string>("")
	const [isOpenEnded, setIsOpenEnded] = useState<boolean>(false)

	const handleActivitySelect = (selectedIds: string[]) => {
		setSelectedActivityIds(selectedIds)
	}

	const handleSubmit = async (event: React.FormEvent) => {
    console.log("Pressing the submit button")
		event.preventDefault()

		// Ensure only one activity ID is selected for the goal
		if (selectedActivityIds.length !== 1) {
			alert("Please select exactly one activity for the goal.")
			return
		}

		const goalData = {
			activityId: selectedActivityIds[0],
			duration,
			period,
			deadline: deadline || null,
			isOpenEnded,
		}

		try {
			const jwtToken = sessionStorage.getItem("jwt")
			const userId = sessionStorage.getItem("currentUserId")
			if (!jwtToken || !userId) {
				console.error("No JWT token or user ID found")
				return
			}

			const headers = {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwtToken}`,
			}

			const baseUrl =
				process.env.REACT_APP_TIMETRACKER_URL || "https://cscloud8-85.lnu.se/tuTea/timetracker-service/api/v1"

			const goalsURL = `${baseUrl}goals`

      console.log("Trying this url: ", goalsURL)

			const response = await fetch(goalsURL, {
				method: "POST",
				headers,
				body: JSON.stringify(goalData),
			})

      console.log("This is the response: ", response)

			if (response.ok) {
				alert("Goal created successfully!")
				// Optionally, reset the form or navigate elsewhere
			} else {
				const errorData = await response.json()
				console.error("Error creating goal:", errorData)
				alert("Failed to create goal.")
			}
		} catch (error) {
			console.error("Error during goal creation:", error)
			alert("An error occurred. Please try again.")
		}
	}

	return (
		<div className={styles.formContainer}>
			<h1 className={styles.formHeading}>Create a New Goal</h1>
			<form onSubmit={handleSubmit}>
				<ActivitySelector onActivitySelect={handleActivitySelect} />
				<div className={styles.formGroup}>
					<label className={styles.formLabel}>Duration (in minutes):</label>
					<input
						type="number"
						value={duration}
						onChange={(e) => setDuration(Number(e.target.value))}
						className={styles.inputField}
						required
					/>
				</div>
				<div className={styles.formGroup}>
					<label className={styles.formLabel}>Period:</label>
					<select
						value={period}
						onChange={(e) => setPeriod(e.target.value)}
						className={styles.selectField}
						required
					>
						<option value="day">Day</option>
						<option value="week">Week</option>
						<option value="month">Month</option>
						<option value="year">Year</option>
					</select>
				</div>
				<div className={styles.formGroup}>
					<label className={styles.formLabel}>Deadline:</label>
					<input
						type="date"
						value={deadline}
						onChange={(e) => setDeadline(e.target.value)}
						className={styles.inputField}
					/>
				</div>
				<div className={styles.checkboxWrapper}>
					<input
						type="checkbox"
						checked={isOpenEnded}
						onChange={(e) => setIsOpenEnded(e.target.checked)}
						className={styles.checkboxField}
					/>
					<label className={styles.formLabel}>Open-ended</label>
				</div>
				<button type="submit" className={styles.submitButton}>
					Create Goal
				</button>
			</form>
		</div>
	)
}

export default CreateGoal
