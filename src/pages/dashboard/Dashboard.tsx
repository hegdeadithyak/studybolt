import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Plus, 
  Search, 
  MessageSquare, 
  Settings, 
  User,
  Zap,
  FileText,
  Clock,
  TrendingUp
} from "lucide-react";

// Mock data
const notebooks = [
  {
    id: 1,
    title: "Computer Science 101",
    description: "Introduction to algorithms and data structures",
    noteCount: 24,
    lastUpdated: "2 hours ago",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Mathematics",
    description: "Calculus and linear algebra notes",
    noteCount: 18,
    lastUpdated: "1 day ago",
    color: "bg-green-500",
  },
  {
    id: 3,
    title: "Physics",
    description: "Quantum mechanics and thermodynamics",
    noteCount: 31,
    lastUpdated: "3 days ago",
    color: "bg-purple-500",
  },
];

const recentChats = [
  {
    id: 1,
    title: "Binary Search Trees",
    notebook: "Computer Science 101",
    lastMessage: "Can you explain the insertion process?",
    timestamp: "1 hour ago",
  },
  {
    id: 2,
    title: "Integration by Parts",
    notebook: "Mathematics",
    lastMessage: "Show me step-by-step solution",
    timestamp: "2 hours ago",
  },
];

export const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="gradient-primary p-2 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-gradient">StudyBolt</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notebooks and chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
          <p className="text-muted-foreground text-lg">
            Ready to continue your learning journey? Let's dive into your studies.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Notebooks</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Notes</p>
                  <p className="text-2xl font-bold">73</p>
                </div>
                <div className="bg-accent/10 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Study Streak</p>
                  <p className="text-2xl font-bold">12 days</p>
                </div>
                <div className="bg-orange-500/10 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Notebooks Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Your Notebooks</h2>
              <Button variant="hero" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Notebook
              </Button>
            </div>

            <div className="grid gap-6">
              {notebooks.map((notebook) => (
                <Card key={notebook.id} className="card-shadow hover:card-shadow-hover transition-smooth cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${notebook.color} rounded-lg flex items-center justify-center`}>
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{notebook.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {notebook.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span>{notebook.noteCount} notes</span>
                        <span>•</span>
                        <span>Updated {notebook.lastUpdated}</span>
                      </div>
                      <Clock className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Chats Sidebar */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Chats</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {recentChats.map((chat) => (
                <Card key={chat.id} className="card-shadow hover:card-shadow-hover transition-smooth cursor-pointer">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-sm line-clamp-1">{chat.title}</h3>
                        <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                      </div>
                      <p className="text-xs text-muted-foreground">{chat.notebook}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{chat.lastMessage}</p>
                      <p className="text-xs text-muted-foreground">{chat.timestamp}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="card-shadow bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 mx-auto mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">AI Study Tips</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get personalized study recommendations based on your learning patterns.
                </p>
                <Button variant="premium" size="sm">
                  Get Insights
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};