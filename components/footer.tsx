import Link from "next/link"
import { Wheat } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-6 text-sm text-farm-green-700 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Wheat className="h-4 w-4 text-farm-green-600" />
          <span>© {new Date().getFullYear()} Phil Agro • Sugar Farmers Association</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="hover:text-farm-green-900">Home</Link>
          <Link href="#about" className="hover:text-farm-green-900">About</Link>
          <Link href="#services" className="hover:text-farm-green-900">Services</Link>
          <Link href="#contact" className="hover:text-farm-green-900">Contact</Link>
        </div>
      </div>
    </footer>
  )
}


