import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Facebook, Globe } from "lucide-react";

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<'choose' | 'register' | 'login'>('choose');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card rounded-xl shadow-xl p-8 w-full max-w-md relative">
        <button className="absolute top-4 right-4 text-muted-foreground" onClick={onClose}>✕</button>
        {mode === 'choose' && (
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-2xl font-bold mb-4">Get Started</h2>
            <Button className="w-full" onClick={() => setMode('register')}>Register</Button>
            <Button variant="outline" className="w-full" onClick={() => setMode('login')}>Login</Button>
          </div>
        )}
        {mode === 'register' && (
          <form className="space-y-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
            <Input placeholder="First Name" type="text" required />
            <Input placeholder="Last Name" type="text" required />
            <Input placeholder="Email" type="email" required />
            <Input placeholder="Phone Number" type="tel" required />
            <Input placeholder="Password" type="password" required />
            <Input placeholder="Confirm Password" type="password" required />
            <Button className="w-full" type="submit">Sign Up</Button>
            <Separator className="my-4" />
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Globe className="h-4 w-4" /> Sign up with Google
            </Button>
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Facebook className="h-4 w-4" /> Sign up with Meta
            </Button>
            <div className="text-center mt-4">
              <Button variant="link" type="button" onClick={() => setMode('login')}>
                Already have an account? Login
              </Button>
            </div>
          </form>
        )}
        {mode === 'login' && (
          <form className="space-y-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
            <Input placeholder="Username or Email" type="text" required />
            <Input placeholder="Password" type="password" required />
            <Button className="w-full" type="submit">Login</Button>
            <Separator className="my-4" />
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Globe className="h-4 w-4" /> Login with Google
            </Button>
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Facebook className="h-4 w-4" /> Login with Meta
            </Button>
            <div className="text-center mt-4">
              <Button variant="link" type="button" onClick={() => setMode('register')}>
                Don't have an account? Register
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
