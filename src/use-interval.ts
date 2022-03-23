import { useMutable, useState } from "@rbxts/roact-hooked";

import { clearInterval, Interval, setInterval } from "./utils/set-interval";

/**
 * @see https://mantine.dev/hooks/use-interval/
 */
export function useInterval(fn: () => void, intervalMs: number) {
	const [active, setActive] = useState(false);
	const intervalRef = useMutable<Interval>();

	const start = () => {
		if (!active) {
			setActive(true);
			intervalRef.current = setInterval(fn, intervalMs);
		}
	};

	const stop = () => {
		setActive(false);
		clearInterval(intervalRef.current);
	};

	const toggle = () => {
		if (active) {
			stop();
		} else {
			start();
		}
	};

	return { start, stop, toggle, active };
}
