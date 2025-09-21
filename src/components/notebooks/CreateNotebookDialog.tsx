import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Plus, BookOpen, Palette, Sparkles, Target, Lightbulb, Brain, Code, Calculator, Globe } from "lucide-react";

const colorOptions = [
  { name: "Ocean Blue", value: "bg-blue-500", gradient: "from-blue-500 to-blue-600" },
  { name: "Forest Green", value: "bg-green-500", gradient: "from-green-500 to-green-600" },
  { name: "Royal Purple", value: "bg-purple-500", gradient: "from-purple-500 to-purple-600" },
  { name: "Sunset Orange", value: "bg-orange-500", gradient: "from-orange-500 to-orange-600" },
  { name: "Rose Pink", value: "bg-rose-500", gradient: "from-rose-500 to-rose-600" },
  { name: "Slate Gray", value: "bg-slate-500", gradient: "from-slate-500 to-slate-600" },
  { name: "Emerald", value: "bg-emerald-500", gradient: "from-emerald-500 to-emerald-600" },
  { name: "Amber", value: "bg-amber-500", gradient: "from-amber-500 to-amber-600" },
];

const iconOptions = [
  { name: "Book", icon: BookOpen },
  { name: "Brain", icon: Brain },
  { name: "Code", icon: Code },
  { name: "Calculator", icon: Calculator },
  { name: "Globe", icon: Globe },
  { name: "Lightbulb", icon: Lightbulb },
  { name: "Target", icon: Target },
  { name: "Sparkles", icon: Sparkles },
];

interface CreateNotebookDialogProps {
  children: React.ReactNode;
}

export const CreateNotebookDialog = ({ children }: CreateNotebookDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    color: "bg-blue-500",
    gradient: "from-blue-500 to-blue-600",
    icon: "BookOpen"
  });
  const { toast } = useToast();

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleColorSelect = (color: typeof colorOptions[0]) => {
    setFormData(prev => ({ 
      ...prev, 
      color: color.value,
      gradient: color.gradient
    }));
  };

  const handleIconSelect = (iconName: string) => {
    setFormData(prev => ({ ...prev, icon: iconName }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement notebook creation with Supabase
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      
      toast({
        title: "Success!",
        description: `"${formData.title}" notebook created successfully.`,
      });

      // Reset form and close dialog
      setFormData({
        title: "",
        description: "",
        color: "bg-blue-500",
        gradient: "from-blue-500 to-blue-600",
        icon: "BookOpen"
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create notebook. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const SelectedIcon = iconOptions.find(opt => opt.name === formData.icon)?.icon || BookOpen;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="relative">
          {/* Header with gradient background */}
          <div className={`bg-gradient-to-r ${formData.gradient} p-6 text-white relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <SelectedIcon className="h-6 w-6" />
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
              </div>

              {/* Preview Card */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Preview</Label>
                <Card className="card-shadow border-2 border-dashed border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`w-12 h-12 ${formData.color} rounded-lg flex items-center justify-center shadow-lg`}>
                        <SelectedIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {formData.title || "Your Notebook Title"}
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          {formData.description || "Your notebook description will appear here..."}
                        </p>
                        <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
                          <span>0 notes</span>
                          <span>•</span>
                          <span>Just created</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Icon Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Choose an Icon
                </Label>
                <div className="grid grid-cols-4 gap-3">
                  {iconOptions.map((option) => {
                    const IconComponent = option.icon;
                    const isSelected = formData.icon === option.name;
                    return (
                      <button
                        key={option.name}
                        type="button"
                        onClick={() => handleIconSelect(option.name)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        <IconComponent className={`h-5 w-5 mx-auto ${
                          isSelected ? "text-primary" : "text-muted-foreground"
                        }`} />
                        <span className={`text-xs mt-1 block ${
                          isSelected ? "text-primary font-medium" : "text-muted-foreground"
                        }`}>
                          {option.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Choose a Color
                </Label>
                <div className="grid grid-cols-4 gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      className={`relative p-1 rounded-lg border-2 transition-all ${
                        formData.color === color.value
                          ? "border-primary shadow-md scale-105"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className={`w-full h-12 ${color.value} rounded-md shadow-sm`}></div>
                      <span className="text-xs mt-1 block text-center text-muted-foreground">
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
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
                  disabled={!formData.title.trim() || isLoading}
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
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