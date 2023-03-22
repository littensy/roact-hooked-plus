import { useEffect, useMutable } from "@rbxts/roact-hooked";

/**
 * Hook to get the previous value of a variable
 * @param value The value to get the previous value of
 * @returns The previous value of the variable
 */
export function usePrevious<T>(value: T) {
	const ref = useMutable(value);

	useEffect(() => {
		ref.current = value;
	}, [value]);

	return ref.current;
}
