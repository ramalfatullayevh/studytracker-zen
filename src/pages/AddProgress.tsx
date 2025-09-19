import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  BookOpen, 
  ChevronRight,
  Calculator,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const subjects = [
  { id: 'math', name: 'Mathematics', icon: '📐', topics: ['Algebra Basics', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics'] },
  { id: 'science', name: 'Science', icon: '🔬', topics: ['Physics - Motion', 'Chemistry - Atoms', 'Biology - Cells', 'Earth Science', 'Astronomy'] },
  { id: 'english', name: 'English', icon: '📚', topics: ['Grammar Rules', 'Literature Analysis', 'Essay Writing', 'Vocabulary', 'Reading Comprehension'] },
  { id: 'history', name: 'History', icon: '🏛️', topics: ['Ancient Civilizations', 'World Wars', 'American History', 'European History', 'Modern History'] },
  { id: 'art', name: 'Art', icon: '🎨', topics: ['Drawing Techniques', 'Color Theory', 'Art History', 'Digital Art', 'Sculpture'] }
];

const AddProgress = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSubject, setSelectedSubject] = useState<typeof subjects[0] | null>(null);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [questions, setQuestions] = useState({ total: '', correct: '', wrong: '' });

  const handleDateSelect = () => {
    setCurrentStep(2);
  };

  const handleSubjectSelect = (subject: typeof subjects[0]) => {
    setSelectedSubject(subject);
    setCurrentStep(3);
  };

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    setCurrentStep(4);
  };

  const calculateNetScore = (correct: number, wrong: number) => {
    // Common formula: correct - (wrong/4)
    return correct - (wrong / 4);
  };

  const handleSaveProgress = () => {
    const correct = parseInt(questions.correct);
    const wrong = parseInt(questions.wrong);
    const total = correct + wrong;
    
    if (correct < 0 || wrong < 0) {
      toast({
        title: 'Invalid input',
        description: 'Please enter valid positive numbers.',
        variant: 'destructive',
      });
      return;
    }

    const netScore = calculateNetScore(correct, wrong);
    
    // Save to localStorage for demo
    const existingProgress = JSON.parse(localStorage.getItem('progressEntries') || '[]');
    const newEntry = {
      id: Date.now().toString(),
      date: format(selectedDate, 'yyyy-MM-dd'),
      subject: selectedSubject?.name,
      topic: selectedTopic,
      correct,
      wrong,
      total,
      netScore: Math.round(netScore * 100) / 100
    };
    
    existingProgress.unshift(newEntry);
    localStorage.setItem('progressEntries', JSON.stringify(existingProgress));
    
    toast({
      title: 'Progress saved!',
      description: `Added progress for ${selectedSubject?.name} - ${selectedTopic}`,
    });
    
    navigate('/dashboard');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="card-educational max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-brand-primary" />
                <span>Select Date</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">When did you study this topic?</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button onClick={handleDateSelect} className="w-full">
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <div className="max-w-4xl mx-auto">
            <Card className="card-educational mb-6">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <BookOpen className="h-5 w-5 text-brand-primary" />
                  <span>Select Subject</span>
                </CardTitle>
              </CardHeader>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <Card
                  key={subject.id}
                  className={`subject-card ${subject.id} cursor-pointer hover:scale-105 transition-all duration-300`}
                  onClick={() => handleSubjectSelect(subject)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{subject.icon}</div>
                    <h3 className="text-xl font-semibold text-foreground">{subject.name}</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {subject.topics.length} topics available
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="max-w-2xl mx-auto">
            <Card className="card-educational mb-6">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <span className="text-2xl">{selectedSubject?.icon}</span>
                  <span>Select Topic - {selectedSubject?.name}</span>
                </CardTitle>
              </CardHeader>
            </Card>
            
            <div className="space-y-3">
              {selectedSubject?.topics.map((topic) => (
                <Card
                  key={topic}
                  className="card-educational cursor-pointer hover:bg-card-hover transition-all duration-200"
                  onClick={() => handleTopicSelect(topic)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <span className="font-medium text-foreground">{topic}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 4:
        const correct = parseInt(questions.correct) || 0;
        const wrong = parseInt(questions.wrong) || 0;
        const netScore = questions.correct && questions.wrong ? calculateNetScore(correct, wrong) : 0;
        
        return (
          <Card className="card-educational max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Calculator className="h-5 w-5 text-brand-primary" />
                <span>Question Results</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {selectedSubject?.name} - {selectedTopic}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="correct">Correct Answers</Label>
                <Input
                  id="correct"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={questions.correct}
                  onChange={(e) => setQuestions(prev => ({ ...prev, correct: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="wrong">Wrong Answers</Label>
                <Input
                  id="wrong"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={questions.wrong}
                  onChange={(e) => setQuestions(prev => ({ ...prev, wrong: e.target.value }))}
                />
              </div>
              
              {questions.correct && questions.wrong && (
                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total:</span>
                      <span className="ml-2 font-semibold">{correct + wrong}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Accuracy:</span>
                      <span className="ml-2 font-semibold text-success">
                        {correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0}%
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Net Score:</span>
                      <span className="ml-2 font-semibold text-brand-primary">
                        {netScore.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={handleSaveProgress} 
                className="w-full bg-gradient-to-r from-success to-success/90"
                disabled={!questions.correct || !questions.wrong}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Save Progress
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Add Progress</h1>
              <p className="text-sm text-muted-foreground">Step {currentStep} of 4</p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                    step <= currentStep
                      ? "bg-brand-primary text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={cn(
                      "w-12 h-1 mx-2",
                      step < currentStep ? "bg-brand-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="pb-8">
          {renderStepContent()}
        </div>

        {/* Back Button */}
        {currentStep > 1 && (
          <div className="fixed bottom-6 left-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="shadow-lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProgress;