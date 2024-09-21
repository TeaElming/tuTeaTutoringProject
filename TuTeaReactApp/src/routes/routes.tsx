/** @format */

import { Navigate, createBrowserRouter } from "react-router-dom"
import App from "../App"
import HomePage from "../components/pages/homePage"
import StartingPage from "../components/pages/startingPage"
import ProtectedRoute from "../routes/middleware/protectedRoute"
import ResourcePage from "../components/pages/resourcePage"
import GamePage from "../components/pages/gamePage"
import MemoryGame from "../components/games/memory/game/game"
import HangmanGame from "../components/games/hangman/hangmanGame/hangmanGame"
import GuessTheWord from "../components/games/guessTheWord/guessTheWord"
import SentenceScramblerGame from "../components/games/sentenceOrganiser/sentenceScrambler"
import ProfilePage from "../components/pages/profilePage"
import ForumPage from "../components/pages/forumPage"
import TimetrackerPage from "../components/pages/timetrackerPage"

// Define a type for the onLogin function
type OnLoginFunction = (token: string) => void

// Function to generate the router with a dynamic onLogin function
export const createRouter = (
	onLogin: OnLoginFunction,
	isAuthenticated: boolean
) =>
	createBrowserRouter(
		[
			{
				path: "/",
				element: <App />,
				children: [
					{
						path: "start",
						element: <StartingPage onLogin={onLogin} />,
					},
					{
						path: "home",
						element: (
							<ProtectedRoute
								isAuthenticated={
									isAuthenticated || !!sessionStorage.getItem("jwt")
								}
								redirectPath="start"
							/>
						),
						children: [{ path: "", element: <HomePage /> }],
					},
					{
						path: "resources",
						element: (
							<ProtectedRoute
								isAuthenticated={!!sessionStorage.getItem("jwt")}
								redirectPath="start"
							/>
						),
						children: [{ path: "", element: <ResourcePage /> }],
					},
					{
						path: "time-tracker",
						element: (
							<ProtectedRoute
								isAuthenticated={!!sessionStorage.getItem("jwt")}
								redirectPath="start"
							/>
						),
						children: [{ path: "", element: <TimetrackerPage /> }],
					},
					{
						path: "forum",
						element: (
							<ProtectedRoute
								isAuthenticated={!!sessionStorage.getItem("jwt")}
								redirectPath="start"
							/>
						),
						children: [{ path: "", element: <ForumPage /> }],
					},
					{
						path: "games",
						element: (
							<ProtectedRoute
								isAuthenticated={!!sessionStorage.getItem("jwt")}
								redirectPath="start"
							/>
						),
						children: [
							{ path: "", element: <GamePage /> },
							{ path: "memory", element: <MemoryGame /> },
							{ path: "hangman", element: <HangmanGame /> },
							{ path: "guess-the-word", element: <GuessTheWord /> },
							{
								path: "sentence-scrambler",
								element: <SentenceScramblerGame />,
							},
						],
					},
					{
						path: "profile",
						element: (
							<ProtectedRoute
								isAuthenticated={!!sessionStorage.getItem("jwt")}
								redirectPath="start"
							/>
						),
						children: [{ path: "", element: <ProfilePage /> }],
					},
					{
						path: "/",
						element: <Navigate to="start" replace />,
					},
				],
			},
		],
		{
			basename: "/tuTea/frontend-react", // Set the base path to match your deployment
		}
	)
