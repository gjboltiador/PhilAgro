import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface RecentRegistrationsProps {
  extended?: boolean
}

export function RecentRegistrations({ extended = false }: RecentRegistrationsProps) {
  const registrations = [
    {
      name: "Juan Dela Cruz",
      email: "juan@example.com",
      type: "Planter",
      date: "2 hours ago",
      status: "Approved",
    },
    {
      name: "Maria Santos",
      email: "maria@example.com",
      type: "Farmer",
      date: "5 hours ago",
      status: "Pending",
    },
    {
      name: "Pedro Reyes",
      email: "pedro@example.com",
      type: "Hauler",
      date: "1 day ago",
      status: "Approved",
    },
    {
      name: "Ana Gonzales",
      email: "ana@example.com",
      type: "Planter",
      date: "2 days ago",
      status: "Approved",
    },
    {
      name: "Carlos Mendoza",
      email: "carlos@example.com",
      type: "Farmer",
      date: "3 days ago",
      status: "Rejected",
    },
  ]

  // Only show first 4 if not extended
  const displayRegistrations = extended ? registrations : registrations.slice(0, 4)

  return (
    <div className="space-y-4">
      {displayRegistrations.map((registration) => (
        <div key={registration.email} className="flex items-center gap-4">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10">
              {registration.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{registration.name}</p>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">{registration.type}</p>
              <span className="text-xs text-muted-foreground">•</span>
              <p className="text-xs text-muted-foreground">{registration.date}</p>
            </div>
          </div>
          <Badge
            variant={
              registration.status === "Approved"
                ? "default"
                : registration.status === "Pending"
                  ? "outline"
                  : "destructive"
            }
          >
            {registration.status}
          </Badge>
        </div>
      ))}
    </div>
  )
}
