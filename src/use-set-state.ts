import { useState } from "@rbxts/roact-hooked";
import { resolve } from "./utils/resolve";

/**
 * @see https://mantine.dev/hooks/use-set-state/
 */
export function useSetState<T extends Record<string, unknown>>(initialState: T) {
	const [state, _setState] = useState(initialState);
	const setState = (statePartial: Partial<T> | ((currentState: T) => Partial<T>)) =>
		_setState((current) => ({
			...current,
			...resolve(statePartial, current),
		}));
	return $tuple(state, setState);
}
