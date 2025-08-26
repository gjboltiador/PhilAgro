import { Button } from "@/components/ui/button"
import { Wheat, Users, TrendingUp } from "lucide-react"

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-[520px] flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/5">
      <div className="absolute inset-0 bg-[url('/placeholder.jpg')] bg-cover bg-center opacity-20"></div>
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Growing Together, <span className="text-primary">Harvesting Success</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            Join our association to access programs, pricing, advisories, and a strong farmer community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base px-8 py-3">
              Become a Member
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8 py-3 bg-transparent">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}


