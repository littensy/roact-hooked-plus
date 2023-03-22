import { useBinding, useEffect } from "@rbxts/roact-hooked";
import { RunService } from "@rbxts/services";

/**
 * Returns a Binding that updates every frame. The value will start from zero
 * and increase by the amount of time that has passed since the last frame.
 * @returns A Binding that updates every frame.
 */
export function useTime() {
	const [time, setTime] = useBinding(0);

	useEffect(() => {
		let currentTime = 0;

		const connection = RunService.Heartbeat.Connect((deltaTime) => {
			currentTime += deltaTime;
			setTime(currentTime);
		});

		return () => connection.Disconnect();
	}, []);

	return time;
}
