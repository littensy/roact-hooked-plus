import { useCallback, useEffect, useMutable, useState } from "@rbxts/roact-hooked";
import { UserInputService } from "@rbxts/services";

import { clearTimeout, setTimeout, Timeout } from "./utils/set-timeout";

const DEFAULT_INPUTS = [
	Enum.UserInputType.Keyboard,
	Enum.UserInputType.Touch,
	Enum.UserInputType.Gamepad1,
	Enum.UserInputType.MouseButton1,
	Enum.UserInputType.MouseButton2,
	Enum.UserInputType.MouseButton3,
];
const DEFAULT_OPTIONS = {
	inputs: DEFAULT_INPUTS,
	useWindowFocus: true,
	initialState: true,
};

export function useIdle(timeout: number, options?: Partial<{ inputs: Enum.UserInputType[]; initialState: boolean }>) {
	const { inputs, useWindowFocus, initialState } = { ...DEFAULT_OPTIONS, ...options };
	const [idle, setIdle] = useState<boolean>(initialState);
	const timer = useMutable<Timeout>();

	const handleInput = useCallback(() => {
		setIdle(false);

		if (timer.current) {
			clearTimeout(timer.current);
		}

		timer.current = setTimeout(() => {
			setIdle(true);
		}, timeout);
	}, [timeout]);

	useEffect(() => {
		const events = UserInputService.InputBegan.Connect((input) => {
			if (inputs.includes(input.UserInputType as never)) {
				handleInput();
			}
		});

		return () => {
			events.Disconnect();
		};
	}, [handleInput]);

	useEffect(() => {
		if (!useWindowFocus) {
			return;
		}

		const windowFocused = UserInputService.WindowFocused.Connect(handleInput);
		const windowFocusReleased = UserInputService.WindowFocusReleased.Connect(() => {
			if (timer.current) {
				clearTimeout(timer.current);
				timer.current = undefined;
			}
			setIdle(true);
		});

		return () => {
			windowFocused.Disconnect();
			windowFocusReleased.Disconnect();
		};
	}, [useWindowFocus, handleInput]);

	return idle;
}
