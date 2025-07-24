import { CalendarClock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface EquipmentBookingsProps {
  extended?: boolean
}

export function EquipmentBookings({ extended = false }: EquipmentBookingsProps) {
  const bookings = [
    {
      id: "BK-1234",
      equipment: "Tractor - John Deere 5E",
      requester: "Juan Dela Cruz",
      date: "Today, 2:00 PM",
      status: "Confirmed",
    },
    {
      id: "BK-1235",
      equipment: "Truck - Isuzu ELF",
      requester: "Maria Santos",
      date: "Tomorrow, 9:00 AM",
      status: "Pending",
    },
    {
      id: "BK-1236",
      equipment: "Harvester - Case IH",
      requester: "Pedro Reyes",
      date: "Jul 15, 8:00 AM",
      status: "Confirmed",
    },
    {
      id: "BK-1237",
      equipment: "Sprayer - Jacto",
      requester: "Ana Gonzales",
      date: "Jul 16, 10:00 AM",
      status: "Confirmed",
    },
    {
      id: "BK-1238",
      equipment: "Truck - Fuso Canter",
      requester: "Carlos Mendoza",
      date: "Jul 17, 1:00 PM",
      status: "Pending",
    },
  ]

  // Only show first 4 if not extended
  const displayBookings = extended ? bookings : bookings.slice(0, 4)

  return (
    <div className="space-y-4">
      {displayBookings.map((booking) => (
        <div key={booking.id} className="flex items-center gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <CalendarClock className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{booking.equipment}</p>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">{booking.requester}</p>
              <span className="text-xs text-muted-foreground">•</span>
              <p className="text-xs text-muted-foreground">{booking.date}</p>
            </div>
          </div>
          <Badge variant={booking.status === "Confirmed" ? "default" : "outline"}>{booking.status}</Badge>
        </div>
      ))}
    </div>
  )
}
