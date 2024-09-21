/** @format */
import React, { useState, useEffect } from "react"
import styles from "./css/exampleForm.module.css"

interface ExampleFormProps {
	example?: any // Optionally prefill data for update mode
	resourceType: string // Resource type to determine the URL
	resourceId: string // Resource ID for constructing the URL
	onSubmit: (formData: any) => void
	onCancel: () => void
}

const ExampleForm: React.FC<ExampleFormProps> = ({
	example,
	resourceType,
	resourceId,
	onSubmit,
	onCancel,
}) => {
	const [formData, setFormData] = useState({
		exampleTarget: example?.exampleTarget || "",
		exampleNative: example?.exampleNative || "",
		targetLanguage: example?.targetLanguage || "",
		nativeLanguage: example?.nativeLanguage || "",
		comments: example?.comments || "",
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		// Call the onSubmit prop with the form data to let ResourcePopup handle the state
		onSubmit(formData)
	}

	useEffect(() => {
		if (example) {
			setFormData({
				exampleTarget: example.exampleTarget,
				exampleNative: example.exampleNative,
				targetLanguage: example.targetLanguage,
				nativeLanguage: example.nativeLanguage || "",
				comments: example.comments || "",
			})
		}
	}, [example])

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<input
				type="text"
				name="exampleTarget"
				value={formData.exampleTarget}
				onChange={handleChange}
				placeholder="Example Target"
				required
			/>
			<input
				type="text"
				name="exampleNative"
				value={formData.exampleNative}
				onChange={handleChange}
				placeholder="Example Native"
				required
			/>
			<input
				type="text"
				name="targetLanguage"
				value={formData.targetLanguage}
				onChange={handleChange}
				placeholder="Target Language"
				required
			/>
			<input
				type="text"
				name="nativeLanguage"
				value={formData.nativeLanguage}
				onChange={handleChange}
				placeholder="Native Language"
			/>
			<input
				type="text"
				name="comments"
				value={formData.comments}
				onChange={handleChange}
				placeholder="Comments"
			/>
			<div className={styles.buttonContainer}>
				<button type="submit" className={styles.button}>
					{example ? "Update Example" : "Create Example"}
				</button>
				<button type="button" onClick={onCancel} className={styles.button}>
					Cancel
				</button>
			</div>
		</form>
	)
}

export default ExampleForm
