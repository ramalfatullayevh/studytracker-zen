import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  SortDesc, 
  Calendar,
  BookOpen,
  TrendingUp,
  Download
} from 'lucide-react';

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

const List = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterSubject, setFilterSubject] = useState('all');
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);

  useEffect(() => {
    // Load progress entries from localStorage
    const saved = localStorage.getItem('progressEntries');
    if (saved) {
      setProgressEntries(JSON.parse(saved));
    } else {
      // Sample data if no saved entries
      setProgressEntries([
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
        },
        {
          id: '4',
          date: '2024-01-12',
          subject: 'History',
          topic: 'Ancient Civilizations',
          correct: 14,
          wrong: 6,
          total: 20,
          netScore: 12.5
        },
        {
          id: '5',
          date: '2024-01-11',
          subject: 'Art',
          topic: 'Color Theory',
          correct: 17,
          wrong: 3,
          total: 20,
          netScore: 16.25
        }
      ]);
    }
  }, []);

  const filteredAndSortedEntries = progressEntries
    .filter(entry => {
      const matchesSearch = entry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           entry.topic.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = filterSubject === 'all' || entry.subject.toLowerCase() === filterSubject.toLowerCase();
      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'subject':
          return a.subject.localeCompare(b.subject);
        case 'score':
          return b.netScore - a.netScore;
        case 'accuracy':
          return (b.correct / b.total) - (a.correct / a.total);
        default:
          return 0;
      }
    });

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

  const subjects = Array.from(new Set(progressEntries.map(entry => entry.subject)));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Progress History</h1>
                <p className="text-sm text-muted-foreground">
                  {filteredAndSortedEntries.length} entries found
                </p>
              </div>
            </div>
            
            <Button variant="outline" className="hidden sm:flex">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <Card className="card-educational mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search subjects or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="w-full lg:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject.toLowerCase()}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-48">
                  <SortDesc className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date (Newest)</SelectItem>
                  <SelectItem value="subject">Subject (A-Z)</SelectItem>
                  <SelectItem value="score">Net Score</SelectItem>
                  <SelectItem value="accuracy">Accuracy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Progress Entries */}
        {filteredAndSortedEntries.length === 0 ? (
          <Card className="card-educational">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No entries found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || filterSubject !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start by adding your first progress entry'
                }
              </p>
              <Button onClick={() => navigate('/add-progress')}>
                Add Progress Entry
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedEntries.map((entry) => (
              <Card key={entry.id} className={`progress-card subject-card ${getSubjectColor(entry.subject)} hover:scale-[1.01] transition-all duration-200`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="text-xs font-medium">
                        {entry.subject}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(entry.date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-foreground text-lg">
                      {entry.topic}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center text-success">
                        <span className="font-medium">✓ {entry.correct}</span>
                        <span className="ml-1 text-muted-foreground">correct</span>
                      </div>
                      <div className="flex items-center text-error">
                        <span className="font-medium">✗ {entry.wrong}</span>
                        <span className="ml-1 text-muted-foreground">wrong</span>
                      </div>
                      <div className="flex items-center text-brand-primary">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span className="font-semibold">Net: {entry.netScore}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4 sm:gap-1 text-right">
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {Math.round((entry.correct / entry.total) * 100)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {entry.correct}/{entry.total} questions
                      </div>
                    </div>
                    
                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-muted">
                      {entry.correct / entry.total >= 0.8 ? '🎉 Excellent' :
                       entry.correct / entry.total >= 0.6 ? '👍 Good' :
                       entry.correct / entry.total >= 0.4 ? '📚 Study More' : '💪 Keep Trying'}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default List;