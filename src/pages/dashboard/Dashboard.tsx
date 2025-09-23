import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CreateNotebookDialog } from "@/components/notebooks/CreateNotebookDialog";
import { NotebookInterface } from "@/components/notebooks/NotebookInterface";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  TrendingUp,
  Star,
  MoreHorizontal,
  Loader2
} from "lucide-react";

interface Notebook {
  id: string;
  title: string;
  description: string;
  subject: string;
  created_at: string;
  updated_at: string;
}

export const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNotebook, setActiveNotebook] = useState<string | null>(null);
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotebooks();
  }, []);

  const fetchNotebooks = async () => {
    try {
      const { data, error } = await supabase
        .from('notebooks')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotebooks(data || []);
    } catch (error) {
      console.error('Error fetching notebooks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch notebooks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNotebookCreated = (notebook: Notebook) => {
    setNotebooks(prev => [notebook, ...prev]);
  };

  // If a notebook is active, show the notebook interface
  if (activeNotebook) {
    const notebook = notebooks.find(n => n.id === activeNotebook);
    return (
      <NotebookInterface 
        notebookId={activeNotebook}
        notebookTitle={notebook?.title || "Notebook"}
        onBack={() => setActiveNotebook(null)}
      />
    );
  }

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
              
              <ThemeToggle />
              
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
                  <p className="text-2xl font-bold">{notebooks.length}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                  <p className="text-2xl font-bold">0</p>
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
                  <p className="text-2xl font-bold">0 days</p>
                </div>
                <div className="bg-accent/10 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-accent" />
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
              <CreateNotebookDialog onNotebookCreated={handleNotebookCreated}>
                <Button variant="hero" size="sm" className="shadow-md hover:shadow-lg transition-all">
                  <Plus className="h-4 w-4 mr-2" />
                  New Notebook
                </Button>
              </CreateNotebookDialog>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : notebooks.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No notebooks yet</h3>
                <p className="text-muted-foreground mb-6">Create your first notebook to get started</p>
                <CreateNotebookDialog onNotebookCreated={handleNotebookCreated}>
                  <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Notebook
                  </Button>
                </CreateNotebookDialog>
              </div>
            ) : (
              <div className="grid gap-6">
                {notebooks.map((notebook) => (
                  <Card 
                    key={notebook.id} 
                    className="card-shadow hover:card-shadow-hover transition-smooth cursor-pointer group"
                    onClick={() => setActiveNotebook(notebook.id)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg">
                            <BookOpen className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">{notebook.title}</CardTitle>
                            <CardDescription className="mt-1">
                              {notebook.description}
                            </CardDescription>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <span>{notebook.subject}</span>
                          <span>•</span>
                          <span>Updated {new Date(notebook.updated_at).toLocaleDateString()}</span>
                        </div>
                        <Clock className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity Sidebar */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </div>

            <Card className="card-shadow bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 mx-auto mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">AI Study Assistant</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first notebook and start learning with AI-powered assistance.
                </p>
                <CreateNotebookDialog onNotebookCreated={handleNotebookCreated}>
                  <Button variant="premium" size="sm">
                    Get Started
                  </Button>
                </CreateNotebookDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};