/** @format */

import React from "react"
import AdditionSelector from "./additionSelector"
import "./css/additionPopup.css"

interface AdditionPopupProps {
	isOpen: boolean
	onClose: () => void
}

const AdditionPopup: React.FC<AdditionPopupProps> = ({ isOpen, onClose }) => {
	if (!isOpen) return null

	return (
		<div className="popupOverlay">
			<div className="popupContainer">
				<button className="closeButton" onClick={onClose}>
					&times;
				</button>
				<AdditionSelector />
			</div>
		</div>
	)
}

export default AdditionPopup
