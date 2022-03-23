export function arrayToMap<T, K, V>(
	array: T[],
	callback: (value: T, index: number, array: readonly T[]) => [K, V],
): Map<K, V> {
	const map = new Map<K, V>();
	array.forEach((value, index) => {
		const [k, v] = callback(value, index, array);
		map.set(k, v);
	});
	return map;
}
