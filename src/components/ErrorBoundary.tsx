"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { components, typography } from "@/lib/designTokens";

// Separate functional component for the error UI that can use hooks
function ErrorFallbackUI({
  error,
  errorInfo,
  onReset,
}: {
  error?: Error;
  errorInfo?: React.ErrorInfo;
  onReset: () => void;
}) {
  const t = useTranslations("common.error");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className={`${components.card.elevated} max-w-2xl w-full`}>
        <CardContent className="p-8 text-center">
          <div
            className={`w-20 h-20 rounded-2xl ${components.icon.background} flex items-center justify-center mx-auto mb-6`}
          >
            <AlertTriangle className={`w-10 h-10 ${components.icon.accent}`} />
          </div>

          <h1 className={`${typography.h3} text-foreground mb-3`}>
            {t("title")}
          </h1>

          <p className={`${typography.body} text-muted-foreground mb-6`}>
            {t("description")}
          </p>

          {process.env.NODE_ENV === "development" && error && (
            <div className="mb-6 p-4 bg-muted rounded-lg text-left overflow-auto max-h-48">
              <p className="text-sm font-mono text-destructive mb-2">
                {error.toString()}
              </p>
              {errorInfo && (
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                  {errorInfo.componentStack}
                </pre>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={onReset} className={components.button.primary}>
              <RefreshCw className="w-4 h-4 mr-2" />
              {t("refresh")}
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className={components.button.secondary}
            >
              {t("backToHome")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });

    // TODO: Log to error reporting service (e.g., Sentry)
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallbackUI
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}
