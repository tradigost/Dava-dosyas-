/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'Beklenmeyen bir uygulama hatası oluştu.',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Uncaught UI error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#ebe5d8] text-[#1f1c18] flex items-center justify-center p-6 font-typewriter">
          <div className="max-w-md w-full bg-[#faf6ed] border border-[#1f1c18] rounded-sm p-6 text-center space-y-4 shadow-[0_6px_24px_rgba(31,28,24,0.12)]">
            <div className="w-12 h-12 rounded-sm bg-[#8b1e1e]/10 border border-[#8b1e1e] text-[#8b1e1e] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold uppercase tracking-wider">
              Arşiv Dosyası Açılamadı
            </h2>
            <p className="text-xs text-[#575046] font-sans leading-relaxed">
              {this.state.message}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full py-2.5 px-4 bg-[#1f1c18] hover:bg-[#8b1e1e] text-[#faf6ed] text-xs font-bold uppercase tracking-wider rounded-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Uygulamayı Yenile</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
