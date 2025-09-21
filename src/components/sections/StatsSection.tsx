import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, MessageSquare, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "50K+",
    label: "Active Students",
    description: "Students studying smarter with AI",
  },
  {
    icon: BookOpen,
    value: "1M+",
    label: "Notes Organized",
    description: "Study materials processed and enhanced",
  },
  {
    icon: MessageSquare,
    value: "10M+",
    label: "AI Conversations",
    description: "Questions answered by our AI assistant",
  },
  {
    icon: TrendingUp,
    value: "95%",
    label: "Improved Grades",
    description: "Students report better academic performance",
  },
];

export const StatsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Trusted by students worldwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students who are already studying smarter with AI-powered insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="card-shadow border-0 bg-background/80 backdrop-blur-sm text-center">
                <CardContent className="p-6">
                  <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="font-semibold mb-1">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.description}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};