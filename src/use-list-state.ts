import { useState } from "@rbxts/roact-hooked";

type SetStateAction<S> = S | ((prevState: S) => S);
type Dispatch<A> = (value: A) => void;

export interface UseListStateHandler<T> {
	setState: Dispatch<SetStateAction<T[]>>;
	append: (...items: T[]) => void;
	prepend: (...items: T[]) => void;
	insert: (index: number, ...items: T[]) => void;
	pop: () => void;
	shift: () => void;
	apply: (fn: (item: T, index?: number) => T) => void;
	applyWhere: (condition: (item: T, index: number) => boolean, fn: (item: T, index?: number) => T) => void;
	remove: (...indices: number[]) => void;
	reorder: ({ from, to }: { from: number; to: number }) => void;
	setItem: (index: number, item: T) => void;
	setItemProp: <K extends keyof T, U extends T[K]>(index: number, prop: K, value: U) => void;
}

export type UseListState<T> = [T[], UseListStateHandler<T>];

export function slice<T>(array: T[], start = 0, finish = math.huge): T[] {
	return array.filter((_, index) => index >= start && index < finish);
}

/**
 * @see https://mantine.dev/hooks/use-list-state/
 */
export function useListState<T>(initialValue: T[] = []): UseListState<T> {
	const [state, setState] = useState(initialValue);

	const append = (...items: T[]) => setState((current) => [...current, ...items]);
	const prepend = (...items: T[]) => setState((current) => [...items, ...current]);

	const insert = (index: number, ...items: T[]) =>
		setState((current) => [...slice(current, 0, index), ...items, ...slice(current, index)]);

	const apply = (fn: (item: T, index?: number) => T) =>
		setState((current) => current.map((item, index) => fn(item, index)));

	const remove = (...indices: number[]) =>
		setState((current) => current.filter((_, index) => !indices.includes(index)));

	const pop = () =>
		setState((current) => {
			const cloned = [...current];
			cloned.pop();
			return cloned;
		});

	const shift = () =>
		setState((current) => {
			const cloned = [...current];
			cloned.shift();
			return cloned;
		});

	const reorder = ({ from, to }: { from: number; to: number }) =>
		setState((current) => {
			const cloned = [...current];
			const item = cloned.remove(from);

			if (item !== undefined) {
				cloned.insert(to, item);
			}

			return cloned;
		});

	const setItem = (index: number, item: T) =>
		setState((current) => {
			const cloned = [...current];
			cloned[index] = item;
			return cloned;
		});

	const setItemProp = <K extends keyof T, U extends T[K]>(index: number, prop: K, value: U) =>
		setState((current) => {
			const cloned = [...current];
			cloned[index] = { ...cloned[index], [prop]: value };
			return cloned;
		});

	const applyWhere = (condition: (item: T, index: number) => boolean, fn: (item: T, index?: number) => T) =>
		setState((current) => current.map((item, index) => (condition(item, index) ? fn(item, index) : item)));

	return [
		state,
		{
			setState,
			append,
			prepend,
			insert,
			pop,
			shift,
			apply,
			applyWhere,
			remove,
			reorder,
			setItem,
			setItemProp,
		},
	];
}
