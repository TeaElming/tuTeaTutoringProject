/** @format */

import React from "react"

interface DateRangeSelectorProps {
	startDate: string
	endDate: string
	setStartDate: (date: string) => void
	setEndDate: (date: string) => void
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
	startDate,
	endDate,
	setStartDate,
	setEndDate,
}) => {
	return (
		<div className="controlsContainer">
			<label>
				Start Date:
				<input
					type="date"
					value={startDate}
					onChange={(e) => setStartDate(e.target.value)}
					className="dateInput"
					required
				/>
			</label>
			<label>
				End Date:
				<input
					type="date"
					value={endDate}
					onChange={(e) => setEndDate(e.target.value)}
					className="dateInput"
					required
				/>
			</label>
		</div>
	)
}

export default DateRangeSelector
