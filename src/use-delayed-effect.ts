import { useEffect, useMemo } from "@rbxts/roact-hooked";
import { IncomingUpdate, clearUpdates } from "./use-delayed-value";
import { setTimeout } from "./utils/set-timeout";

let nextId = 0;

export function useDelayedEffect(effect: () => void, delayMs: number, deps: unknown[]) {
	const updates = useMemo(() => new Map<number, IncomingUpdate>(), []);

	useEffect(() => {
		const id = nextId++;
		const update: IncomingUpdate = {
			timeout: setTimeout(() => {
				effect();
				updates.delete(id);
			}, delayMs),

			resolveTime: os.clock() + delayMs,
		};

		// Clear all updates that are later than the current one to prevent overlap
		clearUpdates(updates, update.resolveTime);

		updates.set(id, update);
	}, deps);

	useEffect(() => {
		return () => clearUpdates(updates);
	}, []);
}
