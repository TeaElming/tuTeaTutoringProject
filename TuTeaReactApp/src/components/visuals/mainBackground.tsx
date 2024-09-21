/** @format */

import React, { ReactNode } from "react"
import "./css/mainBackground.css" // Allows us to import it as a module

interface MainBackgroundDivProps {
	className?: string
	children: ReactNode
}

const MainBackgroundDiv: React.FC<MainBackgroundDivProps> = ({ children }) => {
	return <div className="container">{children}
  </div>
}

export default MainBackgroundDiv
