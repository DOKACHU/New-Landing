import styled from "styled-components";
import Select from "react-select";

export const CustomSelect = styled(Select)`
  .react-select__control {
    border: 1px solid #000;
    border-radius: 8px;
    padding: 3px;
    margin-top: 8px;
  }
  .react-select__indicator-separator {
    display: none;
  }
  .react-select__indicator {
    display: none;
  }
  .react-select__menu {
    z-index: 10 !important;
  }
`;
