import { useEffect, useMutable, useState } from "@rbxts/roact-hooked";
import { Timeout, clearTimeout, setTimeout } from "./utils/set-timeout";

/**
 * @see https://mantine.dev/hooks/use-debounced-value/
 */
export function useDebouncedValue<T = unknown>(value: T, wait: number, options = { leading: false }) {
	const [_value, setValue] = useState(value);
	const mountedRef = useMutable(false);
	const timeoutRef = useMutable<Timeout>(undefined);
	const cooldownRef = useMutable(false);

	const cancel = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
	};

	useEffect(() => {
		if (mountedRef.current) {
			if (!cooldownRef.current && options.leading) {
				cooldownRef.current = true;
				setValue(value);
			} else {
				cancel();
				timeoutRef.current = setTimeout(() => {
					cooldownRef.current = false;
					setValue(value);
				}, wait);
			}
		}
	}, [value, options.leading]);

	useEffect(() => {
		mountedRef.current = true;
		return cancel;
	}, []);

	return [_value, cancel] as const;
}
