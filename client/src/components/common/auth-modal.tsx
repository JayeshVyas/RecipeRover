import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Facebook, Globe } from "lucide-react";

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<'choose' | 'register' | 'login'>('choose');
  const { login, register } = useAuth();
  const [, navigate] = useLocation();
  
  // Register form state
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerLoading, setRegisterLoading] = useState(false);
  
  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterForm({ ...registerForm, [name]: value });
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError("Passwords do not match");
      return;
    }
    setRegisterLoading(true);
    try {
      await register({
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        email: registerForm.email,
        password: registerForm.password,
      });
      onClose();
      navigate('/dashboard');
    } catch (err: any) {
      setRegisterError(err.message || 'Registration failed');
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      onClose();
      navigate('/dashboard');
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

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
          <form className="space-y-4" onSubmit={handleRegister}>
            <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
            <Input name="firstName" placeholder="First Name" type="text" required value={registerForm.firstName} onChange={handleRegisterChange} />
            <Input name="lastName" placeholder="Last Name" type="text" required value={registerForm.lastName} onChange={handleRegisterChange} />
            <Input name="email" placeholder="Email" type="email" required value={registerForm.email} onChange={handleRegisterChange} />
            <Input name="phone" placeholder="Phone Number" type="tel" required value={registerForm.phone} onChange={handleRegisterChange} />
            <Input name="password" placeholder="Password" type="password" required value={registerForm.password} onChange={handleRegisterChange} />
            <Input name="confirmPassword" placeholder="Confirm Password" type="password" required value={registerForm.confirmPassword} onChange={handleRegisterChange} />
            {registerError && <div className="text-red-500 text-sm text-center">{registerError}</div>}
            <Button className="w-full" type="submit" disabled={registerLoading}>{registerLoading ? 'Signing Up...' : 'Sign Up'}</Button>
            <Separator className="my-4" />
            <Button variant="outline" className="w-full flex items-center gap-2" type="button">
              <Globe className="h-4 w-4" /> Sign up with Google
            </Button>
            <Button variant="outline" className="w-full flex items-center gap-2" type="button">
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
          <form className="space-y-4" onSubmit={handleLogin}>
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
            <Input 
              name="email" 
              placeholder="Email" 
              type="email" 
              required 
              value={loginForm.email} 
              onChange={handleLoginChange} 
            />
            <Input 
              name="password" 
              placeholder="Password" 
              type="password" 
              required 
              value={loginForm.password} 
              onChange={handleLoginChange} 
            />
            {loginError && <div className="text-red-500 text-sm text-center">{loginError}</div>}
            <Button className="w-full" type="submit" disabled={loginLoading}>
              {loginLoading ? 'Logging in...' : 'Login'}
            </Button>
            <Separator className="my-4" />
            <Button variant="outline" className="w-full flex items-center gap-2" type="button">
              <Globe className="h-4 w-4" /> Login with Google
            </Button>
            <Button variant="outline" className="w-full flex items-center gap-2" type="button">
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
