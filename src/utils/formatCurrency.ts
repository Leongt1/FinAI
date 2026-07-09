// Single place for money display. Amounts arrive from the API as decimal
// rupees; format only at the display edge (multi-currency is planned, so
// the symbol lives here and nowhere deeper).
export const formatCurrency = (
	amount: number,
	options?: { sign?: boolean; decimals?: number },
): string => {
	const { sign = false, decimals = 2 } = options ?? {};
	const formatted =
		"₹" +
		Math.abs(amount).toLocaleString("en-IN", {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
		});
	if (!sign) return formatted;
	return (amount < 0 ? "-" : "+") + formatted;
};
