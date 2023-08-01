import React from 'react'
import Header from './components/Header'
import URL from './components/URL'
import Login from './components/Login'
import Navbar from './components/Navbar'
// import { Route, Routes } from "react-router-dom"
import { auth } from "./firebase"
import { getRedirectResult } from "firebase/auth"
import { gapi } from 'gapi-script'
const API_KEY = import.meta.env.VITE_API_KEY
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
const SCOPES = import.meta.env.VITE_SCOPES

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false)
    
    const user = auth.currentUser

    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsAuthenticated(user !== null) // update isAuthenticated based on if user signed in
        })
        return unsubscribe
    }, [])

    // load/initialize google docs API library
    React.useEffect(() => {
        gapi.load('client:auth2', () => {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                scope: SCOPES,
            })
        })
    }, [])

    const handleSignOut = async () => {
        try {
            await auth.signOut()
        } catch (error) {
            console.log(error)
        }
    }
    
    // console.log("user is", user !== null && user.photoURL)
    return (
        <main>
            {/* {isAuthenticated && <button onClick={() => handleExportURLs("hello")}>create doc</button>} */}
            
            {
                isAuthenticated 
                ? 
                <URL 
                    user={user} 
                    handleSignOut={handleSignOut}
                /> 
                : 
                <div>
                    <Header isAuthenticated={isAuthenticated} />
                    <Login />
                </div>
            }
        </main>
    )
}
