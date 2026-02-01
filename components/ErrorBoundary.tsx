import React, { Component, ErrorInfo, ReactNode } from "react";

import { ErrorPage } from "../pages/ErrorPage";

interface Props {
	children?: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
		error: null,
	};

	public static getDerivedStateFromError(error: Error): State {
		// Update state so the next render will show the fallback UI.
		return { hasError: true, error };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// eslint-disable-next-line no-console
		console.error("Uncaught error:", error, errorInfo);
	}

	public resetError = () => {
		this.setState({ hasError: false, error: null });

		// Redirect to home screen
		window.location.href = "/";
	};

	public render() {
		if (this.state.hasError && this.state.error) {
			return <ErrorPage error={this.state.error} reset={this.resetError} />;
		}

		return this.props.children;
	}
}
