import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Shield, Database, MessageSquare, BarChart3, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      title: 'Risk Detection',
      description: 'Automatically identify potential legal risks and liability issues in your contracts and documents.',
      icon: <AlertTriangle className="h-6 w-6 text-warning-500" />,
    },
    {
      title: 'Entity Extraction',
      description: 'Identify parties, dates, financial terms, and other key entities within your documents.',
      icon: <Database className="h-6 w-6 text-secondary-600" />,
    },
    {
      title: 'Document Q&A',
      description: 'Ask natural language questions about your document and receive accurate answers instantly.',
      icon: <MessageSquare className="h-6 w-6 text-primary-600" />,
    },
    {
      title: 'Visual Analysis',
      description: 'View comprehensive reports with visual breakdowns of risks and key information.',
      icon: <BarChart3 className="h-6 w-6 text-primary-600" />,
    },
  ];
  
  const riskLevels = [
    {
      level: 'High Risk',
      description: 'Clauses that require immediate attention and may present significant liability.',
      icon: <AlertCircle className="h-5 w-5 text-error-500" />,
      color: 'bg-error-50',
    },
    {
      level: 'Medium Risk',
      description: 'Issues that should be addressed but are not immediately critical.',
      icon: <AlertTriangle className="h-5 w-5 text-warning-500" />,
      color: 'bg-warning-50',
    },
    {
      level: 'Low Risk',
      description: 'Minor concerns that should be reviewed as a best practice.',
      icon: <AlertTriangle className="h-5 w-5 text-secondary-500" />,
      color: 'bg-secondary-50',
    },
    {
      level: 'No Risk',
      description: 'Clauses that adhere to best practices and require no changes.',
      icon: <CheckCircle className="h-5 w-5 text-success-500" />,
      color: 'bg-success-50',
    },
  ];
  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-16 md:py-24">
        <div className="container-custom">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 rounded-full bg-primary-100 p-3">
              <Shield className="h-8 w-8 text-primary-600" />
            </div>
            <h1 className="mb-6 max-w-3xl text-center font-bold text-neutral-900">
              AI-Powered Legal Document Review
            </h1>
            <p className="mb-8 max-w-2xl text-lg text-neutral-700">
              DocuGuard AI helps legal professionals analyze contracts and documents faster and more accurately by identifying risks, extracting key information, and answering questions.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button
                size="lg"
                leftIcon={<Upload className="h-5 w-5" />}
                onClick={() => navigate('/upload')}
              >
                Upload Document
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  const featuresSection = document.getElementById('features');
                  featuresSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Features
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-neutral-900">Powerful Document Analysis</h2>
            <p className="mx-auto max-w-2xl text-neutral-600">
              Our AI-powered platform helps you understand, analyze, and extract value from your legal documents.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="flex flex-col p-6"
                hoverable
              >
                <div className="mb-4 rounded-full bg-primary-50 p-3 w-fit">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-neutral-900">{feature.title}</h3>
                <p className="text-neutral-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Risk Classification Section */}
      <section className="bg-neutral-50 py-16">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-neutral-900">Comprehensive Risk Classification</h2>
            <p className="mx-auto max-w-2xl text-neutral-600">
              Our advanced algorithms classify and categorize potential issues in your documents, allowing you to focus on what matters most.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {riskLevels.map((risk, index) => (
              <div
                key={index}
                className={`rounded-lg p-5 ${risk.color}`}
              >
                <div className="mb-3 flex items-center space-x-2">
                  {risk.icon}
                  <h3 className="text-lg font-semibold text-neutral-900">{risk.level}</h3>
                </div>
                <p className="text-neutral-700">{risk.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary-900 py-16 text-white">
        <div className="container-custom">
          <div className="flex flex-col items-center text-center">
            <h2 className="mb-6 text-white">Start Analyzing Your Documents Today</h2>
            <p className="mb-8 max-w-2xl text-primary-100">
              Upload your first document and see how DocuGuard AI can transform your document review process.
            </p>
            <Button
              size="lg"
              variant="primary"
              className="bg-white text-primary-900 hover:bg-primary-50"
              onClick={() => navigate('/upload')}
            >
              Try DocuGuard AI
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;