import { useEffect, useMutable } from "@rbxts/roact-hooked";

interface SignalLike<T extends Callback = Callback> {
	Connect(callback: T): ConnectionLike;
}

interface ConnectionLike {
	Disconnect(): void;
}

export function useEvent<T extends SignalLike>(event: T, callback?: T extends SignalLike<infer U> ? U : never) {
	const callbackRef = useMutable(callback);
	callbackRef.current = callback;

	useEffect(() => {
		if (!callback) {
			return;
		}

		const connection = event.Connect((...args) => {
			callbackRef.current?.(...args);
		});

		return () => connection.Disconnect();
	}, [callback !== undefined]);
}
