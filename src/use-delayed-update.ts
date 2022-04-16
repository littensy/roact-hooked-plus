import { useEffect, useMemo } from "@rbxts/roact-hooked";

import { setTimeout } from "./utils/set-timeout";
import { clearUpdates, IncomingUpdate } from "./use-delayed-value";

let nextId = 0;

export function useDelayedUpdate<T>(value: T, delay: number, callback: (value: T) => void) {
	const updates = useMemo(() => new Map<number, IncomingUpdate>(), []);

	useEffect(() => {
		const id = nextId++;
		const update: IncomingUpdate = {
			timeout: setTimeout(() => {
				callback(value);
				updates.delete(id);
			}, delay),
			resolveTime: os.clock() + delay,
		};

		// Clear all updates that are later than the current one to prevent overlap
		clearUpdates(updates, update.resolveTime);

		updates.set(id, update);
	}, [value]);

	useEffect(() => {
		return () => clearUpdates(updates);
	}, []);
}
