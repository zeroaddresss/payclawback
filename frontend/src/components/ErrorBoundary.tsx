import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-8 py-10 text-center shadow-lg">
            <h1 className="mb-2 text-xl font-semibold text-white">Something went wrong</h1>
            <p className="mb-6 text-sm text-zinc-400">
              An unexpected error occurred. Please reload the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-teal-500"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
