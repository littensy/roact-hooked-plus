import Roact from "@rbxts/roact";

export function isBinding<T = unknown>(value: unknown): value is Roact.Binding<T> {
	return typeIs(value, "table") && "getValue" in value;
}

export function asBinding<T>(value: T | Roact.Binding<T>): Roact.Binding<T> {
	if (isBinding(value)) {
		return value;
	} else {
		return Roact.createBinding(value)[0];
	}
}

export function mapBinding<T, U>(value: T | Roact.Binding<T>, transform: (value: T) => U): Roact.Binding<U> {
	if (isBinding(value)) {
		return value.map(transform);
	} else {
		return Roact.createBinding(transform(value))[0];
	}
}

export function getBindingValue<T>(value: T | Roact.Binding<T>): T {
	if (isBinding(value)) {
		return value.getValue();
	} else {
		return value;
	}
}
