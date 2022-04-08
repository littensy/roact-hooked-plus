import { useEffect } from "@rbxts/roact-hooked";

export function useEvent<T extends RBXScriptSignal>(
	event: T,
	callback: T extends RBXScriptSignal<infer U> ? U : never,
	deps: unknown[] = [],
) {
	useEffect(() => {
		const handle = event.Connect(callback);
		return () => handle.Disconnect();
	}, deps);
}
