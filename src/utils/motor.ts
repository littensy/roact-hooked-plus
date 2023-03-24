import { GroupMotor, SingleMotor } from "@rbxts/flipper";

interface SingleMotorWithState extends SingleMotor {
	_state: {
		complete: boolean;
		value: number;
		velocity?: number;
	};
}

interface GroupMotorWithState<T> extends GroupMotor<T> {
	_motors: {
		[K in keyof T]: SingleMotorWithState;
	};
}

/**
 * Sets the velocity of the motor.
 * @param motor The motor to set the velocity of
 * @param velocity The velocity to set
 */
export function setMotorVelocity(motor: SingleMotor, velocity: number) {
	(motor as SingleMotorWithState)._state.velocity = velocity;
}

/**
 * Applies an impulse to the motor's velocity.
 * @param motor The motor to apply the impulse to
 * @param impulse The impulse to apply
 */
export function applyMotorImpulse(motor: SingleMotor, impulse: number) {
	const state = (motor as SingleMotorWithState)._state;
	state.velocity = (state.velocity ?? 0) + impulse;
}

/**
 * Sets the value of the motor.
 * @param motor The motor to set the value of
 * @param value The value to set
 */
export function setMotorValue(motor: SingleMotor, value: number) {
	(motor as SingleMotorWithState)._state.value = value;
}

/**
 * Sets the velocity of a group motor.
 * @param motor The motor to set the velocity of
 * @param values The velocities to set
 */
export function setGroupMotorVelocity<T>(motor: GroupMotor<T>, values: Partial<Record<keyof T, number>>) {
	const motors = (motor as GroupMotorWithState<T>)._motors;
	for (const [key, velocity] of pairs(values as Record<string, number>)) {
		motors[key as keyof T]._state.velocity = velocity;
	}
}

/**
 * Sets the value of a group motor.
 * @param motor The motor to set the value of
 * @param values The values to set
 */
export function setGroupMotorValue<T>(motor: GroupMotor<T>, values: Partial<Record<keyof T, number>>) {
	const motors = (motor as GroupMotorWithState<T>)._motors;
	for (const [key, value] of pairs(values as Record<string, number>)) {
		motors[key as keyof T]._state.value = value;
	}
}

/**
 * Applies an impulse to the velocity of a group motor.
 * @param motor The motor to apply the impulse to
 * @param values The impulses to apply
 */
export function applyGroupMotorImpulse<T>(motor: GroupMotor<T>, values: Partial<Record<keyof T, number>>) {
	const motors = (motor as GroupMotorWithState<T>)._motors;
	for (const [key, impulse] of pairs(values as Record<string, number>)) {
		const state = motors[key as keyof T]._state;
		state.velocity = (state.velocity ?? 0) + impulse;
	}
}
