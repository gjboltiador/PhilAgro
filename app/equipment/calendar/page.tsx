"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/sidebar-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

export default function BookingCalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState("month")

  // Sample booking events
  const bookingEvents = [
    { date: new Date(2024, 6, 12), count: 3 },
    { date: new Date(2024, 6, 15), count: 2 },
    { date: new Date(2024, 6, 18), count: 1 },
    { date: new Date(2024, 6, 22), count: 4 },
    { date: new Date(2024, 6, 25), count: 2 },
  ]

  // Sample daily schedule for the selected date
  const dailySchedule = [
    {
      time: "08:00 AM - 12:00 PM",
      equipment: "Tractor - John Deere 5E",
      requester: "Juan Dela Cruz",
      location: "North Field, Negros Occidental",
      status: "Confirmed",
    },
    {
      time: "09:30 AM - 02:00 PM",
      equipment: "Truck - Isuzu ELF",
      requester: "Maria Santos",
      location: "East Plantation, Batangas",
      status: "Confirmed",
    },
    {
      time: "01:00 PM - 05:00 PM",
      equipment: "Harvester - Case IH",
      requester: "Pedro Reyes",
      location: "South Field, Iloilo",
      status: "Pending",
    },
  ]

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-farm-earth-800">Equipment Booking Calendar</h2>
          <Button className="bg-farm-earth-600 hover:bg-farm-earth-700">
            <Plus className="mr-2 h-4 w-4" />
            New Booking
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="col-span-3 md:col-span-1 border-farm-earth-200 bg-gradient-to-br from-white to-farm-earth-50 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-farm-earth-800">Calendar</CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 border-farm-earth-300 hover:bg-farm-earth-100 bg-transparent"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 border-farm-earth-300 hover:bg-farm-earth-100 bg-transparent"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription className="text-farm-earth-600">Select a date to view bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border border-farm-earth-200"
                modifiers={{
                  booked: bookingEvents.map((event) => event.date),
                }}
                modifiersStyles={{
                  booked: {
                    fontWeight: "bold",
                    backgroundColor: "hsl(var(--farm-earth-100))",
                    color: "hsl(var(--farm-earth-700))",
                  },
                }}
              />
              <div className="mt-4 flex items-center justify-between">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px] border-farm-earth-300">
                    <SelectValue placeholder="Equipment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Equipment</SelectItem>
                    <SelectItem value="tractors">Tractors</SelectItem>
                    <SelectItem value="trucks">Trucks</SelectItem>
                    <SelectItem value="harvesters">Harvesters</SelectItem>
                    <SelectItem value="other">Other Equipment</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-farm-earth-200"></div>
                    <span className="text-xs text-muted-foreground">Has Bookings</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3 md:col-span-2 border-farm-earth-200 bg-gradient-to-br from-white to-farm-earth-50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-farm-earth-800">
                {date?.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardTitle>
              <CardDescription className="text-farm-earth-600">
                Equipment bookings for the selected date
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dailySchedule.length > 0 ? (
                <div className="space-y-4">
                  {dailySchedule.map((booking, index) => (
                    <div
                      key={index}
                      className="flex flex-col rounded-lg border border-farm-earth-200 p-4 sm:flex-row sm:items-center bg-gradient-to-r from-white to-farm-earth-50"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-farm-earth-800">{booking.equipment}</h4>
                          <Badge
                            variant={booking.status === "Confirmed" ? "default" : "outline"}
                            className={
                              booking.status === "Confirmed" ? "bg-farm-earth-600 hover:bg-farm-earth-700" : ""
                            }
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-farm-earth-600">{booking.time}</p>
                        <p className="text-sm text-farm-earth-700">Requester: {booking.requester}</p>
                        <p className="text-sm text-farm-earth-600">Location: {booking.location}</p>
                      </div>
                      <div className="mt-4 flex justify-end gap-2 sm:mt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-farm-earth-300 hover:bg-farm-earth-100 bg-transparent"
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-farm-earth-300 hover:bg-farm-earth-100 bg-transparent"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-farm-earth-300">
                  <p className="text-sm text-muted-foreground">No bookings for this date</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 border-farm-earth-300 hover:bg-farm-earth-100 bg-transparent"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Booking
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
