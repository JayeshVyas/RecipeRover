import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChartLine } from "lucide-react";
import AuthModal from "@/components/common/auth-modal";
import BookCallModal from "@/components/common/book-call-modal";

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [showBookCall, setShowBookCall] = useState(false);
  const isModalOpen = showBookCall;
  
  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col relative ${isModalOpen ? 'overflow-hidden' : ''}`}>
      {/* Brand Header - Only Brand Name */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <div className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <ChartLine className="h-5 w-5 text-white drop-shadow-sm" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  Accelaro
                </span>
                <span className="text-xs text-muted-foreground -mt-1">AI Marketing Platform</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-20 px-4">
        <h1 className="text-5xl font-extrabold text-center mb-6 text-primary">AI-Assisted Marketing Automation</h1>
        <p className="text-xl text-center max-w-2xl mb-8 text-muted-foreground">
          Scale your brand with Accelaro. Connect your ad accounts, automate insights, and optimize campaigns with AI-powered tools and expert guidance.
        </p>
        <Button className="text-lg px-8 py-4 rounded-full bg-primary text-primary-foreground shadow-lg" onClick={() => setShowAuth(true)}>Get Started</Button>
        <div className="mt-8 flex flex-wrap gap-8 justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">34%</div>
            <div className="text-muted-foreground">CAC Reduction</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">54%</div>
            <div className="text-muted-foreground">ROAS Improvement</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">4000+</div>
            <div className="text-muted-foreground">Ads Generated</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">85%</div>
            <div className="text-muted-foreground">Faster Creatives</div>
          </div>
        </div>
      </section>

      {/* Features/Process Section */}
      <section className="py-16 px-4 bg-card border-t border-border">
  <h2 className="text-3xl font-bold text-center mb-10">How Accelaro Delivers Growth</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="p-6 rounded-xl shadow bg-background">
            <h3 className="text-xl font-semibold mb-2 text-primary">One-Click Account Audit</h3>
            <p className="text-muted-foreground">Scan your ad accounts for wasted spend and growth opportunities using our AI tools.</p>
          </div>
          <div className="p-6 rounded-xl shadow bg-background">
            <h3 className="text-xl font-semibold mb-2 text-primary">AI-Driven Consumer Research</h3>
            <p className="text-muted-foreground">Generate buyer personas and high-performing concepts from your brand assets.</p>
          </div>
          <div className="p-6 rounded-xl shadow bg-background">
            <h3 className="text-xl font-semibold mb-2 text-primary">Faster Creatives</h3>
            <p className="text-muted-foreground">Designers and copywriters use AI to launch ads 5x faster across all channels.</p>
          </div>
          <div className="p-6 rounded-xl shadow bg-background">
            <h3 className="text-xl font-semibold mb-2 text-primary">Omni-Channel Automation</h3>
            <p className="text-muted-foreground">Run and optimize campaigns on Google, Meta, LinkedIn, TikTok, and more.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-10">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="p-6 rounded-xl shadow bg-card">
            <p className="text-lg mb-4">“Accelaro helped us cut ad costs and grow sales faster than any other platform. The AI insights are a game changer!”</p>
            <div className="font-semibold text-primary">Jane Doe, CMO</div>
          </div>
          <div className="p-6 rounded-xl shadow bg-card">
            <p className="text-lg mb-4">“We automated our reporting and campaign optimizations. Our team saves hours every week and our ROAS keeps improving.”</p>
            <div className="font-semibold text-primary">John Smith, Marketing Lead</div>
          </div>
        </div>
      </section>

  {/* Footer */}
  {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      <footer className="py-8 px-4 bg-card border-t border-border text-center text-muted-foreground">
        <div className="text-lg font-semibold mb-6">Ready to unlock your next growth lever?</div>
        <Button className="mb-8 px-8 py-3 rounded-full bg-primary text-primary-foreground shadow-lg" onClick={() => setShowBookCall(true)}>Book a Call</Button>
        <div className="mb-2 font-bold text-primary text-xl">Accelaro</div>
        <div className="mb-2">AI-Assisted Marketing Automation Platform</div>
        <div className="flex flex-wrap gap-4 justify-center mb-6 mt-8">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Blog</a>
          <a href="#" className="hover:underline">Contact</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
        </div>
        <div className="text-xs">&copy; {new Date().getFullYear()} Accelaro. All rights reserved.</div>
      </footer>
      {showBookCall && (
        <>
          <div className="fixed inset-0 z-40 bg-white/30 backdrop-blur-md transition-all" />
          <BookCallModal onClose={() => setShowBookCall(false)} />
        </>
      )}
    </div>
  );
}
