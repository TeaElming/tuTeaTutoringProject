/** @format */

import React, { ChangeEvent, FormEvent } from "react"
import styles from "./css/uploadFile.module.css"

interface FileUploadProps {
	file: File | null
	onFileChange: (file: File | null) => void
	onFileUpload: (file: File) => void // Updates this prop to accept a File parameter
}

const FileUpload: React.FC<FileUploadProps> = ({
	file,
	onFileChange,
	onFileUpload,
}) => {
	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files ? event.target.files[0] : null
		onFileChange(selectedFile)
	}

	const handleUpload = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!file) {
			alert("Please select a file first!")
			return
		}
		console.log("Uploading file:", file.name)
		onFileUpload(file) // Call the onFileUpload prop, passing the file to be uploaded
	}

	return (
		<div className={styles.componentOutline}>
			<form onSubmit={handleUpload} className={styles.componentOutline}>
				<input
					type="file"
					onChange={handleFileChange}
					className={styles.fileInput}
				/>
				<button type="submit" className={styles.uploadButton}>
					Upload File
				</button>
			</form>
		</div>
	)
}

export default FileUpload
