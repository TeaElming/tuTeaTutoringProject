import React from "react"

interface CustomLegendProps {
  selectedActivityIds: string[]
  activityDetails: Map<string, string>
  shapes: Record<string, React.FC<any>>
}

const CustomLegend: React.FC<CustomLegendProps> = ({
  selectedActivityIds,
  activityDetails,
  shapes,
}) => {
  const itemsPerRow = Math.ceil(selectedActivityIds.length / 2)

  return (
    <ul
      style={{
        listStyleType: "none",
        paddingLeft: 0,
        display: "flex",
        flexWrap: "wrap",
        width: `${itemsPerRow * 150}px`,
        margin: "0 auto",
      }}
    >
      {selectedActivityIds.map((activityId, index) => {
        const shapeKeys = Object.keys(shapes);
        const ShapeComponent = shapes[shapeKeys[index % shapeKeys.length]]
        const color = index % 2 === 0 ? "#8884d8" : "#82ca9d"

        return (
          <li
            key={activityId}
            style={{
              display: "flex",
              alignItems: "center",
              width: "150px",
              marginBottom: "10px",
            }}
          >
            <svg width={20} height={20} style={{ marginRight: 8 }}>
              <ShapeComponent cx={10} cy={10} size={100} fill={color} />
            </svg>
            <span>{activityDetails.get(activityId) || `Activity ${activityId}`}</span>
          </li>
        )
      })}
    </ul>
  )
}

export default CustomLegend
