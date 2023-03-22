import Roact from "@rbxts/roact";
import { useEffect, useMutable, useState } from "@rbxts/roact-hooked";
import { getBindingValue, isBinding } from "./utils/binding-utils";

interface BindingInternalApi<T> {
	subscribe: (callback: (newValue: T) => void) => () => void;
	update: (newValue: T) => void;
}

function getInternalApi<T>(binding: Roact.Binding<T>) {
	for (const [k, v] of pairs(binding)) {
		if (tostring(k) === "Symbol(BindingImpl)") {
			return v as unknown as BindingInternalApi<T>;
		}
	}
}

/**
 * Subscribes to a binding and calls the callback when the value changes.
 * If the value is not a binding, this behaves like useEffect.
 * @param binding The binding or value to subscribe to.
 * @param callback The callback to call when the value changes.
 */
export function useBindingEvent<T>(binding: Roact.Binding<T> | T, callback: (value: T) => void) {
	const callbackRef = useMutable(callback);
	callbackRef.current = callback;

	useEffect(() => {
		if (!isBinding(binding)) {
			callbackRef.current(binding);
			return;
		}

		callbackRef.current(binding.getValue());

		return getInternalApi(binding)?.subscribe((newValue) => {
			callbackRef.current(newValue);
		});
	}, [binding]);
}

/**
 * Returns the state of the binding wrapped in a `useState` hook. When the
 * value changes, the component will re-render.
 * @param binding The binding or value to get the state of.
 * @returns The value of the binding.
 */
export function useBindingState<T>(binding: Roact.Binding<T> | T): T {
	const [value, setValue] = useState(getBindingValue(binding));

	useBindingEvent(binding, setValue);

	return value;
}
