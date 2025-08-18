import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sprout, DollarSign, BookOpen, Shield, Truck, Users2 } from "lucide-react"

const services = [
  // Existing services
  { icon: Sprout, title: "Crop Advisory", description: "Guidance on cultivation and harvest optimization." },
  { icon: DollarSign, title: "Market Access", description: "Pricing updates and market connections." },
  { icon: BookOpen, title: "Training Programs", description: "Workshops on modern, sustainable practices." },
  { icon: Shield, title: "Insurance Support", description: "Crop insurance and risk management solutions." },
  { icon: Truck, title: "Equipment Sharing", description: "Access to modern equipment through sharing programs." },
  { icon: Users2, title: "Community Network", description: "Connect with fellow farmers and partners." },
  // Additional requested services
  { icon: Sprout, title: "Field Operations", description: "Plan and coordinate land preparation, planting, and harvesting." },
  { icon: DollarSign, title: "Farm Assistance", description: "Fertilizer programs, herbicides catalog, and distribution tracking." },
  { icon: BookOpen, title: "Production Reports", description: "Sugar & molasses analytics, pesada data, and billing summaries." },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-10 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-farm-green-900">Our Services</h2>
          <p className="mt-2 text-farm-green-700">
            Comprehensive support services designed to help sugar farmers thrive in today's agricultural landscape.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-sm transition-shadow">
              <CardHeader className="py-3">
                <div className="bg-primary/10 p-3 rounded-lg w-fit mb-2">
                  <service.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-sm">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs">{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}


