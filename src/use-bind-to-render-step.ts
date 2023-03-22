import { useEffect, useMutable } from "@rbxts/roact-hooked";
import { HttpService, RunService } from "@rbxts/services";

/**
 * Binds a callback with a unique key to render step. Useful for binding a
 * callback whose key might overlap with other components or not clean up in
 * time.
 * @param priority The render priority of the binding.
 * @param callback The callback to bind.
 */
export function useBindToRenderStep(priority: number, callback: (deltaTime: number) => void) {
	const callbackRef = useMutable(callback);
	callbackRef.current = callback;

	useEffect(() => {
		const key = HttpService.GenerateGUID(false);

		RunService.BindToRenderStep(key, priority, callbackRef.current);

		return () => {
			RunService.UnbindFromRenderStep(key);
		};
	}, [priority]);
}
