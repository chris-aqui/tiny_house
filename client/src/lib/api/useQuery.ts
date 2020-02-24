import { useState, useEffect, useCallback } from 'react';
import { server } from './server';

interface State<TData> {
	data: TData | null;
	loading: boolean;
	error: boolean;
}

export const useQuery = <TData = any>(query: string) => {
	const [state, setState] = useState<State<TData>>({
		data: null,
		loading: false,
		error: false
	});

	const fetch = useCallback(() => {
		const fetchApi = async () => {
			try {
				setState({ data: null, loading: true, error: false });

				const { data, errors } = await server.fetch<TData>({
					query
				});

				if (errors && errors.length) {
					throw new Error(errors[0].message);
				}

				setState({ data, loading: false, error: false });
			} catch (err) {
				setState({ data: null, loading: false, error: true });
				throw console.error(err);
			}
		};

		fetchApi();
	}, [query]);

	useEffect(() => {
		fetch();
	}, [fetch]);
	/*
	The Effect Hook lets you perform side effects in function components:
	If you’re familiar with React class lifecycle methods, you can think of useEffect Hook as componentDidMount, componentDidUpdate, and componentWillUnmount combined
	*/

	return { ...state, refetch: fetch };
};
