/* eslint-disable react-hooks/rules-of-hooks */
import { Menu } from "@headlessui/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Transition } from "..";

const index = ({
  placeholder,
  className = "",
  fromDate = new Date().change("year", -80),
  toDate = new Date().change("year", 10),
  defaultValue,
  name = "date",
  onChange,
  format = "DD-MM-YYYY",
}: {
  placeholder: string;
  className?: string;
  fromDate?: Date;
  toDate?: Date;
  defaultValue?: Date;
  name?: string;
  onChange?: (date: Date) => void;
  format?: "DD-MM-YYYY" | "YYYY-MM-DD" | "D d M, Y";
}) => {
  const MONTH_NAMES = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const MONTH_SHORT_NAMES = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  const DAYS = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

  const YEARS = useMemo(() => {
    const yearsArr = [];
    for (let i = toDate.getFullYear(); i >= fromDate.getFullYear(); i--) {
      yearsArr.push(i);
    }
    return yearsArr;
  }, [fromDate, toDate]);

  // TO-DO: UPDATE DAYS DEPENDENCY WHEN FROMDATE CHANGE BY EXPEDITION
  /* useEffect(() => {
    if (datePickerValue !== formatDateForDisplay(initDate)) {
      const date = new Date(datePickerValue);
      if (date < fromDate) {
        getDateValue(fromDate.getDate());
      } else if (date > toDate) {
        getDateValue(toDate.getDate());
      }
      getNoOfDays();
    }
  }, [fromDate]); */

  const [datePickerFormat, _] = useState(format);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDateForDisplay = (date: Date) => {
    let formattedDay = DAYS[date.getDay()];
    let formattedDate = ("0" + date.getDate()).slice(-2); // appends 0 (zero) in single digit date
    let formattedMonth = MONTH_NAMES[date.getMonth()];
    let formattedMonthShortName = MONTH_SHORT_NAMES[date.getMonth()];
    let formattedMonthInNumber = ("0" + (date.getMonth() + 1)).slice(-2);
    let formattedYear = date.getFullYear();
    if (datePickerFormat === "DD-MM-YYYY") {
      return `${formattedDate}-${formattedMonthInNumber}-${formattedYear}`; // 02-04-2021
    }
    if (datePickerFormat === "YYYY-MM-DD") {
      return `${formattedYear}-${formattedMonthInNumber}-${formattedDate}`; // 2021-04-02
    }
    if (datePickerFormat === "D d M, Y") {
      return `${formattedDay} ${formattedDate} ${formattedMonthShortName} ${formattedYear}`; // Tue 02 Mar 2021
    }
    return `${formattedDay} ${formattedDate} ${formattedMonth} ${formattedYear}`;
  };

  const [blankDays, setBlankDays] = useState<number[]>([]);
  const [noOfDays, setNoOfDays] = useState<
    { day: number; disabled: boolean }[]
  >([]);

  const [calendarNavigation, setCalendarNavigation] = useState({
    prev: true,
    next: true,
  });

  const getNoOfDays = () => {
    const handleMinDate = new Date(year, month);
    const handleMaxDate = new Date(year, month + 1, 0);

    const navigation = { prev: true, next: true };
    if (handleMaxDate > toDate) {
      navigation.next = false;
    }
    if (handleMinDate < fromDate) {
      navigation.prev = false;
    }

    let daysInMonth = new Date(year, month + 1, 0).getDate();
    // find where to start calendar day of week
    let dayOfWeek = new Date(year, month).getDay();
    let blankdaysArray = [];
    for (var i = 1; i <= dayOfWeek; i++) {
      blankdaysArray.push(i);
    }
    let daysArray: { day: number; disabled: boolean }[] = [];
    for (var i = 1; i <= daysInMonth; i++) {
      daysArray.push({
        day: i,
        disabled:
          (!navigation.prev && i < fromDate.getDate()) ||
          (!navigation.next && i > toDate.getDate()),
      });
    }
    if (
      navigation.prev !== calendarNavigation.prev ||
      navigation.next !== calendarNavigation.next
    )
      setCalendarNavigation(navigation);
    setBlankDays(blankdaysArray);
    setNoOfDays(daysArray);
  };

  const [replacePlaceHolder, setReplacePlaceHolder] = useState<
    string | undefined
  >(undefined);

  const getDateValue = (date: number) => {
    let selectedDate = new Date(year, month, date);
    if (onChange) onChange(selectedDate);
    setDatePickerValue(formatDateForDisplay(selectedDate));
    setReplacePlaceHolder(formatDateForDisplay(selectedDate));
    //isSelectedDate(date);
    setShowDatePicker(false);
  };

  const isSelectedDate = (date: number) => {
    const d = new Date(year, month, date);
    return datePickerValue === formatDateForDisplay(d) ? true : false;
  };

  const isToday = (date: number) => {
    const today = new Date();
    const d = new Date(year, month, date);
    return today.toDateString() === d.toDateString() ? true : false;
  };

  const initDate = useMemo(() => {
    const date = new Date();
    if (toDate.getFullYear() < date.getFullYear())
      date.setFullYear(toDate.getFullYear());
    return date;
  }, [toDate]);

  const [datePickerValue, setDatePickerValue] = useState(
    formatDateForDisplay(defaultValue || initDate)
  );
  const [month, setMonth] = useState(
    defaultValue ? defaultValue.getMonth() : initDate.getMonth()
  );
  const [year, setYear] = useState(
    defaultValue ? defaultValue.getFullYear() : initDate.getFullYear()
  );

  const datePickerRef = useRef<HTMLDivElement | null>(null);
  const yearsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getNoOfDays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const [showYearsList, setShowYearsList] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (showYearsList && yearsRef.current && yearsRef.current.childNodes[1]) {
        const yearsListContainer = yearsRef.current
          .childNodes[1] as HTMLDivElement;
        const selectedYearInYearsListContainer =
          yearsListContainer.querySelector(
            "[aria-label='list-of-years_selected']"
          );
        if (selectedYearInYearsListContainer)
          setTimeout(
            () => selectedYearInYearsListContainer.scrollIntoView(),
            0
          );
      }
    }, 0);
  }, [showYearsList]);

  return (
    <div className={`${className} relative w-full`}>
      <input type="hidden" name={name} value={datePickerValue} />
      <input
        type="text"
        onClick={() => setShowDatePicker((_showDatePicker) => !_showDatePicker)}
        onKeyPress={(e) => {
          if (e.key === "Escape") setShowDatePicker(false);
        }}
        className="w-full py-1.5 text-sm text-gray-400 rounded-md pr-8 pl-3 border-2 border-gray focus:border-gray-600 focus:border-opacity-40 focus:outline-none bg-white focus:text-gray-600"
        placeholder={
          replacePlaceHolder ||
          (defaultValue && formatDateForDisplay(defaultValue)) ||
          placeholder
        }
        readOnly
      />

      <div className="absolute top-0 right-0 px-3 py-1.5">
        <svg
          className="h-6 w-6 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      {showDatePicker && (
        <div
          className="bg-white mt-12 rounded-lg shadow p-4 absolute top-0 left-0 w-full sm:w-68"
          ref={datePickerRef}
        >
          <div className="flex justify-between items-center mb-2">
            <div className="flex">
              <span className="text-lg font-bold text-gray-800">
                {MONTH_NAMES[month]}
              </span>
              {/* <span className="ml-1 text-lg text-gray-600 font-normal"></span> */}
              <Menu as="div" className="relative ml-1">
                <div ref={yearsRef}>
                  <div
                    onClickCapture={() =>
                      setShowYearsList((_showYearsList) => !_showYearsList)
                    }
                  >
                    <Menu.Button className="flex w-full">
                      <span className="ml-1 text-lg text-gray-600 hover:text-gray-400 cursor-pointer font-normal">
                        {year}
                      </span>
                    </Menu.Button>
                  </div>
                  <Transition isOpen={showYearsList}>
                    <Menu.Items
                      key="years_list"
                      static
                      className="origin-top-left absolute overflow-y-auto no-scrollbar left-0 mt-0.5 w-full max-h-40 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-400 divide-opacity-25"
                    >
                      {YEARS.map((_year) => (
                        <Menu.Item key={_year}>
                          <a
                            aria-label={
                              _year === year
                                ? `list-of-years_selected`
                                : undefined
                            }
                            className={`flex hover:bg-gray-200 ${
                              _year === year ? "bg-gray-200" : ""
                            } cursor-pointer text-sm text-gray-400 justify-center`}
                            onClick={() => {
                              const newDate = new Date(_year, month);
                              if (newDate > toDate) {
                                setMonth(toDate.getMonth());
                              }
                              if (newDate < fromDate) {
                                setMonth(fromDate.getMonth());
                              }
                              setYear(_year);
                              setShowYearsList(false);
                              //getNoOfDays();
                            }}
                          >
                            {_year}
                          </a>
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </div>
              </Menu>
            </div>
            <div>
              <button
                type="button"
                className={`focus:outline-none focus:shadow-outline transition ease-in-out duration-100 inline-flex ${
                  calendarNavigation.prev
                    ? "cursor-pointer hover:bg-gray-100"
                    : "cursor-default"
                } p-1 rounded-full`}
                disabled={!calendarNavigation.prev}
                onClick={() => {
                  if (showYearsList) setShowYearsList(false);
                  if (month === 0) {
                    setYear((_year) => --_year);
                  }
                  setMonth((_month) => {
                    if (!month) return 11;
                    return --_month;
                  });
                  //getNoOfDays();
                }}
              >
                <svg
                  className={`h-6 w-6 ${
                    calendarNavigation.prev ? "text-gray-400" : "text-gray-300"
                  } inline-flex`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>
            <button
              type="button"
              className={`focus:outline-none focus:shadow-outline transition ease-in-out duration-100 inline-flex ${
                calendarNavigation.next
                  ? "cursor-pointer hover:bg-gray-100"
                  : "cursor-default"
              } p-1 rounded-full`}
              disabled={!calendarNavigation.next}
              onClick={() => {
                if (showYearsList) setShowYearsList(false);
                if (month === 11) {
                  setMonth(0);
                  setYear((_year) => ++_year);
                } else {
                  setMonth((_month) => ++_month);
                }
                //getNoOfDays();
              }}
            >
              <svg
                className={`h-6 w-6 ${
                  calendarNavigation.next ? "text-gray-400" : "text-gray-300"
                } inline-flex`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-wrap mb-3 -mx-1">
            {DAYS.map((day, index) => (
              <div key={index} style={{ width: "14.26%" }} className="px-0.5">
                <div className="text-gray-800 font-medium text-center text-xs">
                  {day}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap -mx-1">
            {blankDays.map((blankDay) => (
              <div
                key={blankDay}
                style={{ width: "14.28%" }}
                className="text-center border p-1 border-transparent text-sm"
              ></div>
            ))}
            {noOfDays.map(({ day, disabled }, index) => (
              <div
                key={index}
                style={{ width: "14.28%" }}
                className="px-2 sm:px-1 mb-1"
              >
                <div
                  onClick={disabled ? undefined : () => getDateValue(day)}
                  className={`${
                    !disabled ? "cursor-pointer" : "cursor-default"
                  } text-center text-sm rounded-full leading-loose ${
                    !disabled ? "transition ease-in-out duration-100" : ""
                  }
                  ${
                    disabled
                      ? " text-gray-400 text-opacity-60"
                      : isToday(day) && !isSelectedDate(day)
                      ? " text-white bg-teal-300"
                      : isSelectedDate(day)
                      ? " bg-teal-500 text-white hover:bg-opacity-50"
                      : " text-gray-600 hover:text-white hover:bg-teal-300"
                  }`}
                >
                  {day}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default index;
