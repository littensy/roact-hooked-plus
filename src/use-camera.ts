import { useEffect, useState } from "@rbxts/roact-hooked";
import { Workspace } from "@rbxts/services";

/**
 * Returns a reference to the camera object. Rerenders if the CurrentCamera
 * value changes.
 * @returns A reference to the camera object.
 */
export function useCamera(): Camera {
	const [camera, setCamera] = useState(() => {
		return Workspace.CurrentCamera ?? new Instance("Camera");
	});

	useEffect(() => {
		const connection = Workspace.GetPropertyChangedSignal("CurrentCamera").Connect(() => {
			if (Workspace.CurrentCamera) {
				setCamera(Workspace.CurrentCamera);
			}
		});

		return () => {
			connection.Disconnect();
		};
	}, []);

	return camera;
}
