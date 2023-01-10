import { useBinding, useEffect, useMutable } from "@rbxts/roact-hooked";
import { Workspace } from "@rbxts/services";

/**
 * Returns a binding to the current screen size.
 * @param onChange Fires when the viewport size changes
 */
export function useViewportSize(onChange?: (size: Vector2) => void) {
	const [size, setSize] = useBinding(Workspace.CurrentCamera?.ViewportSize ?? Vector2.one);

	const onChangeRef = useMutable(onChange);
	onChangeRef.current = onChange;

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
					onChangeRef.current?.(camera.ViewportSize);
				});

				setSize(camera.ViewportSize);
				onChangeRef.current?.(camera.ViewportSize);
			}
		};

		const cameraChanged = Workspace.GetPropertyChangedSignal("CurrentCamera").Connect(updateConnection);

		task.spawn(updateConnection);

		return () => {
			cameraChanged.Disconnect();
			viewportChanged?.Disconnect();
		};
	}, []);

	return size;
}
