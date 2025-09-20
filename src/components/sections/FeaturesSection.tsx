import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageSquare, 
  Search, 
  BookOpen, 
  Zap, 
  Share2, 
  Shield,
  Brain,
  Clock,
  Users
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Conversational AI",
    description: "Chat with your notes using advanced AI that understands context and provides detailed explanations.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Search,
    title: "Semantic Search",
    description: "Find information by meaning, not just keywords. Our AI understands what you're looking for.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: BookOpen,
    title: "Smart Notebooks",
    description: "Organize your study materials with intelligent categorization and cross-referencing.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get instant responses with our optimized AI infrastructure and streaming technology.",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    icon: Brain,
    title: "Learning Analytics",
    description: "Track your progress and get personalized study recommendations based on your learning patterns.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Export notes to markdown or PDF, share notebooks with study groups, and collaborate seamlessly.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is encrypted and secure. We never use your personal notes to train our models.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: Clock,
    title: "Study Sessions",
    description: "Organized study sessions with conversation history and the ability to pick up where you left off.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share notebooks with teammates, create study groups, and learn together with shared AI insights.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 lg:py-32 bg-muted/30">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Everything you need to{" "}
            <span className="text-gradient">study smarter</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            StudyBolt combines powerful AI with intuitive design to create the ultimate study companion.
            From note organization to AI-powered explanations, we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="card-shadow hover:card-shadow-hover transition-smooth border-0 bg-background/60 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};