import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { forwardRef } from "react";

interface CalendarInputProps {
	date: string | null;
	setDate: (date: string | null) => void;
	showDropdowns?: boolean;
	minYear?: number;
	maxYear?: number;
	placeholder?: string;
}

interface CustomInputProps {
	value?: string;
	onClick?: () => void;
	placeholder?: string;
}

const CustomInput = forwardRef<HTMLDivElement, CustomInputProps>(
	({ value, onClick, placeholder }, ref) => (
		<div
			ref={ref}
			onClick={onClick}
			className="flex items-center gap-2 w-full border border-gray-200 rounded-xl p-3 text-sm cursor-pointer focus-within:ring-1 focus-within:ring-green-500 bg-white"
		>
			<span className={`flex-1 ${value ? "text-gray-800" : "text-gray-400"}`}>
				{value || placeholder}
			</span>
			<FontAwesomeIcon icon={faCalendar} className="text-gray-400 text-base" />
		</div>
	),
);
CustomInput.displayName = "CustomInput";

const CalendarInput = ({
	date,
	setDate,
	showDropdowns = false,
	minYear = 1900,
	maxYear = new Date().getFullYear(),
	placeholder = "Select date",
}: CalendarInputProps) => {
	return (
		<DatePicker
			selected={date ? new Date(date) : null}
			onChange={(d: Date | null) =>
				setDate(d ? d.toISOString().split("T")[0] : null)
			}
			maxDate={new Date()}
			dateFormat="dd MMM yyyy"
			placeholderText={placeholder}
			customInput={<CustomInput />}
			wrapperClassName="w-full"
			popperProps={{
				strategy: "fixed",
			}}
			popperPlacement="bottom"
			/* ── Dropdown selectors for month & year ── */
			showMonthDropdown={showDropdowns}
			showYearDropdown={showDropdowns}
			dropdownMode={showDropdowns ? "select" : undefined}
			{...(showDropdowns && {
				minDate: new Date(minYear, 0, 1),
			})}
			scrollableYearDropdown={showDropdowns}
			yearDropdownItemNumber={showDropdowns ? maxYear - minYear : undefined}
		/>
	);
};

export default CalendarInput;
