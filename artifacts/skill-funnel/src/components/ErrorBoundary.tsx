import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Funnel screen failed to render', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[70vh] items-center justify-center px-5 py-12">
          <div className="w-full max-w-[620px] rounded-[8px] border border-[#d7e6f4] bg-white p-6 text-center shadow-[0_18px_44px_rgba(6,19,34,0.18)]">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#0f7ee8] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
              One moment
            </p>
            <h1 className="mt-3 text-4xl font-black uppercase leading-tight text-[#07192f] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
              Checkout is refreshing
            </h1>
            <p className="mx-auto mt-4 max-w-[460px] text-sm font-semibold leading-relaxed text-[#425d78]">
              Something loaded out of order. Refresh the page and continue from the checkout.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex min-h-[52px] items-center justify-center rounded-[4px] bg-[#0f7ee8] px-8 text-base font-black uppercase tracking-[0.06em] text-white shadow-[0_8px_24px_rgba(15,126,232,0.35)] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]"
            >
              Refresh Checkout
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
