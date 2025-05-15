import React from 'react';
import { Shield, Github, FileText, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 gap-8 pb-8 md:grid-cols-4">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary-600" />
              <span className="text-lg font-bold text-primary-700">DocuGuard AI</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-neutral-600">
              AI-powered legal document analysis that identifies risks and extracts key information.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h3 className="text-base font-semibold text-neutral-900">Product</h3>
                <ul className="mt-4 space-y-3">
                  <li>
                    <Link to="/" className="text-sm text-neutral-600 transition-colors hover:text-primary-600">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="text-sm text-neutral-600 transition-colors hover:text-primary-600">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="text-sm text-neutral-600 transition-colors hover:text-primary-600">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold text-neutral-900">Company</h3>
                <ul className="mt-4 space-y-3">
                  <li>
                    <Link to="/" className="text-sm text-neutral-600 transition-colors hover:text-primary-600">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="text-sm text-neutral-600 transition-colors hover:text-primary-600">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="text-sm text-neutral-600 transition-colors hover:text-primary-600">
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold text-neutral-900">Legal</h3>
                <ul className="mt-4 space-y-3">
                  <li>
                    <Link to="/" className="text-sm text-neutral-600 transition-colors hover:text-primary-600">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="text-sm text-neutral-600 transition-colors hover:text-primary-600">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="text-sm text-neutral-600 transition-colors hover:text-primary-600">
                      Security
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col justify-between gap-6 border-t border-neutral-200 py-8 md:flex-row">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} DocuGuard AI. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-neutral-500 hover:text-primary-600" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-neutral-500 hover:text-primary-600" aria-label="Documentation">
              <FileText className="h-5 w-5" />
            </a>
            <a href="#" className="text-neutral-500 hover:text-primary-600" aria-label="Contact">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;