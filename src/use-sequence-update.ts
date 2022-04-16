import { useEffect, useMemo, useMutable } from "@rbxts/roact-hooked";

import { useDidMount } from "./use-did-mount";
import { clearTimeout, setTimeout, Timeout } from "./utils/set-timeout";

interface Sequence<T> {
	ignoreMount?: boolean;
	updates: Updates<T> | (() => Updates<T>);
}

type Updates<T> = Array<[milliseconds: number, callback: () => T]>;

export function useSequenceUpdate<T>(sequence: Sequence<T>, onUpdate: (value: T) => void, deps: unknown[] = []) {
	const updates = useMemo(() => (typeIs(sequence.updates, "function") ? sequence.updates() : sequence.updates), deps);

	const callback = useMutable(onUpdate);
	callback.current = onUpdate;

	const didMount = useDidMount();

	useEffect(() => {
		if (didMount && sequence.ignoreMount) {
			return;
		}

		let timeout: Timeout;
		let index = 0;

		const runNext = () => {
			if (index < updates.size()) {
				const [delay, func] = updates[index];

				timeout = setTimeout(() => {
					callback.current(func());
					runNext();
				}, delay);

				index++;
			}
		};

		runNext();

		return () => clearTimeout(timeout);
	}, [updates, didMount]);
}
