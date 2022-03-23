export class Timeout {
	public running = true;

	constructor(callback: Callback, milliseconds: number, ...args: unknown[]) {
		task.delay(milliseconds / 1000, () => {
			if (this.running) {
				callback(...args);
			}
		});
	}

	public clear() {
		this.running = false;
	}
}

export function setTimeout(callback: Callback, milliseconds: number, ...args: unknown[]) {
	return new Timeout(callback, milliseconds, ...args);
}

export function clearTimeout(timeout: Timeout) {
	timeout.clear();
}
