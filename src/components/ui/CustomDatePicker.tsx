import React, { FC } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/layouts/mobile.css";
import CustomButton from "./CustomButton";

interface IProps {
  textBtn: string;
  range?: boolean;
  onChange: (value: any) => void;
  value: any;
  dateSeparator?: string;
}

const CustomDatePicker: FC<IProps> = ({ textBtn, value, ...props }) => {
  return (
    <DatePicker
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
    />
  );
};

export default CustomDatePicker;
