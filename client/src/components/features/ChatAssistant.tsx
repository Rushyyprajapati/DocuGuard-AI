import { useState } from 'react';

interface ChatAssistantProps {
  context: string;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ context }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer('');
    setError('');

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, question }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setAnswer(data.answer || 'No answer found.');
    } catch (err: any) {
      console.error('❌ Assistant error:', err.message);
      setError(err.message || 'Failed to get assistant response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 border rounded bg-white space-y-4">
      <h3 className="text-lg font-semibold text-neutral-800">Ask the Assistant</h3>

      <input
        className="w-full p-2 border rounded"
        placeholder="Ask a question about the document..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
        onClick={handleAsk}
        disabled={loading}
      >
        {loading ? 'Thinking...' : 'Ask'}
      </button>

      {error && (
        <div className="text-sm text-red-600 border-t pt-2">
          <strong>Error:</strong> {error}
        </div>
      )}

      {answer && (
        <div className="text-sm text-neutral-700 border-t pt-2">
          <strong>Answer:</strong> {answer}
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;
