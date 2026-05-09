import { useQuery } from "@tanstack/react-query";
import { getTransactionByID } from "../api/transactions";

export const useTransaction = (id: string) => {
	// get transaction by id
	const {
		data: transaction,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["transactions", id],
		queryFn: () => getTransactionByID(id!),
		enabled: !!id,
	});

	return {
		transaction,
		isLoading,
		error,
	};
};