import React, { useState, useEffect } from 'react';
import TeacherChat from './TeacherChat';
import History from './History';
import TopicSelector from './TopicSelector';
import { historyService, ThreadSession, ThreadHistory } from '../services/historyService';
import { userProfileService, UserSummary } from '../services/userProfileService';
import { Topic } from '../services/curriculumService';
import { Link } from 'react-router-dom';

interface Student {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  topics_started?: number;
  topics_completed?: number;
  last_active?: string | null;
  overall_accuracy?: number;
}

type AppView = 'selection' | 'history' | 'chat';

function CustomTeacherApp() {
  const [currentView, setCurrentView] = useState<AppView>('selection');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedMode, setSelectedMode] = useState<'teaching' | 'practice' | 'assessment'>('teaching');
  const [currentSession, setCurrentSession] = useState<{
    threadId?: string;
    isResumed?: boolean;
    initialHistory?: ThreadHistory;
  } | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Load real user profiles on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const userSummaries = await userProfileService.getAllUsersSummary();

      // Convert UserSummary to Student interface
      const studentData: Student[] = userSummaries.map(user => ({
        id: user.id,
        name: user.name,
        level: user.level,
        topics_started: user.topics_started,
        topics_completed: user.topics_completed,
        last_active: user.last_active,
        overall_accuracy: user.overall_accuracy
      }));

      setStudents(studentData);
    } catch (error) {
      console.error('Error loading users:', error);
      // Fallback to default students if API fails
      setStudents([
        { id: 'default_student_1', name: 'Alice Johnson', level: 'intermediate' },
        { id: 'default_student_2', name: 'Bob Smith', level: 'beginner' },
        { id: 'default_student_3', name: 'Carol Davis', level: 'advanced' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    console.log('Selected topic:', topic);
  };

  const startSession = () => {
    if (selectedStudent && selectedTopic) {
      console.log('Starting session with:', { selectedStudent, selectedTopic, selectedMode });

      // Create session info for history tracking
      const sessionInfo: ThreadSession = {
        thread_id: '', // Will be set by TeacherChat
        user_id: selectedStudent.id,
        topic: selectedTopic.topic_title, // Use topic title from curriculum
        mode: selectedMode,
        created_at: new Date().toISOString(),
        last_activity: new Date().toISOString(),
        total_messages: 0,
        status: 'active'
      };

      setCurrentSession({ isResumed: false });
      setCurrentView('chat');
    }
  };

  const handleSelectSession = (session: ThreadSession, history?: ThreadHistory) => {
    console.log('Resuming session:', session);

    // Set student, topic, and mode from session
    const student = students.find(s => s.id === session.user_id) || students[0];
    setSelectedStudent(student);
    setSelectedTopic(session.topic);
    setSelectedMode(session.mode as 'teaching' | 'practice' | 'assessment');

    setCurrentSession({
      threadId: session.thread_id,
      isResumed: true,
      initialHistory: history
    });
    setCurrentView('chat');
  };

  const handleNewSession = () => {
    setCurrentSession(null);
    setSelectedStudent(null);
    setSelectedTopic('');
    setSelectedMode('teaching');
    setCurrentView('selection');
  };

  const handleBackToSelection = () => {
    setCurrentView('selection');
  };

  const handleShowHistory = () => {
    setCurrentView('history');
  };

  const handleSessionCreated = (threadId: string) => {
    // Update current session with thread ID and add to history
    if (selectedStudent && selectedTopic && !currentSession?.isResumed) {
      const sessionInfo: ThreadSession = {
        thread_id: threadId,
        user_id: selectedStudent.id,
        topic: selectedTopic,
        mode: selectedMode,
        created_at: new Date().toISOString(),
        last_activity: new Date().toISOString(),
        total_messages: 0,
        status: 'active'
      };

      historyService.addSession(sessionInfo);
      setCurrentSession(prev => ({ ...prev, threadId }));
    }
  };

  // Show chat if session is active
  if (currentView === 'chat' && (selectedStudent && selectedTopic)) {
    return (
      <TeacherChat
        studentId={selectedStudent.id}
        topic={selectedTopic}
        mode={selectedMode}
        threadId={currentSession?.threadId}
        isResumed={currentSession?.isResumed}
        initialHistory={currentSession?.initialHistory}
        onBack={handleBackToSelection}
        onSessionCreated={handleSessionCreated}
      />
    );
  }

  // Show history view
  if (currentView === 'history') {
    return (+
      <History
        currentUserId={selectedStudent?.id || 'student1'}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-blue-600 text-white p-8 text-center">
        <h1 className="text-3xl font-bold mb-2">AI Teacher Agent</h1>
        <p className="text-xl">Personalized learning with intelligent tutoring</p>
      </header>

      <main className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Select Student</h2>
            <button
              onClick={loadUsers}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              {loading ? 'Refreshing...' : '🔄 Refresh'}
            </button>
            <button>
              <Link to="/agents">Agents</Link>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading student profiles...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${selectedStudent?.id === student.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${userProfileService.getLevelColor(student.level)}`}>
                      {student.level}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    {student.topics_started !== undefined && (
                      <div className="flex justify-between">
                        <span>Topics Started:</span>
                        <span className="font-medium">{student.topics_started}</span>
                      </div>
                    )}

                    {student.topics_completed !== undefined && (
                      <div className="flex justify-between">
                        <span>Topics Completed:</span>
                        <span className="font-medium text-green-600">{student.topics_completed}</span>
                      </div>
                    )}

                    {student.overall_accuracy !== undefined && (
                      <div className="flex justify-between">
                        <span>Accuracy:</span>
                        <span className={`font-medium ${userProfileService.getCompletionColor(student.overall_accuracy)}`}>
                          {(student.overall_accuracy * 100).toFixed(1)}%
                        </span>
                      </div>
                    )}

                    {student.last_active && (
                      <div className="flex justify-between">
                        <span>Last Active:</span>
                        <span className="font-medium">{userProfileService.formatLastActive(student.last_active)}</span>
                      </div>
                    )}
                  </div>

                  {student.topics_started !== undefined && student.topics_completed !== undefined && student.topics_started > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{((student.topics_completed / student.topics_started) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`bg-blue-600 h-2 rounded-full transition-all duration-300`}
                          style={{
                            width: `${Math.min(100, Math.max(0, (student.topics_completed || 0) / Math.max(1, student.topics_started || 1) * 100))}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8">
          <TopicSelector 
            onTopicSelect={handleTopicSelect}
            selectedTopicNumber={selectedTopic?.topic_number}
            className="bg-gray-50 p-6 rounded-lg"
          />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Select Mode</h2>
          <div className="flex gap-4">
            {['teaching', 'practice', 'assessment'].map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode as any)}
                className={`px-6 py-3 border-2 rounded-lg cursor-pointer capitalize font-medium transition-all duration-200 ${selectedMode === mode
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400'
                  }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={startSession}
            disabled={!selectedStudent || !selectedTopic}
            className={`flex-1 p-4 rounded-lg text-lg font-semibold transition-all duration-200 ${selectedStudent && selectedTopic
              ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
          >
            Start Learning Session
          </button>

          <button
            onClick={handleShowHistory}
            className="px-6 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 font-semibold"
          >
            📚 View History
          </button>
        </div>
      </main>
    </div>
  );
}

export default CustomTeacherApp;
