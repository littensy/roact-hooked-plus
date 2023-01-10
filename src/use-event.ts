import { useEffect, useMutable } from "@rbxts/roact-hooked";

export function useEvent<T extends unknown[]>(
	event: { Connect: (callback: (...args: T) => void) => { Disconnect: () => void } },
	callback?: (...args: T) => void,
) {
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
	}, [event, callback !== undefined]);
}
