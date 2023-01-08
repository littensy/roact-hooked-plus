import Roact from "@rbxts/roact";
import { withHookDetection, withHooks } from "@rbxts/roact-hooked";

export function createStory(...args: Parameters<typeof withHooks>) {
	return (frame: Frame) => {
		withHookDetection(Roact);

		const handle = Roact.mount(Roact.createElement(withHooks(...args)), frame);

		return () => {
			Roact.unmount(handle);
		};
	};
}
