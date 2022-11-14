import { Linear } from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { useGoal } from "./use-goal";

export function useLinear(
	targetValue: number,
	options?: ConstructorParameters<typeof Linear>[1],
): Roact.Binding<number> {
	return useGoal(new Linear(targetValue, options));
}
