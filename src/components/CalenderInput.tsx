import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CalenderInputProps {
	date: string | null;
	setDate: (date: string | null) => void;
}

const CalenderInput = ({ date, setDate }: CalenderInputProps) => {
	return (
		<DatePicker
			selected={date ? new Date(date) : null}
			onChange={(d: Date | null) =>
				setDate(d ? d.toISOString().split("T")[0] : "")
			}
			maxDate={new Date()}
			dateFormat="dd MMM yyyy"
			placeholderText="Select date"
			className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
			wrapperClassName="w-full"
			popperProps={{
				strategy: "fixed",
			}}
			popperPlacement="bottom"
		/>
	);
};

export default CalenderInput;
