"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DashboardPageProps {
  userEmail: string
  onLogout: () => void
}

interface Event {
  id: string
  title: string
  category: string
  date: string
  time: string
  location: string
  description: string
  attendees: number
  emoji: string
}

const recommendedEvents: Event[] = [
  {
    id: "1",
    title: "Introduction to Machine Learning",
    category: "AI & Technology",
    date: "Jan 25, 2026",
    time: "2:00 PM",
    location: "Tech Building, Room 101",
    description: "Learn the fundamentals of machine learning and explore real-world applications.",
    attendees: 42,
    emoji: "🤖",
  },
  {
    id: "2",
    title: "Campus Jazz Night",
    category: "Music & Arts",
    date: "Jan 28, 2026",
    time: "7:00 PM",
    location: "Auditorium",
    description: "Enjoy live jazz performances by student musicians and local artists.",
    attendees: 156,
    emoji: "🎵",
  },
  {
    id: "3",
    title: "Basketball Tournament",
    category: "Sports & Wellness",
    date: "Feb 2, 2026",
    time: "4:00 PM",
    location: "Sports Complex",
    description: "Inter-class basketball championship. Sign up your team today!",
    attendees: 89,
    emoji: "⚽",
  },
  {
    id: "4",
    title: "Community Cleanup Drive",
    category: "Volunteering",
    date: "Feb 5, 2026",
    time: "10:00 AM",
    location: "Campus Grounds",
    description: "Join us in making our campus greener and cleaner.",
    attendees: 64,
    emoji: "🤝",
  },
  {
    id: "5",
    title: "AI Ethics Workshop",
    category: "AI & Technology",
    date: "Feb 8, 2026",
    time: "3:30 PM",
    location: "Innovation Hub",
    description: "Explore ethical considerations in AI development and deployment.",
    attendees: 38,
    emoji: "🤖",
  },
  {
    id: "6",
    title: "Fitness & Wellness Bootcamp",
    category: "Sports & Wellness",
    date: "Feb 10, 2026",
    time: "6:00 AM",
    location: "Gym",
    description: "High-intensity workout session for all fitness levels.",
    attendees: 72,
    emoji: "⚽",
  },
]

export default function DashboardPage({ userEmail, onLogout }: DashboardPageProps) {
  const [savedEvents, setSavedEvents] = useState<Set<string>>(new Set())

  const toggleSaveEvent = (eventId: string) => {
    const newSaved = new Set(savedEvents)
    if (newSaved.has(eventId)) {
      newSaved.delete(eventId)
    } else {
      newSaved.add(eventId)
    }
    setSavedEvents(newSaved)
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "AI & Technology": "bg-blue-100 text-blue-800",
      "Music & Arts": "bg-purple-100 text-purple-800",
      "Sports & Wellness": "bg-green-100 text-green-800",
      Volunteering: "bg-orange-100 text-orange-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <div>
              <h1 className="font-bold text-xl">ConnectED</h1>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
          </div>
          <Button onClick={onLogout} variant="outline" className="text-sm bg-transparent">
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Recommended Events</h2>
          <p className="text-muted-foreground">Discover campus events tailored to your interests</p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow border-0 flex flex-col">
              {/* Card Header with Emoji Background */}
              <div className="h-24 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <span className="text-5xl">{event.emoji}</span>
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge className={`${getCategoryColor(event.category)} border-0`}>{event.category}</Badge>
                </div>
                <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
              </CardHeader>

              <CardContent className="flex-1 pb-3 space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📅</span>
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">⏰</span>
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">📍</span>
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">👥</span>
                    <span>{event.attendees} interested</span>
                  </div>
                </div>
              </CardContent>

              {/* Card Footer Actions */}
              <div className="px-6 pb-4 flex gap-2">
                <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                  Register
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toggleSaveEvent(event.id)}
                  className={`${savedEvents.has(event.id) ? "bg-red-50 border-red-200 text-red-600" : ""}`}
                >
                  {savedEvents.has(event.id) ? "❤️" : "🤍"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
