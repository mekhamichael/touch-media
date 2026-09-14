import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-navy-950 px-6">
          <div className="flex max-w-md flex-col items-center text-center animate-fade-in">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-red-400/30 bg-red-400/10">
              <AlertTriangle size={36} className="text-red-400" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-cream md:text-4xl">
              Something Went Wrong
            </h1>
            <p className="mt-4 text-base leading-relaxed text-cream/60">
              An unexpected error occurred. Please try again, or{' '}
              <a
                href="https://wa.me/01151921862"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline underline-offset-2 transition-colors hover:text-gold-light"
              >
                contact support
              </a>{' '}
              if the issue persists.
            </p>
            <button
              onClick={this.handleRetry}
              className="mt-8 inline-flex items-center gap-2 rounded border border-gold/60 px-6 py-3 text-sm font-semibold tracking-[0.15em] uppercase text-gold transition-all duration-300 hover:bg-gold hover:text-navy-900"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
