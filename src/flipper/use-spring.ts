import Roact from "@rbxts/roact";
import { Spring } from "@rbxts/flipper";
import { useGoal } from "./use-goal";

export type SpringOptions = ConstructorParameters<typeof Spring>[1];

export function useSpring(targetValue: number, options: SpringOptions): Roact.Binding<number> {
	return useGoal(new Spring(targetValue, options));
}
