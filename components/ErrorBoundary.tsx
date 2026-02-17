import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';
import { RefreshCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-6 text-center">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6 text-rose-500 shadow-sm border border-rose-100">
                <AlertTriangle size={32} />
            </div>
            <h1 className="font-serif text-3xl text-stone-900 mb-3">Something went wrong</h1>
            <p className="text-stone-500 mb-8 max-w-xs mx-auto leading-relaxed">
                We encountered an unexpected issue. Please try refreshing the page.
            </p>
            <Button onClick={() => window.location.reload()}>
                <RefreshCcw size={18} className="mr-2 inline" />
                Reload Application
            </Button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-8 p-4 bg-stone-100 rounded-xl text-left overflow-auto max-w-full text-xs font-mono text-stone-600 border border-stone-200 w-full">
                    {this.state.error.toString()}
                </div>
            )}
        </div>
      );
    }

    return this.props.children;
  }
}