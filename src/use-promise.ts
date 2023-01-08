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

		const promiseToUse = typeIs(promise, "function") ? promise() : promise;

		promiseToUse.then(
			(result) => setState({ status: promiseToUse.getStatus(), result, errorMessage }),
			(errorMessage: unknown) => setState({ status: promiseToUse.getStatus(), result, errorMessage }),
		);

		return () => {
			promiseToUse.cancel();
		};
	}, dependencies);

	return $tuple(result, errorMessage, status);
}
