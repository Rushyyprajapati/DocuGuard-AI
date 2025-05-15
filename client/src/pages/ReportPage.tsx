import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, AlertTriangle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import RiskIndicator from '../components/features/RiskIndicator';
import RiskChart from '../components/features/RiskChart';

const mockRiskData = [
  { riskLevel: 'High Risk', count: 3, color: '#ef4444' },
  { riskLevel: 'Medium Risk', count: 8, color: '#f59e0b' },
  { riskLevel: 'Low Risk', count: 12, color: '#0ea5e9' },
  { riskLevel: 'No Risk', count: 27, color: '#22c55e' },
];

const ReportPage: React.FC = () => {
  const handleDownload = async () => {
    const input = document.getElementById('report-content');
    if (!input) return;

    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('DocuGuard_Report.pdf');
  };

  return (
    <div className="container-custom py-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-neutral-900">Document Analysis Report</h1>
          <p className="text-neutral-600">
            Comprehensive analysis of "Software License Agreement"
          </p>
        </div>
        <Button leftIcon={<Download className="h-5 w-5" />} size="lg" onClick={handleDownload}>
          Download Full Report
        </Button>
      </div>

      <div id="report-content">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold text-neutral-900">Document Summary</h2>
            <div className="space-y-4">
              <div><strong>Title:</strong> Software License Agreement</div>
              <div><strong>Parties:</strong> Acme Tech & Global Corp</div>
              <div><strong>Date:</strong> March 15, 2023</div>
              <div><strong>Type:</strong> License Agreement</div>
              <div>
                <strong>Overview:</strong> Grants license use, includes high-risk indemnification, auto-renewals, and unilateral modifications.
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold text-neutral-900">Risk Assessment</h2>
            <div className="mb-6 flex items-center">
              <span className="mr-3 text-sm font-medium text-neutral-800">Overall Risk Level:</span>
              <RiskIndicator level="medium" size="lg" />
            </div>
            <RiskChart data={mockRiskData} className="h-64" />
          </Card>
        </div>

        {/* Key Issues */}
        <Card className="mt-8 p-6">
          <h2 className="mb-6 text-xl font-semibold text-neutral-900">Key Issues & Recommendations</h2>
          <div className="space-y-6">
            {/* High Risk Example */}
            <div className="rounded-lg border border-error-200 bg-error-50 p-4">
              <div className="mb-3 flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-error-500" />
                <h3 className="text-lg font-medium text-error-700">Unlimited Indemnification</h3>
              </div>
              <p className="text-neutral-700">
                Section 8.2 requires indemnification without caps or exclusions.
              </p>
              <div className="bg-white p-3 rounded-md mt-2">
                <strong>Recommendation:</strong> Add caps and exclusions for consequential damages.
              </div>
            </div>
          </div>
        </Card>

        {/* Key Clauses Table */}
        <Card className="mt-8 p-6">
          <h2 className="mb-6 text-xl font-semibold text-neutral-900">Key Terms & Clauses</h2>
          <table className="min-w-full divide-y divide-neutral-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Term</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Risk</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              <tr>
                <td className="px-6 py-4 text-sm text-neutral-800">Term Length</td>
                <td className="px-6 py-4 text-sm text-neutral-700">12 months with auto-renewal</td>
                <td className="px-6 py-4"><RiskIndicator level="medium" size="sm" /></td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-neutral-800">Indemnification</td>
                <td className="px-6 py-4 text-sm text-neutral-700">Unlimited, no exclusions</td>
                <td className="px-6 py-4"><RiskIndicator level="high" size="sm" /></td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-neutral-800">Governing Law</td>
                <td className="px-6 py-4 text-sm text-neutral-700">Delaware</td>
                <td className="px-6 py-4"><RiskIndicator level="none" size="sm" /></td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

export default ReportPage;
