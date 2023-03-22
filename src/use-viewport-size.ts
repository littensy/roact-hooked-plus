import { useBinding, useEffect, useMutable } from "@rbxts/roact-hooked";
import { Workspace } from "@rbxts/services";
import { useCamera } from "./use-camera";

/**
 * Returns a binding to the current screen size.
 * @param onChange Fires when the viewport size changes
 */
export function useViewportSize(onChange?: (size: Vector2) => void) {
	const [size, setSize] = useBinding(Workspace.CurrentCamera?.ViewportSize ?? Vector2.one);
	const camera = useCamera();

	const onChangeRef = useMutable(onChange);
	onChangeRef.current = onChange;

	useEffect(() => {
		const connection = camera.GetPropertyChangedSignal("ViewportSize").Connect(() => {
			setSize(camera.ViewportSize);
			onChangeRef.current?.(camera.ViewportSize);
		});

		return () => {
			connection.Disconnect();
		};
	}, [camera]);

	return size;
}
