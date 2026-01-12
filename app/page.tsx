"use client"

import { useState } from "react"
import LoginPage from "@/components/login-page"
import InterestSelectionPage from "@/components/interest-selection-page"
import DashboardPage from "@/components/dashboard-page"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"login" | "interests" | "dashboard">("login")
  const [userEmail, setUserEmail] = useState("")

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email)
    setCurrentScreen("interests")
  }

  const handleInterestsSubmit = () => {
    setCurrentScreen("dashboard")
  }

  const handleLogout = () => {
    setCurrentScreen("login")
    setUserEmail("")
  }

  return (
    <main className="min-h-screen bg-background">
      {currentScreen === "login" && <LoginPage onLoginSuccess={handleLoginSuccess} />}
      {currentScreen === "interests" && (
        <InterestSelectionPage onInterestsSubmit={handleInterestsSubmit} userEmail={userEmail} />
      )}
      {currentScreen === "dashboard" && <DashboardPage userEmail={userEmail} onLogout={handleLogout} />}
    </main>
  )
}
