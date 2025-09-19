import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, GraduationCap, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      localStorage.setItem('user', JSON.stringify({ email, role: email.includes('teacher') ? 'teacher' : 'student' }));
      toast({
        title: 'Welcome back!',
        description: 'You have been successfully logged in.',
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Error',
        description: 'Please enter valid credentials.',
        variant: 'destructive',
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary via-accent to-brand-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left side - Branding & Illustration */}
        <div className="hidden lg:block space-y-8 text-white">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <GraduationCap className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold">EduTracker</h1>
            </div>
            <p className="text-xl text-white/80">
              Track your educational progress with precision and style
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <BookOpen className="h-6 w-6 text-success" />
              <div>
                <h3 className="font-semibold">Smart Progress Tracking</h3>
                <p className="text-sm text-white/70">Monitor your learning journey across all subjects</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <TrendingUp className="h-6 w-6 text-warning" />
              <div>
                <h3 className="font-semibold">Detailed Analytics</h3>
                <p className="text-sm text-white/70">Get insights into your performance and areas for improvement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <Card className="card-educational backdrop-blur-sm border-white/20 bg-white/95">
            <CardHeader className="space-y-2 text-center">
              <div className="mx-auto p-3 bg-brand-primary/10 rounded-xl w-fit">
                <GraduationCap className="h-8 w-8 text-brand-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Welcome Back</CardTitle>
              <CardDescription className="text-muted-foreground">
                Sign in to continue your learning journey
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-brand-primary/20"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Use "teacher@school.edu" for teacher access
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-brand-primary/20"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-brand-primary to-accent hover:from-brand-primary/90 hover:to-accent/90 transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;