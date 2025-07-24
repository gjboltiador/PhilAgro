"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Trash2, Plus } from "lucide-react"

export function PriceAlerts() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      grade: "Raw Sugar",
      condition: "Above",
      targetPrice: 3000,
      currentPrice: 2850,
      status: "Active",
      triggered: false,
    },
    {
      id: 2,
      grade: "Refined Sugar",
      condition: "Below",
      targetPrice: 3100,
      currentPrice: 3200,
      status: "Active",
      triggered: false,
    },
    {
      id: 3,
      grade: "Brown Sugar",
      condition: "Above",
      targetPrice: 2900,
      currentPrice: 2950,
      status: "Triggered",
      triggered: true,
    },
  ])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Price Alert</CardTitle>
          <CardDescription>Set up alerts to be notified when sugar prices reach your target levels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="alert-grade">Sugar Grade</Label>
              <Select>
                <SelectTrigger id="alert-grade">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="raw">Raw Sugar</SelectItem>
                  <SelectItem value="refined">Refined Sugar</SelectItem>
                  <SelectItem value="brown">Brown Sugar</SelectItem>
                  <SelectItem value="muscovado">Muscovado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="alert-condition">Condition</Label>
              <Select>
                <SelectTrigger id="alert-condition">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">Above</SelectItem>
                  <SelectItem value="below">Below</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="alert-price">Target Price (₱)</Label>
              <Input id="alert-price" type="number" placeholder="3000" />
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create Alert
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Price Alerts</CardTitle>
          <CardDescription>Manage your existing price alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sugar Grade</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Target Price</TableHead>
                  <TableHead>Current Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium">{alert.grade}</TableCell>
                    <TableCell>{alert.condition}</TableCell>
                    <TableCell>₱{alert.targetPrice.toLocaleString()}</TableCell>
                    <TableCell>₱{alert.currentPrice.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={alert.triggered ? "destructive" : "default"}>{alert.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Switch defaultChecked={alert.status === "Active"} />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alert Settings</CardTitle>
          <CardDescription>Configure how you receive price alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive alerts via email</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive alerts via SMS</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive alerts in the dashboard</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notification-email">Notification Email</Label>
            <Input id="notification-email" type="email" defaultValue="admin@philagro.org" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notification-phone">Notification Phone</Label>
            <Input id="notification-phone" type="tel" defaultValue="+63 917 123 4567" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
