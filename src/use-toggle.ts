import { useState } from "@rbxts/roact-hooked";

type SetStateAction<S> = S | ((prevState: S) => S);

/**
 * @see https://mantine.dev/hooks/use-toggle/
 */
export function useToggle<T>(initialValue: T, options: [T, T]) {
	const [state, setState] = useState(initialValue);

	const toggle = (value?: SetStateAction<T>) => {
		if (value !== undefined) {
			setState(value);
		} else {
			setState((current) => {
				if (current === options[0]) {
					return options[1];
				}

				return options[0];
			});
		}
	};

	return $tuple(state, toggle);
}

/**
 * @see https://mantine.dev/hooks/use-toggle/
 */
export function useBooleanToggle(initialValue = false) {
	return useToggle(initialValue, [true, false]);
}
