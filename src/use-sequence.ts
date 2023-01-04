import { useEffect, useMemo, useState } from "@rbxts/roact-hooked";
import { useDidMount } from "./use-did-mount";
import { resolve } from "./utils/resolve";
import { Timeout, clearTimeout, setTimeout } from "./utils/set-timeout";

interface Sequence<T> {
	initialState: T;
	ignoreMount?: boolean;
	updates: Updates<T> | (() => Updates<T>);
}

type Updates<T> = Array<[milliseconds: number, callback: () => T]>;

export function useSequence<T>(sequence: Sequence<T>, deps: unknown[] = []): T {
	const [state, setState] = useState(sequence.initialState);
	const updates = useMemo(() => resolve(sequence.updates), deps);
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
					setState(func());
					runNext();
				}, delay);

				index++;
			}
		};

		runNext();

		return () => clearTimeout(timeout);
	}, [updates, didMount]);

	return state;
}
