import Roact from "@rbxts/roact";
import { useEffect, useRef } from "@rbxts/roact-hooked";
import { UserInputService } from "@rbxts/services";

const DEFAULT_INPUTS = [Enum.UserInputType.MouseButton1, Enum.UserInputType.Touch];

function contains(object: GuiObject, mouse: Vector3) {
	return (
		object.AbsolutePosition.X <= mouse.X &&
		object.AbsolutePosition.Y <= mouse.Y &&
		object.AbsolutePosition.X + object.AbsoluteSize.X >= mouse.X &&
		object.AbsolutePosition.Y + object.AbsoluteSize.Y >= mouse.Y
	);
}

/**
 * @see https://mantine.dev/hooks/use-click-outside/
 */
export function useClickOutside<T extends GuiObject>(
	handler: () => void,
	inputs: Enum.UserInputType[] = DEFAULT_INPUTS,
	instances?: GuiObject[],
): Roact.Ref<T> {
	const ref = useRef<T>();

	useEffect(() => {
		const listener = (input: InputObject) => {
			const instance = ref.getValue();

			if (typeIs(instances, "table")) {
				const shouldTrigger = instances.every((obj) => obj !== undefined && !contains(obj, input.Position));
				if (shouldTrigger) {
					handler();
				}
			} else if (instance !== undefined && !contains(instance, input.Position)) {
				handler();
			}
		};

		const handle = UserInputService.InputBegan.Connect((input) => {
			if (inputs.includes(input.UserInputType)) {
				listener(input);
			}
		});

		return () => {
			handle.Disconnect();
		};
	}, [ref, handler, instances]);

	return ref;
}
