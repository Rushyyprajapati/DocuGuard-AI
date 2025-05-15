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
  
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };
  
  const handleAnalyze = () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            navigate('/analysis');
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };
  
  return (
    <div className="container-custom py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-neutral-900">Upload Your Document</h1>
          <p className="text-neutral-600">
            Upload your legal document to begin the analysis process. We'll scan your document for risks, extract key information, and provide a comprehensive report.
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
                <div className="flex items-center space-x-2 text-sm text-neutral-600">
                  <div className="h-2 w-2 rounded-full bg-primary-500"></div>
                  <span>Extracting text and structure</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-neutral-600">
                  <div className={`h-2 w-2 rounded-full ${progress > 30 ? 'bg-primary-500' : 'bg-neutral-300'}`}></div>
                  <span>Identifying entities and clauses</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-neutral-600">
                  <div className={`h-2 w-2 rounded-full ${progress > 60 ? 'bg-primary-500' : 'bg-neutral-300'}`}></div>
                  <span>Analyzing risks and generating summary</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-neutral-600">
                  <div className={`h-2 w-2 rounded-full ${progress > 85 ? 'bg-primary-500' : 'bg-neutral-300'}`}></div>
                  <span>Preparing final report</span>
                </div>
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
                We currently support PDF and Microsoft Word documents (DOCX, DOC). For best results, ensure your document text is extractable and not an image-based scan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;