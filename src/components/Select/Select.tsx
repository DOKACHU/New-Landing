import React from "react";
import { CustomSelect } from "./styles";

export default function Select(props: any) {
  return (
    <CustomSelect
      className="react-select-container"
      classNamePrefix="react-select"
      {...props}
    />
  );
}
