import { GroupMotor, SingleMotor } from "@rbxts/flipper";
import { useEffect, useMemo } from "@rbxts/roact-hooked";

function createMotor(initialValue: number | number[] | Record<string, number>): SingleMotor | GroupMotor<unknown> {
	if (typeIs(initialValue, "number")) {
		return new SingleMotor(initialValue);
	} else if (typeIs(initialValue, "table")) {
		return new GroupMotor(initialValue);
	} else {
		throw `Invalid type for initialValue. Expected 'number' or 'table', got '${initialValue}'`;
	}
}

export function useMotor<T extends number | number[] | Record<string, number>>(
	initialValue: T,
): T extends number ? SingleMotor : GroupMotor<T> {
	const motor = useMemo(() => createMotor(initialValue), []);

	useEffect(() => {
		return () => {
			motor.stop();
		};
	}, []);

	return motor as never;
}
