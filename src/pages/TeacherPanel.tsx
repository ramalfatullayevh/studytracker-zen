import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Users, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Award,
  BookOpen,
  Calendar,
  PieChart,
  LineChart
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie, BarChart, Bar } from 'recharts';

const TeacherPanel = () => {
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Sample student data
  const students = [
    { id: 'student1', name: 'Alice Johnson', email: 'alice@school.edu' },
    { id: 'student2', name: 'Bob Smith', email: 'bob@school.edu' },
    { id: 'student3', name: 'Carol Davis', email: 'carol@school.edu' },
    { id: 'student4', name: 'David Wilson', email: 'david@school.edu' }
  ];

  // Sample progress data for analytics
  const progressData = [
    { date: '2024-01-10', student: 'Alice Johnson', subject: 'Mathematics', score: 85 },
    { date: '2024-01-11', student: 'Alice Johnson', subject: 'Science', score: 78 },
    { date: '2024-01-12', student: 'Bob Smith', subject: 'Mathematics', score: 92 },
    { date: '2024-01-13', student: 'Carol Davis', subject: 'English', score: 88 },
    { date: '2024-01-14', student: 'David Wilson', subject: 'History', score: 76 },
    { date: '2024-01-15', student: 'Alice Johnson', subject: 'Mathematics', score: 90 },
  ];

  // Chart data preparation
  const lineChartData = progressData
    .filter(entry => selectedStudent === 'all' || entry.student === selectedStudent)
    .map(entry => ({
      date: entry.date,
      score: entry.score,
      student: entry.student
    }));

  const subjectDistribution = progressData
    .filter(entry => selectedStudent === 'all' || entry.student === selectedStudent)
    .reduce((acc, entry) => {
      acc[entry.subject] = (acc[entry.subject] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const pieChartData = Object.entries(subjectDistribution).map(([subject, count], index) => ({
    name: subject,
    value: count,
    color: ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'][index % 5]
  }));

  const averageScores = Object.entries(
    progressData
      .filter(entry => selectedStudent === 'all' || entry.student === selectedStudent)
      .reduce((acc, entry) => {
        if (!acc[entry.subject]) {
          acc[entry.subject] = { total: 0, count: 0 };
        }
        acc[entry.subject].total += entry.score;
        acc[entry.subject].count += 1;
        return acc;
      }, {} as Record<string, { total: number; count: number }>)
  ).map(([subject, data]) => ({
    subject,
    average: Math.round(data.total / data.count)
  }));

  const overallStats = {
    totalStudents: students.length,
    totalEntries: progressData.length,
    averageScore: Math.round(progressData.reduce((sum, entry) => sum + entry.score, 0) / progressData.length),
    topPerformer: 'Alice Johnson'
  };

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
                <h1 className="text-xl font-semibold text-foreground flex items-center space-x-2">
                  <Users className="h-5 w-5 text-brand-primary" />
                  <span>Teacher Analytics Panel</span>
                </h1>
                <p className="text-sm text-muted-foreground">
                  Monitor student progress and performance
                </p>
              </div>
            </div>
            
            <Badge variant="secondary" className="hidden sm:flex">
              Teacher View
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Controls */}
        <Card className="card-educational mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger className="w-full sm:w-64">
                  <Users className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.name}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full sm:w-64">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Overview Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-educational">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-brand-primary/10 rounded-xl">
                  <Users className="h-6 w-6 text-brand-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{overallStats.totalStudents}</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-educational">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-success/10 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{overallStats.totalEntries}</p>
                  <p className="text-sm text-muted-foreground">Progress Entries</p>
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
                  <p className="text-2xl font-bold text-foreground">{overallStats.averageScore}%</p>
                  <p className="text-sm text-muted-foreground">Class Average</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-educational">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-accent/10 rounded-xl">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{overallStats.topPerformer}</p>
                  <p className="text-sm text-muted-foreground">Top Performer</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Progress Over Time */}
          <Card className="card-educational">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LineChart className="h-5 w-5 text-brand-primary" />
                <span>Progress Over Time</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--brand-primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--brand-primary))', strokeWidth: 2 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Subject Distribution */}
          <Card className="card-educational">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-brand-primary" />
                <span>Subject Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {pieChartData.map((entry, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs text-muted-foreground">{entry.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Average Scores by Subject */}
        <Card className="card-educational">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-brand-primary" />
              <span>Average Scores by Subject</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={averageScores}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Bar 
                    dataKey="average" 
                    fill="hsl(var(--brand-primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Student Performance List */}
        <Card className="card-educational mt-6">
          <CardHeader>
            <CardTitle>Student Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students.map(student => {
                const studentEntries = progressData.filter(entry => entry.student === student.name);
                const avgScore = studentEntries.length > 0 
                  ? Math.round(studentEntries.reduce((sum, entry) => sum + entry.score, 0) / studentEntries.length)
                  : 0;
                const entriesCount = studentEntries.length;
                
                return (
                  <div key={student.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-brand-primary">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{student.name}</h4>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-right">
                      <div>
                        <p className="text-sm text-muted-foreground">Entries</p>
                        <p className="font-semibold">{entriesCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Score</p>
                        <p className="font-semibold text-brand-primary">{avgScore}%</p>
                      </div>
                      <div className="flex items-center">
                        {avgScore >= 80 ? (
                          <TrendingUp className="h-5 w-5 text-success" />
                        ) : avgScore >= 60 ? (
                          <TrendingUp className="h-5 w-5 text-warning" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-error" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherPanel;