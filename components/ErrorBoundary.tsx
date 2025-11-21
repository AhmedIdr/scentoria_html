import React, { Component, ReactNode } from 'react';
import { Button } from './UI';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-sand px-6">
          <div className="max-w-md text-center">
            <h1 className="text-6xl font-serif text-midnight mb-4">Oops!</h1>
            <p className="text-xl text-cedar mb-6">
              Something went wrong. We're sorry for the inconvenience.
            </p>
            {this.state.error && (
              <details className="mb-8 text-left">
                <summary className="text-sm text-cedar/60 cursor-pointer hover:text-cedar mb-2">
                  Error details
                </summary>
                <pre className="text-xs bg-white/50 p-4 rounded overflow-auto max-h-40 text-cedar/80">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <div className="flex gap-4 justify-center">
              <Button onClick={this.handleReset}>
                Return Home
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
