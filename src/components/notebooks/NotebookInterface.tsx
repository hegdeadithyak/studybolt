import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Send, 
  Sparkles, 
  User, 
  BookOpen, 
  MoreHorizontal, 
  Share, 
  Download,
  Settings,
  MessageSquare,
  Loader2,
  ArrowLeft
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface NotebookInterfaceProps {
  notebookId: string;
  notebookTitle: string;
  onBack: () => void;
}

export const NotebookInterface = ({ notebookId, notebookTitle, onBack }: NotebookInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, [notebookId]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('notebook_id', notebookId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages = data?.map(msg => ({
        id: msg.id,
        type: msg.type as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(msg.created_at),
      })) || [];

      // Add welcome message if no messages exist
      if (formattedMessages.length === 0) {
        const welcomeMessage: Message = {
          id: 'welcome',
          type: 'assistant',
          content: `Welcome to your ${notebookTitle} notebook! I'm your AI study assistant. I can help you understand concepts, solve problems, and organize your learning. What would you like to explore today?`,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      } else {
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setLoadingMessages(false);
    }
  };

  const saveMessage = async (message: Omit<Message, 'id' | 'timestamp'>) => {
    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            notebook_id: notebookId,
            type: message.type,
            content: message.content,
          }
        ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Save user message
    await saveMessage({
      type: 'user',
      content: userMessage.content,
    });

    // Simulate AI response
    setTimeout(async () => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I understand you're asking about "${userMessage.content}". This is a simulated response to demonstrate the interface. In the full version, this would connect to your AI backend with sophisticated reasoning capabilities.

Here's how I would help:
• Break down complex concepts into digestible parts
• Provide step-by-step explanations 
• Reference your existing notes for context
• Suggest related topics to explore

What specific aspect would you like me to explain further?`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Save AI response
      await saveMessage({
        type: 'assistant',
        content: aiResponse.content,
      });
      
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-semibold text-lg">{notebookTitle}</h1>
                <p className="text-sm text-muted-foreground">AI Study Assistant</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Share className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-6 max-w-4xl mx-auto">
            {loadingMessages ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-4 animate-fade-in ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className={
                    message.type === 'user' 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-accent/10 text-accent'
                  }>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`flex-1 ${message.type === 'user' ? 'flex justify-end' : ''}`}>
                  <Card className={`max-w-[80%] ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-card border-border/50'
                  } shadow-sm`}>
                    <CardContent className="p-4">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {message.content.split('\n').map((line, index) => (
                          <p key={index} className="whitespace-pre-wrap">
                            {line}
                          </p>
                        ))}
                      </div>
                      <div className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )))}
            
            {isLoading && (
              <div className="flex items-start space-x-4 animate-fade-in">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-accent/10 text-accent">
                    <Sparkles className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <Card className="bg-card border-border/50 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">AI is thinking...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-border bg-background p-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Input
                placeholder="Ask anything about your studies..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="pr-12 h-12 text-base bg-background border-border/50 focus:border-primary/50 transition-all"
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-1 top-1 h-10 w-10 bg-primary hover:bg-primary/90 shadow-md"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <div className="flex items-center space-x-4">
                <span>Powered by AI • Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-3 w-3" />
                <span>{messages.length - 1} messages</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};