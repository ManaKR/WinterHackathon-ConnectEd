<<<<<<< HEAD
import Link from "next/link";
import { ArrowRight, Shield, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/campus-connect/logo";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="flex flex-col items-center text-center mb-12">
        <Logo />
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          Your central hub for all campus events. Discover, navigate, and engage with your university community like never before.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <PortalCard
          userType="Student"
          description="Access event listings, get recommendations, and find your way on campus."
          icon={<User className="w-8 h-8 text-primary" />}
          href="/student/dashboard"
        />
        <PortalCard
          userType="Admin"
          description="Manage events, track attendance, and issue certificates with powerful tools."
          icon={<Shield className="w-8 h-8 text-primary" />}
          href="/admin/dashboard"
        />
      </div>
       <footer className="mt-16 text-center text-muted-foreground text-sm">
        © {new Date().getFullYear()} CampusConnect. All rights reserved.
      </footer>
    </main>
  );
}

function PortalCard({ userType, description, icon, href }: { userType: string, description: string, icon: React.ReactNode, href: string }) {
  return (
    <Link href={href} className="group block">
      <Card className="h-full hover:border-primary/80 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center gap-4 pb-4">
          {icon}
          <div>
            <CardTitle className="text-2xl font-headline text-left">{userType} Portal</CardTitle>
            <CardDescription className="text-left">{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-end text-sm font-medium text-primary group-hover:text-accent-foreground transition-colors">
            Go to Portal <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
=======
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
>>>>>>> 78fcf8925a247c48bd9b6c1719ee02777b69fc44
}
