import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, FileText } from 'lucide-react';
import Card from '../components/ui/Card';
import RiskChart from '../components/features/RiskChart';
import RiskIndicator from '../components/features/RiskIndicator';
import Button from '../components/ui/Button';
import ChatAssistant from '../components/features/ChatAssistant';

const AnalysisPage: React.FC = () => {
  const [summary, setSummary] = useState<string | null>(null);
  const [clauses, setClauses] = useState<any[]>([]);
  const [riskData, setRiskData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const [summaryRes, clausesRes, riskRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/summary`),
          fetch(`${BACKEND_URL}/api/clauses`),
          fetch(`${BACKEND_URL}/api/risk-data`),
        ]);

        if (!summaryRes.ok || !clausesRes.ok || !riskRes.ok) {
          throw new Error('Failed to fetch one or more analysis sections');
        }

        const summaryText = await summaryRes.text();
        const clausesData = await clausesRes.json();
        const riskChart = await riskRes.json();

        setSummary(summaryText);
        setClauses(clausesData);
        setRiskData(riskChart);
      } catch (error) {
        console.error('❌ Failed to fetch analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  const handleDownload = async () => {
    const reportElement = document.getElementById('report-content');
    if (!reportElement) return;

    const canvas = await html2canvas(reportElement, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('DocuGuard_Report.pdf');
  };

  const convertToLevel = (emotion: string): 'low' | 'medium' | 'high' | 'none' => {
    const e = emotion.toLowerCase();
    if (e.includes('anger') || e.includes('fear')) return 'high';
    if (e.includes('sad') || e.includes('surprise')) return 'medium';
    if (e.includes('joy') || e.includes('neutral')) return 'low';
    return 'none';
  };

  if (loading) {
    return <div className="container-custom py-12 text-center">Loading analysis...</div>;
  }

  return (
    <div className="container-custom py-12 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-neutral-900">Document Analysis</h1>
        <Button leftIcon={<Download className="h-5 w-5" />} onClick={handleDownload}>
          Download Report
        </Button>
      </div>

      <div id="report-content" className="space-y-10">

        {/* ✅ Summary Section */}
        <Card className="p-6 shadow-md border border-primary-100 bg-primary-50">
          <h2 className="text-xl font-semibold text-primary-800 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary-600" />
            Document Summary
          </h2>
          <blockquote className="text-neutral-800 italic border-l-4 border-primary-500 pl-4">
            “{summary}”
          </blockquote>
        </Card>

        {/* ✅ Risk Breakdown Chart */}
        <Card>
          <h2 className="mb-4 text-xl font-medium text-neutral-800">Risk Breakdown</h2>
          <RiskChart data={riskData} className="h-64" />
        </Card>

        {/* ✅ Key Clauses */}
        <Card className="p-6 border border-neutral-200 bg-white shadow-sm space-y-6">
          <h2 className="text-xl font-semibold text-neutral-800">Key Clauses</h2>

          {clauses.map((clause, idx) => (
            <div
              key={idx}
              className="rounded-md border border-neutral-100 bg-neutral-50 p-4 shadow-sm"
            >
              <p className="text-sm text-neutral-700 mb-2">{clause.clause}</p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-600">Risk:</span>
                  <RiskIndicator level={convertToLevel(clause.riskLevel)} />
                </div>
                <span className="text-xs text-neutral-500">Confidence: {clause.score.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* ✅ Optional Chat Assistant */}
      <ChatAssistant context={summary || ''} />
    </div>
  );
};

export default AnalysisPage;
