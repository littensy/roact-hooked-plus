import { useBinding, useEffect } from "@rbxts/roact-hooked";
import { UserInputService } from "@rbxts/services";

export function useMouse(onChange?: (location: Vector2) => void) {
	const [location, setLocation] = useBinding(UserInputService.GetMouseLocation());

	useEffect(() => {
		const handle = UserInputService.InputChanged.Connect((input) => {
			if (
				input.UserInputType === Enum.UserInputType.MouseMovement ||
				input.UserInputType === Enum.UserInputType.Touch
			) {
				const location = UserInputService.GetMouseLocation();

				setLocation(location);
				onChange?.(location);
			}
		});

		return () => {
			handle.Disconnect();
		};
	}, []);

	return location;
}
