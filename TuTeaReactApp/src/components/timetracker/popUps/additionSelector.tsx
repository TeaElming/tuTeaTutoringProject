/** @format */

import React, { useState } from "react"

import CreateGoal from "../goals/createGoal"
import CreateTimeLog from "../timelogs/createLog"
import "./css/additionSelector.css"

const AdditionSelector: React.FC = () => {
	const [selectedComponent, setSelectedComponent] = useState<"goal" | "log">(
		"goal"
	)

	const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedComponent(event.target.checked ? "log" : "goal")
	}

	return (
		<div className="selectorContainer">
			<h2 className="selectorTitle">Add Goal or Log</h2>
			<div className="toggleContainer">
				<span className="labelLeft">Log Time</span>
				<label className="toggleLabel">
					<input
						type="checkbox"
						className="toggleInput"
						checked={selectedComponent === "log"}
						onChange={handleToggleChange}
					/>
					<span className="slider"></span>
				</label>
				<span className="labelRight">Add Goal</span>
			</div>
			<div className="chartContainer">
				{selectedComponent === "goal" ? <CreateTimeLog /> : <CreateGoal />}
			</div>
		</div>
	)
}

export default AdditionSelector
