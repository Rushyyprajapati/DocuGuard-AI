import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Send, Calendar, Clock, Users, FileText } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import RiskIndicator from '../components/features/RiskIndicator';
import RiskChart from '../components/features/RiskChart';

const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [qa, setQa] = useState<{ q: string; a: string }[]>([]);

  const [summary, setSummary] = useState<any>(null);
  const [clauses, setClauses] = useState<any[]>([]);
  const [riskData, setRiskData] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/summary')
      .then((res) => res.json())
      .then(setSummary)
      .catch((err) => console.error('❌ Summary fetch failed:', err));

    fetch('http://localhost:5000/api/clauses')
      .then((res) => res.json())
      .then(setClauses)
      .catch((err) => console.error('❌ Clauses fetch failed:', err));

    fetch('http://localhost:5000/api/risk-data')
      .then((res) => res.json())
      .then(setRiskData)
      .catch((err) => console.error('❌ Risk data fetch failed:', err));
  }, []);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    try {
      const res = await fetch('http://localhost:5000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, context: summary?.overview || '' }),
      });
      const data = await res.json();
      setQa([...qa, { q: question, a: data.answer }]);
    } catch (err) {
      console.error('❌ QA fetch failed:', err);
      setQa([...qa, { q: question, a: '⚠️ Failed to fetch answer. Please try again.' }]);
    }

    setQuestion('');
  };

  const summaryTab = summary && (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="mb-6 text-xl font-semibold text-neutral-900">Document Summary</h3>
        <div className="mb-6">
          <h4 className="mb-2 text-lg font-medium text-neutral-800">{summary.title}</h4>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center text-sm text-neutral-600">
              <Calendar className="mr-1.5 h-4 w-4" />
              <span>{summary.date}</span>
            </div>
            <div className="flex items-center text-sm text-neutral-600">
              <Users className="mr-1.5 h-4 w-4" />
              <span>{summary.parties?.join(' & ')}</span>
            </div>
            <div className="flex items-center text-sm text-neutral-600">
              <Clock className="mr-1.5 h-4 w-4" />
              <span>12 pages, 4,328 words</span>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h4 className="mb-3 text-base font-medium text-neutral-800">Overview</h4>
          <p className="text-neutral-700">{summary.overview}</p>
        </div>
        <div>
          <h4 className="mb-3 text-base font-medium text-neutral-800">Key Terms</h4>
          <div className="grid grid-cols-1 gap-y-2 sm:grid-cols-2">
            {summary.key_terms?.map((item: any, index: number) => (
              <div key={index} className="flex items-start">
                <span className="text-sm font-medium text-neutral-900">{item.term}:</span>
                <span className="ml-2 text-sm text-neutral-700">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-xl font-semibold text-neutral-900">Risk Assessment</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col">
            <span className="text-sm text-neutral-600">Overall Risk Level</span>
            <div className="mt-2">
              <RiskIndicator level="medium" size="lg" />
            </div>
            <div className="mt-4 space-y-2">
              {riskData.map((risk, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">{risk.riskLevel} Clauses</span>
                  <span className="font-medium" style={{ color: risk.color }}>{risk.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <RiskChart data={riskData} />
          </div>
        </div>
      </Card>
    </div>
  );

  const keyClauses = (
    <div className="space-y-6">
      {clauses.map((clause) => (
        <Card key={clause.id} className="p-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-neutral-800">{clause.category}</h3>
            <RiskIndicator level={clause.riskLevel} />
          </div>
          <p className="mb-4 text-neutral-700">"{clause.text}"</p>
          <div className="rounded-md bg-neutral-50 p-4">
            <h4 className="mb-2 text-sm font-medium text-neutral-800">Analysis</h4>
            <p className="text-sm text-neutral-600">{clause.explanation}</p>
          </div>
        </Card>
      ))}
    </div>
  );

  const askQuestions = (
    <div className="flex h-full flex-col">
      <Card className="mb-4 flex-1 overflow-hidden p-0">
        <div className="flex h-full flex-col">
          <div className="border-b border-neutral-200 p-4">
            <h3 className="text-lg font-semibold text-neutral-900">Ask Questions</h3>
            <p className="text-sm text-neutral-600">Ask anything about the document and get AI-powered answers</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {qa.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <FileText className="mb-4 h-12 w-12 text-neutral-300" />
                <h3 className="mb-2 text-lg font-medium text-neutral-800">No questions yet</h3>
                <p className="max-w-sm text-neutral-600">
                  Ask a question about the document to get started. Try asking about specific clauses, terms, or risks.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {qa.map((item, index) => (
                  <div key={index}>
                    <div className="mb-2 flex justify-end">
                      <div className="rounded-lg rounded-tr-none bg-primary-600 px-4 py-2 text-white">{item.q}</div>
                    </div>
                    <div className="flex">
                      <div className="rounded-lg rounded-tl-none bg-neutral-100 px-4 py-2 text-neutral-800">{item.a}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="border-t border-neutral-200 p-4">
            <div className="flex items-center">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about the document..."
                className="flex-1 rounded-l-md border border-neutral-300 px-3 py-2 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAskQuestion();
                }}
              />
              <button
                onClick={handleAskQuestion}
                className="rounded-r-md bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700 disabled:bg-primary-300"
                disabled={!question.trim()}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="container-custom py-8">
      <div className="mb-6">
        <h1 className="text-neutral-900">Document Analysis</h1>
        <p className="text-neutral-600">
          Review the complete analysis of your document including risk assessment, key clauses, and recommendations.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-neutral-900">Document Info</h3>
              {summary && (
                <div className="space-y-3 text-sm text-neutral-700">
                  <div><strong>Title:</strong> {summary.title}</div>
                  <div><strong>Date:</strong> {summary.date}</div>
                  <div><strong>Type:</strong> License Agreement</div>
                  <div><strong>Parties:</strong> {summary.parties?.join(' & ')}</div>
                  <div><strong>Length:</strong> 12 pages, 4,328 words</div>
                </div>
              )}
            </div>
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-neutral-900">Risk Overview</h3>
              {riskData.map((risk, index) => (
                <div key={index} className="flex justify-between text-sm text-neutral-700">
                  <span>{risk.riskLevel}</span>
                  <span style={{ color: risk.color }}>{risk.count}</span>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              fullWidth
              leftIcon={<Download className="h-4 w-4" />}
              onClick={() => navigate('/report')}
            >
              Download Report
            </Button>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <Tabs
            tabs={[
              { id: 'summary', label: 'Summary', content: summaryTab },
              { id: 'key-clauses', label: 'Key Clauses', content: keyClauses },
              { id: 'ask-questions', label: 'Ask Questions', content: askQuestions },
            ]}
            variant="underline"
          />
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
