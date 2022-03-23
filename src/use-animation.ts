import { Instant, Linear, Spring } from "@rbxts/flipper";
import { Binding } from "@rbxts/roact";

import { getBinding, useMotor } from "./flipper";

type GoalCtor = typeof Spring | typeof Linear;
type GoalFunction<T extends GoalCtor, U> = (value: U, ctor: T, options?: ConstructorParameters<T>[1]) => Binding<U>;

const motorHooks: Partial<Record<keyof CheckableTypes, GoalFunction<GoalCtor, any>>> = {
	number: identity<GoalFunction<GoalCtor, number>>((value, ctor, options = {}) => {
		const motor = useMotor(value);
		motor.setGoal(new ctor(value, options));

		return getBinding(motor);
	}),

	Color3: identity<GoalFunction<GoalCtor, Color3>>((color, ctor, options = {}) => {
		const motor = useMotor([color.R, color.G, color.B]);
		motor.setGoal([new ctor(color.R, options), new ctor(color.G, options), new ctor(color.B, options)]);

		return getBinding(motor).map(([r, g, b]) => new Color3(r, g, b));
	}),

	UDim: identity<GoalFunction<GoalCtor, UDim>>((udim, ctor, options) => {
		const motor = useMotor([udim.Scale, udim.Offset]);
		motor.setGoal([new ctor(udim.Scale, options), new ctor(udim.Offset, options)]);

		return getBinding(motor).map(([s, o]) => new UDim(s, o));
	}),

	UDim2: identity<GoalFunction<GoalCtor, UDim2>>((udim2, ctor, options) => {
		const motor = useMotor([udim2.X.Scale, udim2.X.Offset, udim2.Y.Scale, udim2.Y.Offset]);
		motor.setGoal([
			new ctor(udim2.X.Scale, options),
			new ctor(udim2.X.Offset, options),
			new ctor(udim2.Y.Scale, options),
			new ctor(udim2.Y.Offset, options),
		]);

		return getBinding(motor).map(([xS, xO, yS, yO]) => new UDim2(xS, math.round(xO), yS, math.round(yO)));
	}),

	Vector2: identity<GoalFunction<GoalCtor, Vector2>>((vector2, ctor, options) => {
		const motor = useMotor([vector2.X, vector2.Y]);
		motor.setGoal([new ctor(vector2.X, options), new ctor(vector2.Y, options)]);

		return getBinding(motor).map(([X, Y]) => new Vector2(X, Y));
	}),

	table: identity<GoalFunction<GoalCtor, number[]>>((array, ctor, options) => {
		const motor = useMotor(array);
		motor.setGoal(array.map((value) => new ctor(value, options)));

		return getBinding(motor);
	}),
};

export function useAnimation<T extends CheckableTypes[keyof typeof motorHooks]>(
	value: T,
	ctor?: typeof Instant,
	options?: never,
): Binding<T>;
export function useAnimation<T extends CheckableTypes[keyof typeof motorHooks]>(
	value: T,
	ctor?: typeof Spring,
	options?: ConstructorParameters<typeof Spring>[1],
): Binding<T>;
export function useAnimation<T extends CheckableTypes[keyof typeof motorHooks]>(
	value: T,
	ctor?: typeof Linear,
	options?: ConstructorParameters<typeof Linear>[1],
): Binding<T>;

export function useAnimation<T extends CheckableTypes[keyof typeof motorHooks], U extends GoalCtor>(
	value: T,
	ctor?: U | typeof Instant,
	options?: ConstructorParameters<U>[1],
): Binding<T> {
	const hook = motorHooks[typeOf(value)];
	assert(hook, `useAnimation: Value of type ${typeOf(value)} is not supported`);

	return hook(value, (ctor || Spring) as U, options);
}
