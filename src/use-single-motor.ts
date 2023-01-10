import { Instant, Linear, SingleMotor, Spring } from "@rbxts/flipper";
import { useBinding, useEffect, useMemo } from "@rbxts/roact-hooked";

export function useSingleMotor(initialValue: number) {
	const motor = useMemo(() => new SingleMotor(initialValue), []);
	const [binding, setBinding] = useBinding(motor.getValue());

	useEffect(() => {
		motor.onStep(setBinding);
		return () => {
			motor.stop();
		};
	}, []);

	const setGoal = (goal: Spring | Linear | Instant) => {
		motor.setGoal(goal);
	};

	return $tuple(binding, setGoal, motor);
}
