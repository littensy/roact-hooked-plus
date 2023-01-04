import { GroupMotor, SingleMotor, isMotor } from "@rbxts/flipper";
import Roact from "@rbxts/roact";

const AssignedBinding = setmetatable({}, { __tostring: () => "AssignedBinding" }) as symbol;

export function getBinding<T>(
	motor: SingleMotor | GroupMotor<T>,
): T extends undefined ? Roact.Binding<number> : Roact.Binding<T> {
	assert(motor, "Missing argument #1: motor");
	assert(isMotor(motor), "Provided value is not a motor");

	if (AssignedBinding in motor) {
		return motor[AssignedBinding as never];
	}

	const [binding, setBindingValue] = Roact.createBinding(motor.getValue());
	motor.onStep(setBindingValue);

	motor[AssignedBinding as never] = binding as never;
	return binding as never;
}
