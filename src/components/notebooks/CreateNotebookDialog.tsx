import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, BookOpen, Palette, Sparkles, Target, Lightbulb, Brain, Code, Calculator, Globe, Loader2 } from "lucide-react";

const subjectOptions = [
  "Mathematics",
  "Computer Science", 
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Literature",
  "Psychology",
  "Economics",
  "Engineering",
  "Other"
];

interface CreateNotebookDialogProps {
  children: React.ReactNode;
  onNotebookCreated?: (notebook: any) => void;
}

export const CreateNotebookDialog = ({ children, onNotebookCreated }: CreateNotebookDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: ""
  });
  const { toast } = useToast();

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubjectChange = (value: string) => {
    setFormData(prev => ({ ...prev, subject: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a notebook title",
        variant: "destructive",
      });
      return;
    }

    if (!formData.subject) {
      toast({
        title: "Error", 
        description: "Please select a subject",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a notebook",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('notebooks')
        .insert([
          {
            title: formData.title.trim(),
            description: formData.description.trim(),
            subject: formData.subject,
            user_id: user.id,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: `"${formData.title}" notebook created successfully.`,
      });

      // Reset form and close dialog
      setFormData({
        title: "",
        description: "",
        subject: ""
      });
      setOpen(false);
      
      // Notify parent component
      if (onNotebookCreated && data) {
        onNotebookCreated(data);
      }
    } catch (error) {
      console.error('Error creating notebook:', error);
      toast({
        title: "Error",
        description: "Failed to create notebook. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const SelectedIcon = BookOpen;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="relative">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  Create New Notebook
                </DialogTitle>
                <DialogDescription className="text-white/90 mt-2">
                  Organize your learning journey with a personalized notebook
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Notebook Details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Notebook Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Computer Science 101"
                    value={formData.title}
                    onChange={handleInputChange("title")}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of what you'll study in this notebook..."
                    value={formData.description}
                    onChange={handleInputChange("description")}
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Subject *
                  </Label>
                  <Select value={formData.subject} onValueChange={handleSubjectChange}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectOptions.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Preview Card */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Preview</Label>
                <Card className="card-shadow border-2 border-dashed border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {formData.title || "Your Notebook Title"}
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          {formData.description || "Your notebook description will appear here..."}
                        </p>
                        <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
                          <span>{formData.subject || "Subject"}</span>
                          <span>•</span>
                          <span>Just created</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={!formData.title.trim() || !formData.subject || isLoading}
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Create Notebook
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};