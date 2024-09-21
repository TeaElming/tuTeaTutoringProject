/** @format */

import React, { useState, useEffect } from "react"
import styles from "./css/goalActions.module.css"

interface Goal {
	_id: string
	activityId: string
	duration: number
	period: string
	deadline: string
	isOpenEnded: boolean
}

interface GoalActionsProps {
	goalId: string
}

const GoalActions: React.FC<GoalActionsProps> = ({ goalId }) => {
	const [goal, setGoal] = useState<Goal | null>(null)
	const [isEditing, setIsEditing] = useState(false)
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

	useEffect(() => {
		const fetchGoal = async () => {
			const jwtToken = sessionStorage.getItem("jwt")
			if (!jwtToken) {
				console.error("No JWT token found")
				return
			}

			const headers = {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwtToken}`,
			}

			const baseUrl =
				process.env.REACT_APP_TIMETRACKER_URL || "https://cscloud8-85.lnu.se/tuTea/timetracker-service/api/v1/"
			const goalUrl = `${baseUrl}goals/specific/${goalId}`

			try {
				const response = await fetch(goalUrl, { headers })
				if (response.ok) {
					const data = await response.json()
					setGoal(data)
				} else {
					console.error("Failed to fetch goal data")
				}
			} catch (error) {
				console.error("Error fetching goal:", error)
			}
		}

		fetchGoal()
	}, [goalId])

	const handleEdit = async (event: React.FormEvent) => {
		event.preventDefault()
		if (!goal) return

		const jwtToken = sessionStorage.getItem("jwt")
		if (!jwtToken) {
			console.error("No JWT token found")
			return
		}

		const headers = {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwtToken}`,
		}

		const baseUrl =
			process.env.REACT_APP_TIMETRACKER_URL || "https://cscloud8-85.lnu.se/tuTea/timetracker-service/api/v1/"
		const goalUrl = `${baseUrl}goals/${goalId}`

		try {
			const response = await fetch(goalUrl, {
				method: "PUT",
				headers,
				body: JSON.stringify(goal),
			})

			if (response.ok) {
				alert("Goal updated successfully!")
				setIsEditing(false)
			} else {
				console.error("Failed to update goal")
				alert("Failed to update goal.")
			}
		} catch (error) {
			console.error("Error updating goal:", error)
			alert("An error occurred. Please try again.")
		}
	}

	const handleDelete = async () => {
		const jwtToken = sessionStorage.getItem("jwt")
		if (!jwtToken) {
			console.error("No JWT token found")
			return
		}

		const headers = {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwtToken}`,
		}

		const baseUrl =
			process.env.REACT_APP_TIMETRACKER_URL || "https://cscloud8-85.lnu.se/tuTea/timetracker-service/api/v1/"
		const goalUrl = `${baseUrl}goals/${goalId}`

		try {
			const response = await fetch(goalUrl, {
				method: "DELETE",
				headers,
			})

			if (response.ok) {
				alert("Goal deleted successfully!")
				setShowDeleteConfirmation(false)
			} else {
				console.error("Failed to delete goal")
				alert("Failed to delete goal.")
			}
		} catch (error) {
			console.error("Error deleting goal:", error)
			alert("An error occurred. Please try again.")
		}
	}

	return (
		<div className={styles.formContainer}>
			<div className={styles.buttonContainer}>
				<button
					className={styles.submitButton}
					onClick={() => setIsEditing(true)}
				>
					Edit
				</button>
				<button
					className={styles.submitButton}
					onClick={() => setShowDeleteConfirmation(true)}
				>
					Delete
				</button>
			</div>

			{isEditing && goal && (
				<div>
					<h2 className={styles.formHeading}>Edit Goal</h2>
					<form onSubmit={handleEdit}>
						<div className={styles.formGroup}>
							<label className={styles.formLabel}>Duration:</label>
							<input
								type="number"
								value={goal.duration}
								onChange={(e) =>
									setGoal({ ...goal, duration: Number(e.target.value) })
								}
								className={styles.inputField}
							/>
						</div>

						<div className={styles.formGroup}>
							<label className={styles.formLabel}>Period:</label>
							<select
								value={goal.period}
								onChange={(e) => setGoal({ ...goal, period: e.target.value })}
								className={styles.inputField}
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
								value={goal.deadline}
								onChange={(e) => setGoal({ ...goal, deadline: e.target.value })}
								className={styles.inputField}
							/>
						</div>

						<div className={styles.checkboxWrapper}>
							<input
								type="checkbox"
								checked={goal.isOpenEnded}
								onChange={(e) =>
									setGoal({ ...goal, isOpenEnded: e.target.checked })
								}
								className={styles.checkboxField}
							/>
							<label className={styles.formLabel}>Open-ended</label>
						</div>

						<button type="submit" className={styles.submitButton}>
							Update Goal
						</button>
						<button
							type="button"
							className={styles.submitButton}
							onClick={() => setIsEditing(false)}
						>
							Cancel
						</button>
					</form>
				</div>
			)}

			{showDeleteConfirmation && (
				<div
					className={styles.formContainer}
					style={{
						position: "fixed",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						background: "#fff",
						border: "1px solid #ccc",
						padding: "20px",
						zIndex: 1000,
					}}
				>
					<p className={styles.formLabel}>
						Are you sure you want to delete this goal?
					</p>
					<div className={styles.buttonContainer}>
						<button className={styles.submitButton} onClick={handleDelete}>
							Yes, delete
						</button>
						<button
							className={styles.submitButton}
							onClick={() => setShowDeleteConfirmation(false)}
						>
							No, cancel
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default GoalActions
