import React from "react";
import { Bot, Send, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function FloatingChat() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: "Hi! I'm your Marketing AI Assistant. I can help you analyze your campaigns, get insights, and answer questions about your marketing performance. What would you like to know?",
      timestamp: new Date(),
    }
  ]);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const sendMessageMutation = useMutation({
    mutationFn: (query: string) => api.ai.chat(query),
    onSuccess: (response, query) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: query,
        timestamp: new Date(),
      };
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage, assistantMessage]);
      setMessage("");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    sendMessageMutation.mutate(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "Campaign Performance",
    "Compare Platforms", 
    "Optimization Tips"
  ];

  return (
    <>
      {/* Chat Interface */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:bg-transparent lg:backdrop-blur-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="fixed bottom-0 right-0 left-0 lg:left-auto lg:w-96 lg:right-6 lg:bottom-6 lg:h-[600px]">
            <Card className="bg-card border border-border shadow-2xl h-full flex flex-col rounded-t-xl lg:rounded-xl">
              {/* Chat Header */}
              <CardHeader className="flex-row items-center justify-between p-4 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold" data-testid="text-chat-title">Marketing AI Assistant</h3>
                    <p className="text-xs text-green-500 flex items-center space-x-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Online</span>
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-accent"
                  data-testid="button-close-chat"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>

              {/* Chat Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex items-start space-x-3 ${msg.type === 'user' ? 'justify-end' : ''}`}
                    data-testid={`message-${msg.type}-${msg.id}`}
                  >
                    {msg.type === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div className={`flex-1 ${msg.type === 'user' ? 'max-w-xs' : ''}`}>
                      <div className={`p-3 rounded-xl ${
                        msg.type === 'user' 
                          ? 'bg-gradient-to-br from-primary to-blue-500 text-white ml-auto' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {sendMessageMutation.isPending && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-muted rounded-xl p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Chat Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center space-x-3 mb-3">
                  <Input
                    type="text"
                    placeholder="Ask me about your marketing performance..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                    disabled={sendMessageMutation.isPending}
                    data-testid="input-chat-message"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!message.trim() || sendMessageMutation.isPending}
                    className="bg-gradient-to-br from-primary to-blue-500 hover:opacity-90"
                    data-testid="button-send-message"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  {suggestedQuestions.map((question) => (
                    <Button
                      key={question}
                      variant="secondary"
                      size="sm"
                      className="text-xs"
                      onClick={() => setMessage(question)}
                      disabled={sendMessageMutation.isPending}
                      data-testid={`button-suggested-${question.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {/* Pulsing ring effect */}
        <div className="absolute inset-0 w-14 h-14 bg-gradient-to-br from-primary to-blue-500 rounded-full opacity-20 animate-ping"></div>
        <div className="absolute inset-0 w-14 h-14 bg-gradient-to-br from-primary to-blue-500 rounded-full opacity-40 animate-pulse"></div>
        
        <Button
          onClick={() => setIsOpen(true)}
          className="relative w-14 h-14 bg-gradient-to-br from-primary to-blue-500 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 border-4 border-background"
          data-testid="button-toggle-chat"
        >
          <MessageCircle className="h-6 w-6 drop-shadow-sm" />
          
          {/* Online indicator */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background">
            <span className="absolute inset-0 w-full h-full bg-green-400 rounded-full animate-ping opacity-75"></span>
            <span className="absolute inset-0.5 w-3 h-3 bg-green-400 rounded-full"></span>
          </span>
          
          {/* Sparkle effect */}
          <div className="absolute -inset-2">
            <div className="absolute top-0 right-2 w-1 h-1 bg-white rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-2 right-0 w-0.5 h-0.5 bg-white rounded-full opacity-80 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-1 left-1 w-1 h-1 bg-white rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </Button>
      </div>
    </>
  );
}

export default FloatingChat;
