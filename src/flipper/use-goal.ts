import { Instant, Linear, Spring } from "@rbxts/flipper";
import Roact from "@rbxts/roact";

import { getBinding } from "./get-binding";
import { useMotor } from "./use-motor";

type Goal = {
	_targetValue: number;
};

export function useGoal(goal: Spring | Linear | Instant): Roact.Binding<number> {
	const motor = useMotor((goal as unknown as Goal)._targetValue);
	motor.setGoal(goal);
	return getBinding(motor);
}
