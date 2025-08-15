"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  MessageSquare, 
  Send, 
  Search, 
  Filter, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Phone, 
  Mail, 
  Clock, 
  Check, 
  CheckCheck, 
  User, 
  Users, 
  Building2, 
  Bell,
  ChevronUp,
  ChevronDown,
  X,
  Plus,
  FileText,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  Edit,
  Copy
} from "lucide-react"

// Message data structure
interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  senderType: "association" | "planter" | "admin" | "system"
  recipientId: string
  recipientName: string
  recipientType: "association" | "planter" | "admin" | "system"
  subject: string
  content: string
  timestamp: string
  isRead: boolean
  isStarred: boolean
  isArchived: boolean
  attachments?: string[]
  templateId?: string
  priority: "low" | "medium" | "high" | "urgent"
  category: "general" | "production" | "billing" | "assistance" | "announcement" | "reminder"
}

// Template data structure
interface MessageTemplate {
  id: string
  name: string
  subject: string
  content: string
  category: string
  variables: string[]
  createdBy: string
  isDefault: boolean
}

// Contact data structure
interface Contact {
  id: string
  name: string
  avatar?: string
  type: "association" | "planter" | "admin"
  email: string
  phone?: string
  isOnline: boolean
  lastSeen?: string
  unreadCount: number
}

