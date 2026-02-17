import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';
import { RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("HerAura Runtime Error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-6 text-center">
            <h2 className="font-serif text-2xl text-stone-900 mb-2">Something went wrong</h2>
            <p className="text-stone-500 mb-6 max-w-xs mx-auto">
                We encountered an unexpected issue. Please try refreshing the page.
            </p>
            <Button onClick={() => window.location.reload()}>
                <RefreshCcw size={18} className="mr-2 inline" />
                Reload Application
            </Button>
        </div>
      );
    }

    return this.props.children;
  }
}