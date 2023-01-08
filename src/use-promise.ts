import { useEffect, useState } from "@rbxts/roact-hooked";

interface PromiseState<T> {
	status: Promise.Status;
	result?: T;
	errorMessage?: unknown;
}

export function usePromise<T>(promise: Promise<T> | (() => Promise<T>), dependencies: unknown[] = []) {
	const [{ result, errorMessage, status }, setState] = useState<PromiseState<T>>({
		status: Promise.Status.Started,
	});

	useEffect(() => {
		if (status !== Promise.Status.Started) {
			setState({ status: Promise.Status.Started });
		}

		let result: T | undefined;
		let errorMessage: unknown;

		const promiseToUse = (typeIs(promise, "function") ? promise() : promise)
			.then(
				(promiseResult) => (result = promiseResult),
				(promiseErrorMessage: unknown) => (errorMessage = promiseErrorMessage),
			)
			.done((status) => {
				setState({ status, result, errorMessage });
			});

		return () => {
			promiseToUse.cancel();
		};
	}, dependencies);

	return $tuple(result, errorMessage, status);
}