export function MessagingSystem() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState("inbox")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [newMessage, setNewMessage] = useState({
    recipientId: "",
    subject: "",
    content: "",
    priority: "medium" as const,
    category: "general" as const
  })
  const [showTemplates, setShowTemplates] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock data for messages
  const messages: Message[] = [
    {
      id: "MSG-001",
      senderId: "ASSO-001",
      senderName: "NOSPA",
      senderType: "association",
      recipientId: "ADMIN-001",
      recipientName: "System Admin",
      recipientType: "admin",
      subject: "Monthly Production Report",
      content: "Dear Admin, Please find attached the monthly production report for NOSPA members. Total production this month reached 1,250 tons with an average sugar content of 12.8%. Best regards, NOSPA Management",
      timestamp: "2024-01-15T10:30:00Z",
      isRead: false,
      isStarred: true,
      isArchived: false,
      priority: "high",
      category: "production"
    },
    {
      id: "MSG-002",
      senderId: "ADMIN-001",
      senderName: "System Admin",
      senderType: "admin",
      recipientId: "ASSO-001",
      recipientName: "NOSPA",
      recipientType: "association",
      subject: "New Association Registration Process",
      content: "Hello NOSPA, We have updated the association registration process. Please review the new guidelines and update your member registration procedures accordingly. The new system will be effective starting next month.",
      timestamp: "2024-01-14T14:20:00Z",
      isRead: true,
      isStarred: false,
      isArchived: false,
      priority: "medium",
      category: "announcement"
    },
    {
      id: "MSG-003",
      senderId: "PLANTER-001",
      senderName: "Juan Dela Cruz",
      senderType: "planter",
      recipientId: "ASSO-001",
      recipientName: "NOSPA",
      recipientType: "association",
      subject: "Fertilizer Assistance Request",
      content: "Good day NOSPA, I would like to request fertilizer assistance for my 25-hectare farm. My current stock is running low and I need to prepare for the next planting season. Please advise on the application process.",
      timestamp: "2024-01-13T09:15:00Z",
      isRead: true,
      isStarred: false,
      isArchived: false,
      priority: "medium",
      category: "assistance"
    },
    {
      id: "MSG-004",
      senderId: "SYSTEM",
      senderName: "System Notification",
      senderType: "system",
      recipientId: "ASSO-001",
      recipientName: "NOSPA",
      recipientType: "association",
      subject: "Payment Reminder",
      content: "This is a reminder that your monthly association dues payment is due in 5 days. Please ensure timely payment to maintain your active status. Amount due: ₱5,000.00",
      timestamp: "2024-01-12T16:45:00Z",
      isRead: false,
      isStarred: false,
      isArchived: false,
      priority: "urgent",
      category: "reminder"
    }
  ]

  // Mock data for templates
  const templates: MessageTemplate[] = [
    {
      id: "TEMP-001",
      name: "Production Report Template",
      subject: "Monthly Production Report - {month} {year}",
      content: "Dear {recipient},\n\nPlease find attached the monthly production report for {association} members.\n\nKey Highlights:\n- Total Production: {totalProduction} tons\n- Average Sugar Content: {avgSugarContent}%\n- Number of Active Planters: {activePlanters}\n\nBest regards,\n{association} Management",
      category: "production",
      variables: ["recipient", "association", "month", "year", "totalProduction", "avgSugarContent", "activePlanters"],
      createdBy: "ASSO-001",
      isDefault: true
    },
    {
      id: "TEMP-002",
      name: "Payment Reminder",
      subject: "Payment Reminder - Association Dues",
      content: "Dear {planterName},\n\nThis is a friendly reminder that your association dues payment is due on {dueDate}.\n\nAmount Due: ₱{amount}\nDue Date: {dueDate}\n\nPlease ensure timely payment to maintain your active membership status.\n\nBest regards,\n{association} Management",
      category: "billing",
      variables: ["planterName", "dueDate", "amount", "association"],
      createdBy: "ASSO-001",
      isDefault: true
    },
    {
      id: "TEMP-003",
      name: "Assistance Approval",
      subject: "Assistance Request Approved",
      content: "Dear {planterName},\n\nYour assistance request for {assistanceType} has been approved.\n\nDetails:\n- Request ID: {requestId}\n- Assistance Type: {assistanceType}\n- Quantity: {quantity}\n- Delivery Date: {deliveryDate}\n\nPlease prepare for delivery on the specified date.\n\nBest regards,\n{association} Management",
      category: "assistance",
      variables: ["planterName", "assistanceType", "requestId", "quantity", "deliveryDate", "association"],
      createdBy: "ASSO-001",
      isDefault: false
    },
    {
      id: "TEMP-004",
      name: "General Announcement",
      subject: "Important Announcement - {title}",
      content: "Dear {recipient},\n\n{announcementContent}\n\nImportant Details:\n{details}\n\nPlease take note of this information and share with relevant parties.\n\nBest regards,\n{association} Management",
      category: "announcement",
      variables: ["recipient", "title", "announcementContent", "details", "association"],
      createdBy: "ASSO-001",
      isDefault: true
    }
  ]

  // Mock data for contacts
  const contacts: Contact[] = [
    {
      id: "ASSO-001",
      name: "NOSPA",
      type: "association",
      email: "info@nospa.org.ph",
      phone: "+63 35 123 4567",
      isOnline: true,
      unreadCount: 2
    },
    {
      id: "ASSO-002",
      name: "BASUCO",
      type: "association",
      email: "contact@basuco.org.ph",
      phone: "+63 35 234 5678",
      isOnline: false,
      lastSeen: "2 hours ago",
      unreadCount: 0
    },
    {
      id: "PLANTER-001",
      name: "Juan Dela Cruz",
      type: "planter",
      email: "juan.delacruz@email.com",
      phone: "+63 912 345 6789",
      isOnline: true,
      unreadCount: 1
    },
    {
      id: "ADMIN-001",
      name: "System Admin",
      type: "admin",
      email: "admin@philagro.org",
      phone: "+63 2 8123 4567",
      isOnline: true,
      unreadCount: 0
    }
  ]

  const unreadCount = messages.filter(msg => !msg.isRead).length

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge className="bg-red-100 text-red-800">Urgent</Badge>
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default:
        return null
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "production":
        return <Building2 className="h-4 w-4" />
      case "billing":
        return <FileText className="h-4 w-4" />
      case "assistance":
        return <Users className="h-4 w-4" />
      case "announcement":
        return <Bell className="h-4 w-4" />
      case "reminder":
        return <Clock className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.senderName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || message.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedContact])

  return (
    <>
      {/* Floating Message Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 rounded-full bg-farm-green-600 hover:bg-farm-green-700 shadow-lg relative"
        >
          <MessageSquare className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 text-xs bg-red-500 text-white flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Messaging Interface */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-farm-green-600 text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <h3 className="font-semibold">Messages</h3>
              {unreadCount > 0 && (
                <Badge className="bg-white text-farm-green-600 text-xs">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0 text-white hover:bg-farm-green-700"
              >
                {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-white hover:bg-farm-green-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <div className="flex-1 flex flex-col">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="inbox">Inbox</TabsTrigger>
                  <TabsTrigger value="compose">Compose</TabsTrigger>
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                </TabsList>

                {/* Inbox Tab */}
                <TabsContent value="inbox" className="flex-1 flex flex-col p-0">
                  <div className="p-3 border-b border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Search className="h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="assistance">Assistance</SelectItem>
                        <SelectItem value="announcement">Announcement</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <ScrollArea className="flex-1">
                    <div className="p-2 space-y-2">
                      {filteredMessages.map((message) => (
                        <div
                          key={message.id}
                          onClick={() => setSelectedMessage(message)}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            message.isRead 
                              ? "bg-white border-gray-200 hover:bg-gray-50" 
                              : "bg-blue-50 border-blue-200 hover:bg-blue-100"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {message.senderName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-sm">{message.senderName}</span>
                              {!message.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {getPriorityBadge(message.priority)}
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(message.timestamp)}
                              </span>
                            </div>
                          </div>
                          <div className="mb-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getCategoryIcon(message.category)}
                              <span className="font-medium text-sm">{message.subject}</span>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                {/* Compose Tab */}
                <TabsContent value="compose" className="flex-1 flex flex-col p-3">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">To:</label>
                      <Select value={newMessage.recipientId} onValueChange={(value) => setNewMessage(prev => ({ ...prev, recipientId: value }))}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Select recipient" />
                        </SelectTrigger>
                        <SelectContent>
                          {contacts.map((contact) => (
                            <SelectItem key={contact.id} value={contact.id}>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-4 w-4">
                                  <AvatarFallback className="text-xs">
                                    {contact.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{contact.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Subject:</label>
                      <Input
                        value={newMessage.subject}
                        onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                        className="h-8 text-sm"
                        placeholder="Enter subject"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Message:</label>
                      <Textarea
                        value={newMessage.content}
                        onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                        className="text-sm min-h-[100px]"
                        placeholder="Type your message..."
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Select value={newMessage.priority} onValueChange={(value) => setNewMessage(prev => ({ ...prev, priority: value as any }))}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={newMessage.category} onValueChange={(value) => setNewMessage(prev => ({ ...prev, category: value as any }))}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="production">Production</SelectItem>
                          <SelectItem value="billing">Billing</SelectItem>
                          <SelectItem value="assistance">Assistance</SelectItem>
                          <SelectItem value="announcement">Announcement</SelectItem>
                          <SelectItem value="reminder">Reminder</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" className="bg-farm-green-600 hover:bg-farm-green-700">
                        <Send className="h-4 w-4 mr-1" />
                        Send
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowTemplates(true)}>
                        <FileText className="h-4 w-4 mr-1" />
                        Templates
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Templates Tab */}
                <TabsContent value="templates" className="flex-1 p-3">
                  <ScrollArea className="h-full">
                    <div className="space-y-3">
                      {templates.map((template) => (
                        <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm">{template.name}</CardTitle>
                              {template.isDefault && (
                                <Badge variant="outline" className="text-xs">Default</Badge>
                              )}
                            </div>
                            <CardDescription className="text-xs">{template.category}</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-2">
                              <div>
                                <label className="text-xs font-medium">Subject:</label>
                                <p className="text-xs text-gray-600">{template.subject}</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium">Content:</label>
                                <p className="text-xs text-gray-600 line-clamp-3">{template.content}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-xs"
                                  onClick={() => {
                                    setNewMessage(prev => ({
                                      ...prev,
                                      subject: template.subject,
                                      content: template.content,
                                    }))
                                    setActiveTab("compose")
                                  }}
                                >
                                  <Copy className="h-3 w-3 mr-1" />
                                  Use Template
                                </Button>
                                <Button size="sm" variant="ghost" className="text-xs">
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      )}

      {/* Message Detail Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedMessage && (
            <div className="space-y-4">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarFallback>{selectedMessage.senderName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <DialogTitle className="text-lg">{selectedMessage.subject}</DialogTitle>
                      <DialogDescription>
                        From: {selectedMessage.senderName} • {formatTimestamp(selectedMessage.timestamp)}
                      </DialogDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(selectedMessage.priority)}
                    <Button variant="ghost" size="sm">
                      <Star className={`h-4 w-4 ${selectedMessage.isStarred ? 'text-yellow-500 fill-current' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Reply className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Forward className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>

                {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Attachments:</h4>
                    <div className="space-y-2">
                      {selectedMessage.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <Paperclip className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{attachment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-4 border-t">
                  <Button size="sm" className="bg-farm-green-600 hover:bg-farm-green-700">
                    <Reply className="h-4 w-4 mr-1" />
                    Reply
                  </Button>
                  <Button variant="outline" size="sm">
                    <Forward className="h-4 w-4 mr-1" />
                    Forward
                  </Button>
                  <Button variant="outline" size="sm">
                    <Archive className="h-4 w-4 mr-1" />
                    Archive
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Template Selection Dialog */}
      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Message Template</DialogTitle>
            <DialogDescription>
              Choose a template to use for your message
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {templates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription>{template.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium">Subject:</label>
                      <p className="text-sm text-gray-600">{template.subject}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Content:</label>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{template.content}</p>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-farm-green-600 hover:bg-farm-green-700"
                      onClick={() => {
                        setNewMessage(prev => ({
                          ...prev,
                          subject: template.subject,
                          content: template.content
                        }))
                        setShowTemplates(false)
                        setActiveTab("compose")
                      }}
                    >
                      Use This Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 