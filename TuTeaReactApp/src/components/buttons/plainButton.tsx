/** @format */
// NOTE: This code is adapted from the Tutorial by 'Programming with Mosh'
// https://www.youtube.com/watch?v=SqcY0GlETPk (React Tutorial for Beginners [React js])

// Four props, children, className, onClick, and type (Required when creating a button component)
interface Props {
	children: string
	className: string // Make className an optional prop
	onClick?: () => void
	type?: "button" | "submit" | "reset" // Adding type prop
}

// Renders a button with a fixed button style from Bootstrap
// Includes a color prop to change the button style, set 'primary' as default
// Includes an onClick function to trigger when the button is clicked, this could include any function
// Default to set type as button
export const Button = ({ children, onClick, type = "button" }: Props) => {
	return (
		<button type={type} onClick={onClick}>
			{children}
		</button>
	)
}

export default Button
