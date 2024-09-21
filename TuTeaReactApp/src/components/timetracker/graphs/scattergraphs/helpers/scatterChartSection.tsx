/** @format */

import React from "react"
import {
	ScatterChart,
	Scatter,
	XAxis,
	YAxis,
	ZAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Symbols,
} from "recharts"

interface ScatterChartSectionProps {
	data: any[]
	xDomain: [number, number]
	selectedActivityIds: string[]
	activityDetails: Map<string, string>
	shapes: Record<string, React.FC<any>>
}

const ScatterChartSection: React.FC<ScatterChartSectionProps> = ({
	data,
	xDomain,
	selectedActivityIds,
	activityDetails,
	shapes,
}) => {
	return (
		<div className="scatterChartContainer">
			<ResponsiveContainer width="100%" height={400}>
				<ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
					<CartesianGrid />
					<XAxis
						type="number"
						dataKey="x"
						domain={xDomain}
						tickFormatter={(unixTime) =>
							new Date(unixTime).toLocaleDateString()
						}
					/>
					<YAxis type="number" dataKey="y" name="Minutes" unit="min" />
					<ZAxis
						type="number"
						dataKey="z"
						range={[0, 100]}
						name="Score"
						unit="min"
					/>
					<Tooltip
						content={({ active, payload }) =>
							active && payload && payload.length ? (
								<div className="custom-tooltip">
									<p>Date: {payload[0].payload.date}</p>
									<p>Activity: {payload[0].payload.activityName}</p>
									<p>Duration: {payload[0].payload.duration} minutes</p>
									{payload[0].payload.comment && (
										<p>Comment: {payload[0].payload.comment}</p>
									)}
								</div>
							) : null
						}
					/>
					{selectedActivityIds.map((activityId, index) => {
						const shapeKeys = Object.keys(shapes)
						const ShapeComponent = shapes[shapeKeys[index % shapeKeys.length]]

						return (
							<Scatter
								key={activityId}
								name={
									activityDetails.get(activityId) || `Activity ${activityId}`
								}
								data={data.filter((d) => d.activityId === activityId)}
								fill={index % 2 === 0 ? "#8884d8" : "#82ca9d"}
								shape={<ShapeComponent />}
							/>
						)
					})}
				</ScatterChart>
			</ResponsiveContainer>
		</div>
	)
}

export default ScatterChartSection
