import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  BookOpen, 
  TrendingUp, 
  Award, 
  Clock,
  BarChart3,
  Users,
  LogOut
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProgressEntry {
  id: string;
  date: string;
  subject: string;
  topic: string;
  correct: number;
  wrong: number;
  total: number;
  netScore: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([
    {
      id: '1',
      date: '2024-01-15',
      subject: 'Mathematics',
      topic: 'Algebra Basics',
      correct: 18,
      wrong: 2,
      total: 20,
      netScore: 17.5
    },
    {
      id: '2',
      date: '2024-01-14',
      subject: 'Science',
      topic: 'Physics - Motion',
      correct: 15,
      wrong: 5,
      total: 20,
      netScore: 13.75
    },
    {
      id: '3',
      date: '2024-01-13',
      subject: 'English',
      topic: 'Grammar Rules',
      correct: 16,
      wrong: 4,
      total: 20,
      netScore: 15
    }
  ]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
    navigate('/login');
  };

  const filteredEntries = progressEntries.filter(entry =>
    entry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTopics = progressEntries.length;
  const totalCorrect = progressEntries.reduce((sum, entry) => sum + entry.correct, 0);
  const totalQuestions = progressEntries.reduce((sum, entry) => sum + entry.total, 0);
  const averageScore = totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(1) : 0;

  const getSubjectColor = (subject: string) => {
    const colors = {
      'Mathematics': 'math',
      'Science': 'science', 
      'English': 'english',
      'History': 'history',
      'Art': 'art'
    };
    return colors[subject as keyof typeof colors] || 'math';
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-brand-primary rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">EduTracker</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user.role === 'teacher' && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/teacher')}
                  className="hidden sm:flex"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Teacher Panel
                </Button>
              )}
              <Button variant="outline" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-educational">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-accent-math/10 rounded-xl">
                  <BookOpen className="h-6 w-6 text-accent-math" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalTopics}</p>
                  <p className="text-sm text-muted-foreground">Topics Studied</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-educational">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-success/10 rounded-xl">
                  <Award className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{averageScore}%</p>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-educational">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-warning/10 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalCorrect}</p>
                  <p className="text-sm text-muted-foreground">Correct Answers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-educational">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-accent/10 rounded-xl">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalQuestions}</p>
                  <p className="text-sm text-muted-foreground">Total Questions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions & Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button 
              onClick={() => navigate('/add-progress')}
              className="bg-gradient-to-r from-brand-primary to-accent hover:from-brand-primary/90 hover:to-accent/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Progress
            </Button>
            <Button variant="outline" onClick={() => navigate('/list')}>
              <BarChart3 className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search subjects or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Recent Progress */}
        <Card className="card-educational">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Recent Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEntries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No progress entries found</p>
                  <p className="text-sm">Start by adding your first progress entry!</p>
                </div>
              ) : (
                filteredEntries.map((entry) => (
                  <div key={entry.id} className={`progress-card subject-card ${getSubjectColor(entry.subject)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {entry.subject}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{entry.date}</span>
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">{entry.topic}</h3>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-success">✓ {entry.correct} correct</span>
                          <span className="text-error">✗ {entry.wrong} wrong</span>
                          <span className="font-semibold">Net: {entry.netScore}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">
                          {((entry.correct / entry.total) * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {entry.correct}/{entry.total}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;