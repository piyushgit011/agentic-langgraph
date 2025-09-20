import React, { useState, useEffect } from 'react';
import { historyService, ThreadSession, ThreadHistory } from '../services/historyService';

interface HistoryProps {
  currentUserId: string;
  onSelectSession: (session: ThreadSession, history?: ThreadHistory) => void;
  onNewSession: () => void;
}

const History: React.FC<HistoryProps> = ({ currentUserId, onSelectSession, onNewSession }) => {
  const [sessions, setSessions] = useState<ThreadSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'teaching' | 'practice' | 'assessment'>('all');
  const [loadingHistory, setLoadingHistory] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, [currentUserId]);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const userSessions = await historyService.getUserSessions(currentUserId);
      setSessions(userSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSession = async (session: ThreadSession) => {
    setLoadingHistory(session.thread_id);
    try {
      const history = await historyService.getThreadHistory(session.thread_id);
      onSelectSession(session, history || undefined);
    } catch (error) {
      console.error('Error loading session history:', error);
      // Still allow selection without history
      onSelectSession(session);
    } finally {
      setLoadingHistory(null);
    }
  };

  const handleDeleteSession = (threadId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this session?')) {
      historyService.deleteSession(threadId, currentUserId);
      loadSessions();
    }
  };

  const filteredSessions = sessions.filter(session => {
    // Filter by mode
    if (selectedFilter !== 'all' && session.mode !== selectedFilter) {
      return false;
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      return (
        session.topic.toLowerCase().includes(searchLower) ||
        session.mode.toLowerCase().includes(searchLower) ||
        session.thread_id.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'teaching': return 'bg-blue-100 text-blue-800';
      case 'practice': return 'bg-green-100 text-green-800';
      case 'assessment': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg text-gray-800 bg-white p-8 rounded-lg shadow-lg">
          Loading your learning history...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Learning History</h1>
              <p className="text-gray-600 mt-1">Continue your previous sessions or start a new one</p>
            </div>
            <button
              onClick={onNewSession}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              New Session
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by topic, mode, or thread ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'teaching', 'practice', 'assessment'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter as any)}
                  className={`px-4 py-2 rounded-lg capitalize font-medium transition-colors ${selectedFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery || selectedFilter !== 'all' ? 'No sessions found' : 'No learning sessions yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || selectedFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start your first learning session to see it here'
                }
              </p>
              <button
                onClick={onNewSession}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Start Learning
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredSessions.map((session) => (
              <div
                key={session.thread_id}
                onClick={() => handleSelectSession(session)}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {session.topic}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModeColor(session.mode)}`}>
                          {session.mode}
                        </span>
                        <span>{session.total_messages} messages</span>
                        <span>•</span>
                        <span>{formatDate(session.last_activity)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {loadingHistory === session.thread_id && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      )}
                      <button
                        onClick={(e) => handleDeleteSession(session.thread_id, e)}
                        className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
                        title="Delete session"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>Thread ID: {session.thread_id}</span>
                      <span>•</span>
                      <span>Created: {formatDate(session.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
