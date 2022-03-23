import { useState } from "@rbxts/roact-hooked";

/**
 * @see https://mantine.dev/hooks/use-set-state/
 */
export function useSetState<T extends Record<string, unknown>>(initialState: T) {
	const [state, _setState] = useState(initialState);
	const setState = (statePartial: Partial<T> | ((currentState: T) => Partial<T>)) =>
		_setState((current) => ({
			...current,
			...(typeIs(statePartial, "function") ? statePartial(current) : statePartial),
		}));
	return [state, setState] as const;
}
