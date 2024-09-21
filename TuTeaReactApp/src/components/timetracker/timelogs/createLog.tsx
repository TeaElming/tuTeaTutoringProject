/** @format */

import React, { useState } from "react"
import ActivitySelector from "../activities/activitySelector"
import ExistingGoals from "../goals/existingGoals"
import styles from "./css/createLog.module.css"

interface Goal {
	_id: string
	userId: string
	activityId: string
	duration: number
	period: string
	deadline: string
	isOpenEnded: boolean
	createdAt: string
}

const CreateTimeLog: React.FC = () => {
	const [selectedActivityIds, setSelectedActivityIds] = useState<string[]>([])
	const [selectedGoals, setSelectedGoals] = useState<Goal[]>([])
	const [duration, setDuration] = useState<number>(0)
	const [comment, setComment] = useState<string>("")
	const [timestamp, setTimestamp] = useState<string>(
		new Date().toISOString().split("T")[0]
	) // Default to today's date
	const [mismatchWarning, setMismatchWarning] = useState<string>("")
	const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false)

	const handleActivitySelect = (selectedIds: string[]) => {
		setSelectedActivityIds(selectedIds)
		validateGoalActivityMatch(selectedIds, selectedGoals)
	}

	const handleGoalSelect = (selectedGoals: Goal[]) => {
		setSelectedGoals(selectedGoals)
		validateGoalActivityMatch(selectedActivityIds, selectedGoals)
	}

	const validateGoalActivityMatch = (activityIds: string[], goals: Goal[]) => {
		let warning = ""

		for (const goal of goals) {
			if (!activityIds.includes(goal.activityId)) {
				warning = `Warning: The selected goal (ID: ${goal._id}) does not match the selected activity (Activity ID: ${goal.activityId}). Please ensure that the selected goal matches the activity.`
				break
			}
		}

		setMismatchWarning(warning)
	}

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()

		if (selectedActivityIds.length === 0 || duration <= 0) {
			alert("Please select at least one activity and provide a valid duration.")
			return
		}

		if (mismatchWarning) {
			alert(mismatchWarning)
			return
		}

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
			process.env.REACT_APP_TIMETRACKER_URL ||
			"https://cscloud8-85.lnu.se/tuTea/timetracker-service/api/v1/"
		const timelogURL = `${baseUrl}timelogs`

		try {
			for (const activityId of selectedActivityIds) {
				const matchingGoal = selectedGoals.find(
					(goal) => goal.activityId === activityId
				)

				const timelogData = {
					activityId,
					goalId: matchingGoal?._id || null,
					comment: comment || null,
					duration,
					userId,
					timestamp: new Date(timestamp).toISOString(), // Use the selected date
				}

				const response = await fetch(timelogURL, {
					method: "POST",
					headers,
					body: JSON.stringify(timelogData),
				})

				if (!response.ok) {
					const errorData = await response.json()
					console.error("Error creating time log:", errorData)
					alert(`Failed to create time log for activity ${activityId}.`)
					return // Stop processing if any request fails
				}
			}

			setShowSuccessPopup(true) // Show success popup on successful creation of all logs
		} catch (error) {
			console.error("Error during time log creation:", error)
			alert("An error occurred. Please try again.")
		}
	}

	const handleClosePopup = () => {
		setShowSuccessPopup(false) // Close the success popup
		// Optionally, reset the form or navigate elsewhere
	}

	return (
		<div className={styles.formContainer}>
			<h2 className={styles.formHeading}>Log time spent on activity</h2>
			<form onSubmit={handleSubmit}>
				<ActivitySelector onActivitySelect={handleActivitySelect} />
				<h2 className={styles.selectGoalTitle}>
					Select Goal <i>(optional)</i>
				</h2>
				<ExistingGoals onGoalSelect={handleGoalSelect} />
				{mismatchWarning && (
					<p className={styles.errorMessage}>{mismatchWarning}</p>
				)}
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
					<label className={styles.formLabel}>Date:</label>
					<input
						type="date"
						value={timestamp}
						onChange={(e) => setTimestamp(e.target.value)}
						className={styles.inputField}
						required
					/>
				</div>
				<div className={styles.formGroup}>
					<label className={styles.formLabel}>Comment:</label>
					<input
						type="text"
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						placeholder="Add a comment (optional)"
						className={styles.inputField}
					/>
				</div>
				<button type="submit" className={styles.submitButton}>
					Create Time Log
				</button>
			</form>

			{showSuccessPopup && (
				<div className={styles.successPopup}>
					<p>Time logs created successfully!</p>
					<button onClick={handleClosePopup} className={styles.okButton}>
						OK
					</button>
				</div>
			)}
		</div>
	)
}

export default CreateTimeLog
