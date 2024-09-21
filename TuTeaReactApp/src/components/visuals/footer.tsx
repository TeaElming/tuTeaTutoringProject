/** @format */

import React from "react"
import Logo from "./bad_logo.png" // Import the image file
import "./css/footer.css" // Import the CSS file

interface CustomFooterProps {
	className?: string
}

const CustomFooter: React.FC<CustomFooterProps> = ({ className }) => {
	return (
		<footer className={`custom-footer ${className}`}>
			<div className="footer-content">
				<ul className="footer-links">
					<li>
						<a href="#">FAQ</a>
					</li>
					<li>
						<a href="#">Email: support@tutea.com</a>
					</li>
					<li>
						<a href="#">Phone: (+44) 7707 77 77 77</a>
					</li>
					<li>
						<a href="#">Address: Made up PO box</a>
					</li>
				</ul>
				<a className="footer-logo" href="#">
					<img
						src={Logo}
						width="100"
						height="50"
						className="d-inline-block align-top"
						alt="T"
					/>
				</a>
			</div>
		</footer>
	)
}

export default CustomFooter
