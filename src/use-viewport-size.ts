import { useBinding, useEffect } from "@rbxts/roact-hooked";
import { Workspace } from "@rbxts/services";

/**
 * Returns a binding to the current screen size.
 * @param onChange Fires when the viewport size changes
 */
export function useViewportSize(onChange?: (size: Vector2) => void) {
	const [size, setSize] = useBinding(Vector2.zero);

	useEffect(() => {
		let viewportChanged: RBXScriptConnection | undefined;

		const updateConnection = () => {
			const camera = Workspace.CurrentCamera;

			if (viewportChanged) {
				viewportChanged.Disconnect();
				viewportChanged = undefined;
			}

			if (camera) {
				viewportChanged = camera.GetPropertyChangedSignal("ViewportSize").Connect(() => {
					setSize(camera.ViewportSize);
					onChange?.(camera.ViewportSize);
				});
			}
		};

		const cameraChanged = Workspace.GetPropertyChangedSignal("CurrentCamera").Connect(updateConnection);

		updateConnection();

		return () => {
			cameraChanged.Disconnect();
			viewportChanged?.Disconnect();
		};
	}, []);

	return size;
}
