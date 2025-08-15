"use client"

import { DashboardLayout } from "@/components/sidebar-navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Newspaper, 
  TrendingUp,
  Calendar,
  User,
  Tag,
  Search,
  Filter,
  Bookmark,
  Share2,
  ExternalLink,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  BarChart3
} from "lucide-react"
import { useState } from "react"

interface NewsArticle {
  id: string
  title: string
  summary: string
  content: string
  author: string
  publishedDate: string
  category: string
  tags: string[]
  imageUrl?: string
  readTime: number
  isBookmarked: boolean
  isFeatured: boolean
}

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Mock news data
  const newsArticles: NewsArticle[] = [
    {
      id: "1",
      title: "Philippine Sugar Production Expected to Increase by 15% in 2024",
      summary: "The Philippine Sugar Administration projects a significant increase in sugar production for the 2024 crop year, driven by improved farming practices and favorable weather conditions.",
      content: "The Philippine Sugar Administration (SRA) has released its latest production forecast, indicating a 15% increase in sugar production for the 2024 crop year. This optimistic projection is based on several factors including improved farming practices, better irrigation systems, and favorable weather conditions across major sugar-producing regions. The forecast shows that total production could reach 2.2 million metric tons, up from 1.9 million metric tons in 2023. This increase is expected to help stabilize domestic sugar prices and reduce import dependency.",
      author: "Maria Santos",
      publishedDate: "2024-01-20T08:00:00Z",
      category: "Production",
      tags: ["Production", "Forecast", "SRA", "2024"],
      readTime: 5,
      isBookmarked: false,
      isFeatured: true
    },
    {
      id: "2",
      title: "New Sustainable Farming Techniques Show Promise for Sugarcane Cultivation",
      summary: "Researchers at the University of the Philippines have developed innovative sustainable farming techniques that could revolutionize sugarcane cultivation in the country.",
      content: "A team of researchers from the University of the Philippines College of Agriculture has developed new sustainable farming techniques specifically designed for sugarcane cultivation. These techniques focus on water conservation, soil health improvement, and reduced chemical usage while maintaining or improving crop yields. The research, conducted over three years in various sugarcane-growing regions, shows that these methods can reduce water usage by up to 30% and chemical fertilizer application by 25% while maintaining similar or better yields compared to traditional methods.",
      author: "Dr. Juan Dela Cruz",
      publishedDate: "2024-01-19T14:30:00Z",
      category: "Technology",
      tags: ["Technology", "Sustainability", "Research", "Innovation"],
      readTime: 7,
      isBookmarked: true,
      isFeatured: false
    },
    {
      id: "3",
      title: "Global Sugar Prices Reach 12-Year High: Impact on Philippine Market",
      summary: "International sugar prices have surged to their highest level in 12 years, creating both opportunities and challenges for Philippine sugar producers and consumers.",
      content: "Global sugar prices have reached their highest level in 12 years, driven by supply constraints in major producing countries and increased demand. The benchmark ICE sugar futures contract recently traded at $0.28 per pound, the highest since 2011. This surge in international prices has created a complex situation for the Philippine sugar industry. While higher prices benefit sugar producers and farmers, they also increase costs for food manufacturers and consumers. The Philippine Sugar Regulatory Administration is closely monitoring the situation and considering various measures to ensure market stability.",
      author: "Roberto Garcia",
      publishedDate: "2024-01-18T10:15:00Z",
      category: "Market",
      tags: ["Market", "Global Prices", "Economics", "Trade"],
      readTime: 6,
      isBookmarked: false,
      isFeatured: true
    },
    {
      id: "4",
      title: "Weather Alert: El Niño Conditions Expected to Affect Sugarcane Regions",
      summary: "The Philippine Atmospheric, Geophysical and Astronomical Services Administration (PAGASA) has issued weather alerts for major sugarcane-producing regions due to developing El Niño conditions.",
      content: "PAGASA has issued weather alerts for major sugarcane-producing regions including Negros Occidental, Negros Oriental, and Bukidnon due to developing El Niño conditions. The weather phenomenon is expected to bring below-normal rainfall and above-normal temperatures to these areas, which could impact sugarcane growth and development. Farmers are advised to implement water conservation measures and consider adjusting their planting schedules. The Department of Agriculture has also announced support programs to help farmers mitigate the potential impacts of the weather conditions.",
      author: "Ana Martinez",
      publishedDate: "2024-01-17T16:45:00Z",
      category: "Weather",
      tags: ["Weather", "El Niño", "Climate", "Alert"],
      readTime: 4,
      isBookmarked: true,
      isFeatured: false
    },
    {
      id: "5",
      title: "Government Announces New Support Programs for Sugarcane Farmers",
      summary: "The Department of Agriculture has unveiled new support programs aimed at helping sugarcane farmers improve productivity and sustainability.",
      content: "The Department of Agriculture (DA) has announced comprehensive support programs for sugarcane farmers across the Philippines. These programs include financial assistance for farm mechanization, training programs on modern farming techniques, and subsidies for sustainable farming inputs. The initiative, worth ₱2.5 billion, aims to help farmers improve productivity, reduce production costs, and adopt more sustainable farming practices. The programs will be implemented in partnership with local government units and agricultural cooperatives, with priority given to small-scale farmers and those in less developed regions.",
      author: "Carlos Reyes",
      publishedDate: "2024-01-16T11:20:00Z",
      category: "Policy",
      tags: ["Policy", "Government", "Support", "Farmers"],
      readTime: 8,
      isBookmarked: false,
      isFeatured: false
    },
    {
      id: "6",
      title: "Innovative Pest Management Solutions for Sugarcane Farms",
      summary: "New integrated pest management solutions are helping sugarcane farmers reduce crop losses while minimizing environmental impact.",
      content: "Agricultural researchers have developed innovative integrated pest management (IPM) solutions specifically for sugarcane farms. These solutions combine biological control methods, precision application of pesticides, and early warning systems to help farmers manage pest infestations more effectively. The new approach has shown promising results in field trials, reducing crop losses by up to 40% while decreasing pesticide usage by 60%. The system includes mobile apps that help farmers identify pests early and determine the most appropriate control measures. Training programs are being conducted across major sugarcane regions to help farmers adopt these new techniques.",
      author: "Dr. Sofia Rodriguez",
      publishedDate: "2024-01-15T13:10:00Z",
      category: "Technology",
      tags: ["Technology", "Pest Management", "Innovation", "Sustainability"],
      readTime: 6,
      isBookmarked: true,
      isFeatured: false
    }
  ]

  const categories = [
    { id: "all", name: "All News", count: newsArticles.length },
    { id: "production", name: "Production", count: newsArticles.filter(article => article.category.toLowerCase() === "production").length },
    { id: "market", name: "Market", count: newsArticles.filter(article => article.category.toLowerCase() === "market").length },
    { id: "technology", name: "Technology", count: newsArticles.filter(article => article.category.toLowerCase() === "technology").length },
    { id: "weather", name: "Weather", count: newsArticles.filter(article => article.category.toLowerCase() === "weather").length },
    { id: "policy", name: "Policy", count: newsArticles.filter(article => article.category.toLowerCase() === "policy").length }
  ]

  const filteredArticles = newsArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || article.category.toLowerCase() === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredArticles = newsArticles.filter(article => article.isFeatured)
  const bookmarkedArticles = newsArticles.filter(article => article.isBookmarked)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <ProtectedRoute requiredPermission="news_updates">
      <DashboardLayout>
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-green-800">Sugarcane Farming News</h1>
              <p className="text-sm sm:text-base text-green-600">Latest industry updates, market insights, and farming tips</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                <Bookmark className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Bookmarks</span>
                <span className="sm:hidden">Saved</span>
              </Button>
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                <Share2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Share News</span>
                <span className="sm:hidden">Share</span>
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="border-green-200 rounded-xl">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search news articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name} ({category.count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                    <Filter className="h-4 w-4 mr-2" />
                    Advanced Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Articles */}
          {featuredArticles.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-green-800 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Featured Articles
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredArticles.map((article) => (
                  <Card key={article.id} className="border-green-200 rounded-xl hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <Badge className="bg-green-100 text-green-800">{article.category}</Badge>
                          <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                            {article.title}
                          </CardTitle>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription className="text-gray-600 line-clamp-3">
                        {article.summary}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {article.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(article.publishedDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {article.readTime} min read
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                          Read More
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 border border-green-200 p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                <Newspaper className="h-4 w-4 mr-2" />
                All News
              </TabsTrigger>
              <TabsTrigger value="latest" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                <Clock className="h-4 w-4 mr-2" />
                Latest
              </TabsTrigger>
              <TabsTrigger value="bookmarked" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                <Bookmark className="h-4 w-4 mr-2" />
                Bookmarked
              </TabsTrigger>
              <TabsTrigger value="trending" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending
              </TabsTrigger>
            </TabsList>

            {/* All News Tab */}
            <TabsContent value="all" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Badge className="bg-blue-100 text-blue-800">{article.category}</Badge>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardTitle className="text-base font-bold text-gray-900 line-clamp-2">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 line-clamp-3">
                        {article.summary}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <span>{article.author}</span>
                          <span>•</span>
                          <span>{formatDate(article.publishedDate)}</span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.readTime}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex flex-wrap gap-1">
                          {article.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                          Read
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Latest News Tab */}
            <TabsContent value="latest" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles
                  .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
                  .slice(0, 6)
                  .map((article) => (
                    <Card key={article.id} className="border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <Badge className="bg-orange-100 text-orange-800">Latest</Badge>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardTitle className="text-base font-bold text-gray-900 line-clamp-2">
                          {article.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 line-clamp-3">
                          {article.summary}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <span>{article.author}</span>
                            <span>•</span>
                            <span>{formatDate(article.publishedDate)}</span>
                          </div>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {article.readTime}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 mt-3">
                          Read More
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            {/* Bookmarked News Tab */}
            <TabsContent value="bookmarked" className="space-y-4 mt-6">
              {bookmarkedArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookmarkedArticles.map((article) => (
                    <Card key={article.id} className="border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <Badge className="bg-purple-100 text-purple-800">Bookmarked</Badge>
                          <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
                            <Bookmark className="h-4 w-4 fill-current" />
                          </Button>
                        </div>
                        <CardTitle className="text-base font-bold text-gray-900 line-clamp-2">
                          {article.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 line-clamp-3">
                          {article.summary}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <span>{article.author}</span>
                            <span>•</span>
                            <span>{formatDate(article.publishedDate)}</span>
                          </div>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {article.readTime}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 mt-3">
                          Read More
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-gray-200 rounded-xl">
                  <CardContent className="pt-6 text-center">
                    <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bookmarked Articles</h3>
                    <p className="text-gray-600">Start bookmarking articles to see them here</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Trending News Tab */}
            <TabsContent value="trending" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles
                  .filter(article => article.isFeatured || article.category === "Market" || article.category === "Technology")
                  .map((article) => (
                    <Card key={article.id} className="border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <Badge className="bg-red-100 text-red-800">Trending</Badge>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardTitle className="text-base font-bold text-gray-900 line-clamp-2">
                          {article.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 line-clamp-3">
                          {article.summary}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <span>{article.author}</span>
                            <span>•</span>
                            <span>{formatDate(article.publishedDate)}</span>
                          </div>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {article.readTime}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 mt-3">
                          Read More
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
} 