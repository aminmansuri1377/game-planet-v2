import React, { FC } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/layouts/mobile.css";
import CustomButton from "./CustomButton";
import { Calendar } from "react-multi-date-picker";

interface IProps {
  textBtn: string;
  range?: boolean;
  onChange: (value: any) => void;
  value: any;
  dateSeparator?: string;
}

const CustomDatePicker: FC<IProps> = ({ textBtn, value, ...props }) => {
  console.log("value", value);
  return (
    <div>
      <h1 className=" font-PeydaBold text-xl text-center">{textBtn}</h1>
      <Calendar
        value={value}
        className=" scale-150 text-center mx-auto my-20 font-PeydaBold"
        calendar={persian}
        locale={persian_fa}
        style={{
          backgroundColor: "transparent",
        }}
        mapDays={({
          date,
          today,
          selectedDate,
          currentMonth,
          isSameDate,
        }: any) => {
          if (date.day < today.day) {
            return {
              disabled: true,
            };
          }
          let props = {};

          props.style = {
            borderRadius: "3px",
            backgroundColor:
              date.month.index === currentMonth.index ? "#ccc" : "",
          };

          if (isSameDate(date, today)) props.style.color = "green";
          if (isSameDate(date, selectedDate))
            props.style = {
              ...props.style,
              color: "#0074d9",
              backgroundColor: "#a5a5a5",
              fontWeight: "bold",
              border: "1px solid #777",
            };

          return props;
        }}
        {...props}
      ></Calendar>
      {/* <DatePicker
        className="rmdp-mobile calendar-dark"
        calendar={persian}
        locale={persian_fa}
        mapDays={({ date, today }: any) => {
          if (date.day < today.day) {
            return {
              disabled: true,
            };
          }
        }}
        render={(value, openCalendar) => {
          return (
            <CustomButton
              type="primary-btn"
              onClick={openCalendar}
              title={value ? value : textBtn}
            />
          );
        }}
        {...props}
      /> */}
    </div>
  );
};

export default CustomDatePicker;
