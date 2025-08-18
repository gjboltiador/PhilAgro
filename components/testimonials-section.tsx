import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  { name: "Maria Rodriguez", location: "Central Valley Farm", content: "Increased profits by 30%.", rating: 5 },
  { name: "James Thompson", location: "Thompson Plantation", content: "World-class training and support.", rating: 5 },
  { name: "Sarah Chen", location: "Green Fields Co-op", content: "Equipment sharing saved thousands.", rating: 5 },
]

export function TestimonialsSection() {
  return (
    <section className="py-10 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, idx) => (
            <Card key={idx} className="bg-background">
              <CardContent className="p-5">
                <div className="flex mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-3 italic">"{t.content}"</p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}


