import { ReactNode } from "react"

interface Props {
  children: ReactNode // Allows React elements to be passed as content of the alert
  onClose: () => void // Function triggered the when the close button is clicked
}

// Renders a div with a fixed alert style from Bootstrap
// Includes a button to close the alert, calling the onClose function when clicked
export const Alert = ({ children, onClose }: Props) => {
  return (
    <div className="alert alert-primary">{children}
    <button type="button" className="btn-close" onClick={onClose} data-bs-dismiss="alert" aria-label="Close"></button></div>
  )
}

export default Alert