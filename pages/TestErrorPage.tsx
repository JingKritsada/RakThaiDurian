import React, { useState } from "react";

import { Button } from "../components/Button";

// TODO: Delete this page later. It is only for testing error handling.
export const TestErrorPage: React.FC = () => {
	const [shouldError, setShouldError] = useState(false);
	const [shouldReferenceError, setShouldReferenceError] = useState(false);

	if (shouldError) {
		throw new Error(
			"This is a test error to demonstrate the error page!, This is a test error to demonstrate the error page!, This is a test error to demonstrate the error page!, This is a test error to demonstrate the error page!"
		);
	}

	if (shouldReferenceError) {
		// @ts-ignore - intentionally causing an error
		nonExistentFunction(); // eslint-disable-line no-undef
	}

	const triggerError = () => {
		setShouldError(true);
	};

	const triggerReferenceError = () => {
		setShouldReferenceError(true);
	};

	const triggerAsyncError = () => {
		setTimeout(() => {
			throw new Error("Async error - this won't be caught by error boundary");
		}, 100);
	};

	return (
		<div className="flex flex-col items-center justify-center max-w-xl mx-auto p-8 space-y-8 font-mono tracking-tight h-full">
			<h1 className="mb-6 text-5xl font-bold text-center">Test Error Page</h1>

			<div className="space-y-4 w-full">
				<Button className="w-full" variant="danger" onClick={triggerError}>
					Trigger Custom Error (Render)
				</Button>

				<Button className="w-full" variant="danger" onClick={triggerReferenceError}>
					Trigger Reference Error (Render)
				</Button>

				<Button className="w-full" variant="danger" onClick={triggerAsyncError}>
					Trigger Async Error (Will not be caught)
				</Button>
			</div>
		</div>
	);
};
