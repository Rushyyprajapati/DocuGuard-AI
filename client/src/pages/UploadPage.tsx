import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import FileUploader from '../components/features/FileUploader';
import ProgressBar from '../components/features/ProgressBar';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    setIsAnalyzing(true);

    try {
      // Upload the file
      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadRes = await fetch(`${BACKEND_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error(`Upload failed with status ${uploadRes.status}`);
      }

      // Expecting extractedText from backend
     const { extractedText } = await uploadRes.json();


      // Call ML API with actual text
      const analyzeRes = await fetch(`${BACKEND_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: extractedText }), // ✅ Correct payload
      });

      if (!analyzeRes.ok) {
        throw new Error(`Analysis failed with status ${analyzeRes.status}`);
      }

      // Simulate progress bar UI
      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 5;
          if (next >= 100) {
            clearInterval(interval);
            setTimeout(() => navigate('/analysis'), 500);
            return 100;
          }
          return next;
        });
      }, 300);
    } catch (err) {
      console.error('❌ Upload or analysis failed:', err);
      alert('Something went wrong. Please try again.');
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  return (
    <div className="container-custom py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-neutral-900">Upload Your Document</h1>
          <p className="text-neutral-600">
            Upload your legal document to begin the analysis process. We'll scan your document for risks, extract key
            information, and provide a comprehensive report.
          </p>
        </div>

        <Card className="mb-8">
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold text-neutral-800">Select Document</h2>
            <FileUploader onFileSelect={handleFileSelect} />
          </div>

          {selectedFile && !isAnalyzing && (
            <div className="mt-6">
              <Button
                fullWidth
                rightIcon={<ArrowRight className="h-5 w-5" />}
                onClick={handleAnalyze}
              >
                Analyze Document
              </Button>
            </div>
          )}

          {isAnalyzing && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-neutral-700">Analyzing document...</p>
              <ProgressBar value={progress} showValue size="md" />
              <div className="mt-4 flex flex-col space-y-2">
                <Step text="Extracting text and structure" active={progress > 0} />
                <Step text="Identifying entities and clauses" active={progress > 30} />
                <Step text="Analyzing risks and generating summary" active={progress > 60} />
                <Step text="Preparing final report" active={progress > 85} />
              </div>
            </div>
          )}
        </Card>

        <div className="rounded-lg bg-neutral-50 p-6">
          <div className="flex items-start space-x-4">
            <div className="rounded-full bg-primary-100 p-2">
              <FileText className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="mb-1 text-lg font-medium text-neutral-900">Supported File Types</h3>
              <p className="text-neutral-600">
                We currently support PDF and Microsoft Word documents (DOCX, DOC). For best results, ensure your
                document text is extractable and not an image-based scan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Step: React.FC<{ text: string; active: boolean }> = ({ text, active }) => (
  <div className="flex items-center space-x-2 text-sm text-neutral-600">
    <div className={`h-2 w-2 rounded-full ${active ? 'bg-primary-500' : 'bg-neutral-300'}`}></div>
    <span>{text}</span>
  </div>
);

export default UploadPage;
