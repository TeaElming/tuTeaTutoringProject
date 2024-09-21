/** @format */

import React, { useState, useEffect } from "react"
import styles from "./css/activitySelector.module.css"

interface Activity {
	id: string
	name: string
	type: string
}

interface ActivitySelectorProps {
	onActivitySelect: (selectedIds: string[]) => void
}

const ActivitySelector: React.FC<ActivitySelectorProps> = ({
	onActivitySelect,
}) => {
	const [activities, setActivities] = useState<Activity[]>([])
	const [selectedIds, setSelectedIds] = useState<string[]>([])

	useEffect(() => {
		const fetchActivities = async () => {
			try {
				const jwtToken = sessionStorage.getItem("jwt")
				if (!jwtToken) {
					console.error("No JWT token found")
					return
				}

				const headers = {
					"Content-Type": "application/json",
					Authorization: `Bearer ${jwtToken}`,
				}

				const activityUrl =
					process.env.REACT_APP_TIMETRACKER_ACTIVITIES_URL ||
					"https://cscloud8-85.lnu.se/tuTea/timetracker-service/api/v1/activities"

				const response = await fetch(activityUrl, { headers })
				const data = await response.json()

				setActivities(data)
			} catch (error) {
				console.error("Error fetching activities:", error)
			}
		}

		fetchActivities()
	}, [])

	const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value, checked } = event.target

		setSelectedIds((prevSelectedIds) => {
			const updatedIds = checked
				? [...prevSelectedIds, value]
				: prevSelectedIds.filter((id) => id !== value)

			// Pass the selected IDs to the parent component
			onActivitySelect(updatedIds)

			return updatedIds
		})
	}

	return (
		<div className={styles.container}>
			<div className={styles.activityGrid}>
				{activities.map((activity) => (
					<div key={activity.id} className={styles.activityItem}>
						<label className={styles.label}>
							<input
								type="checkbox"
								value={activity.id}
								onChange={handleCheckboxChange}
								className={styles.checkbox}
							/>
							{activity.name}
						</label>
					</div>
				))}
			</div>
		</div>
	)
}

export default ActivitySelector
