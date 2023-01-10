import { useBinding, useEffect, useMutable } from "@rbxts/roact-hooked";
import { UserInputService } from "@rbxts/services";

export function useMouse(onChange?: (location: Vector2) => void) {
	const [location, setLocation] = useBinding(UserInputService.GetMouseLocation());

	const onChangeRef = useMutable(onChange);
	onChangeRef.current = onChange;

	useEffect(() => {
		const handle = UserInputService.InputChanged.Connect((input) => {
			if (
				input.UserInputType === Enum.UserInputType.MouseMovement ||
				input.UserInputType === Enum.UserInputType.Touch
			) {
				const location = UserInputService.GetMouseLocation();

				setLocation(location);
				onChangeRef.current?.(location);
			}
		});

		return () => {
			handle.Disconnect();
		};
	}, []);

	return location;
}
