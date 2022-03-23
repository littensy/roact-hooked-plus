import { useEffect, useMutable } from "@rbxts/roact-hooked";

export function useDidMount(): boolean {
	const ref = useMutable(true);

	useEffect(() => {
		ref.current = false;
	}, []);

	return ref.current;
}
