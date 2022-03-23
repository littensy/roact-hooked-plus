import Roact from "@rbxts/roact";
import { useEffect } from "@rbxts/roact-hooked";
import { UserInputService } from "@rbxts/services";

type Hotkey = [hotkey: (Enum.KeyCode | Roact.InferEnumNames<Enum.KeyCode>)[], event: () => void];

function isHotkeyPressed(hotkey: Hotkey[0]) {
	const keysDown = UserInputService.GetKeysPressed().map((key) => key.KeyCode);
	return hotkey.every((key) => {
		if (typeIs(key, "string")) {
			return keysDown.includes(Enum.KeyCode[key]);
		} else {
			return keysDown.includes(key);
		}
	});
}

export function useHotkeys(hotkeys: Hotkey[]) {
	useEffect(() => {
		const handle = UserInputService.InputBegan.Connect((input, gameProcessed) => {
			if (!gameProcessed && input.UserInputType === Enum.UserInputType.Keyboard) {
				hotkeys.forEach(([hotkey, event]) => {
					if (hotkey.includes(input.KeyCode.Name) && isHotkeyPressed(hotkey)) {
						event();
					}
				});
			}
		});

		return () => {
			handle.Disconnect();
		};
	}, [hotkeys]);
}
