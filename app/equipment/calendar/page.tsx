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
          <Card className="col-span-3 md:col-span-1 border-farm-earth-200 bg-gradient-to-br from-white to-farm-earth-50 shadow-lg min-h-[600px] flex flex-col">
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
            <CardContent className="p-0 flex-1 flex flex-col">
              <div className="w-full h-full flex-1 flex flex-col p-4">
                <div className="w-full h-full flex-1 bg-white rounded-lg border border-farm-earth-200 overflow-hidden">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="w-full h-full flex-1"
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full h-full",
                      month: "space-y-4 w-full h-full flex-1",
                      caption: "flex justify-center pt-1 relative items-center w-full",
                      caption_label: "text-sm font-medium",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1 flex-1",
                      head_row: "flex w-full",
                      head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem] text-center",
                      row: "flex w-full mt-2 flex-1",
                      cell: "h-12 w-full text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "h-12 w-full p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-accent hover:text-accent-foreground",
                      day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      day_today: "bg-accent text-accent-foreground",
                      day_outside: "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
                      day_disabled: "text-muted-foreground opacity-50",
                      day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                      day_hidden: "invisible",
                    }}
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
                </div>
              </div>
              <div className="mt-auto p-4 border-t border-farm-earth-200 bg-farm-earth-50 rounded-b-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-farm-earth-700">Filter:</span>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[160px] border-farm-earth-300 bg-white rounded-md">
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
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-farm-earth-300 border border-farm-earth-400"></div>
                      <span className="text-xs font-medium text-farm-earth-700">Has Bookings</span>
                    </div>
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
