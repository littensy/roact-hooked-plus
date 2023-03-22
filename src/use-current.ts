import { useMutable } from "@rbxts/roact-hooked";

/**
 * Returns a mutable object whose `.current` property updates to the latest
 * version of the given value.
 * @param value The value to use.
 * @returns A mutable object that references it.
 */
export function useCurrent<T>(value: T): { current: T } {
	const ref = useMutable(value);
	ref.current = value;
	return ref;
}
