"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

interface InterestSelectionPageProps {
  onInterestsSubmit: () => void
  userEmail: string
}

interface Interest {
  id: string
  label: string
  emoji: string
}

const interests: Interest[] = [
  { id: "ai", label: "AI & Technology", emoji: "🤖" },
  { id: "music", label: "Music & Arts", emoji: "🎵" },
  { id: "sports", label: "Sports & Wellness", emoji: "⚽" },
  { id: "volunteering", label: "Volunteering", emoji: "🤝" },
]

export default function InterestSelectionPage({ onInterestsSubmit, userEmail }: InterestSelectionPageProps) {
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(new Set())
  const [error, setError] = useState("")

  const toggleInterest = (id: string) => {
    const newSelected = new Set(selectedInterests)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedInterests(newSelected)
    setError("")
  }

  const handleSubmit = () => {
    if (selectedInterests.size === 0) {
      setError("Please select at least one interest")
      return
    }
    onInterestsSubmit()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl">Tell us your interests</CardTitle>
          <CardDescription>Help us personalize your campus experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interests.map((interest) => (
              <label
                key={interest.id}
                className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors"
              >
                <Checkbox
                  checked={selectedInterests.has(interest.id)}
                  onCheckedChange={() => toggleInterest(interest.id)}
                  id={interest.id}
                />
                <span className="text-lg">{interest.emoji}</span>
                <span className="font-medium text-foreground">{interest.label}</span>
              </label>
            ))}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>
            )}

            <Button
              onClick={handleSubmit}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium mt-6"
            >
              Continue to Dashboard
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">Logged in as: {userEmail}</p>
        </CardContent>
      </Card>
    </div>
  )
}
