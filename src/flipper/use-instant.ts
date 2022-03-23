import { Instant } from "@rbxts/flipper";
import Roact from "@rbxts/roact";

import { useGoal } from "./use-goal";

export function useInstant(targetValue: number): Roact.Binding<number> {
	return useGoal(new Instant(targetValue));
}
