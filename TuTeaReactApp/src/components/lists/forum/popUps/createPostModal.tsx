/** @format */

import React, { useState } from "react"
import Modal from "react-modal"
import PostFormPublic from "../createPosts/postFormPublic"
import PostFormPrivate from "../createPosts/postFormPrivate"
import styles from "./createPostModal.module.css"
import Button from "../../../buttons/plainButton"

interface CreatePostModalProps {
	isOpen: boolean
	onClose: () => void
	onPostCreated: () => void
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
	isOpen,
	onClose,
	onPostCreated,
}) => {
	const [isPublic, setIsPublic] = useState<boolean>(true)

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onClose}
			className={styles.modalContent}
			overlayClassName={styles.modalOverlay}
			ariaHideApp={false} // or ensure you have Modal.setAppElement defined elsewhere
		>
			<div className={styles.modalContainer}>
				<button onClick={onClose} className={styles.closeButton}>
					&times;
				</button>
				<h2 className={styles.text}>Create a Post</h2>
				<div className={styles.toggleButtons}>
					<button
						onClick={() => setIsPublic(true)}
						className={`${styles.toggleButton} ${
							isPublic ? styles.toggleButtonActive : ""
						}`}
					>
						Public
					</button>
					<button
						onClick={() => setIsPublic(false)}
						className={`${styles.toggleButton} ${
							!isPublic ? styles.toggleButtonActive : ""
						}`}
					>
						Private
					</button>
				</div>
				{isPublic ? (
					<PostFormPublic onPostCreated={onPostCreated} />
				) : (
					<PostFormPrivate onPostCreated={onPostCreated} />
				)}
				<button onClick={onClose} className={styles.closeModalButton}>
					Close
				</button>
			</div>
		</Modal>
	)
}

export default CreatePostModal
