import { useEffect, useMemo, useState } from "@rbxts/roact-hooked";
import { clearTimeout, setTimeout, Timeout } from "./utils/set-timeout";

export interface IncomingUpdate {
	timeout: Timeout;
	resolveTime: number;
}

export function clearUpdates(updates: Map<number, IncomingUpdate>, laterThan?: number) {
	for (const [id, update] of updates) {
		if (laterThan === undefined || update.resolveTime >= laterThan) {
			updates.delete(id);
			clearTimeout(update.timeout);
		}
	}
}

let nextId = 0;

export function useDelayedValue<T>(value: T, delayMs: number): T {
	const [delayedValue, setDelayedValue] = useState(value);
	const updates = useMemo(() => new Map<number, IncomingUpdate>(), []);

	useEffect(() => {
		const id = nextId++;
		const update: IncomingUpdate = {
			timeout: setTimeout(() => {
				setDelayedValue(value);
				updates.delete(id);
			}, delayMs),
			resolveTime: os.clock() + delayMs,
		};

		// Clear all updates that are later than the current one to prevent overlap
		clearUpdates(updates, update.resolveTime);

		updates.set(id, update);
	}, [value]);

	useEffect(() => {
		return () => clearUpdates(updates);
	}, []);

	return delayedValue;
}
