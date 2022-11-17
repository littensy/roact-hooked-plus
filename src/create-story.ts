import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";

export function createStory(...args: Parameters<typeof withHooks>) {
	return (frame: Frame) => {
		const handle = Roact.mount(Roact.createElement(withHooks(...args)), frame);

		return () => {
			Roact.unmount(handle);
		};
	};
}
