import styled, { css } from "styled-components";

export const Block = styled.div`
  min-height: calc(100vh- 56px);
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 80px;

  @media (max-width: 1200px) {
    padding: 8px 20px;
  }
`;

export const Label = styled.p`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
`;

export const Img = styled.img`
  width: 140px;
  height: 140px;
  object-fit: contain;
  background: lightgray;
  border-radius: 8px;
`;

export const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #000;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  width: 100%;

  &:hover {
    border: 1px solid #e4e4e4;
  }

  &:focus {
    background-color: #f4f4f4;
  }
`;

export const ArrowImg = styled.img`
  position: absolute;
  top: 45%;
  right: 15px;
  z-index: 10;
`;

export const SelectBlock = styled.div`
  position: relative;
`;

export const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 1px solid #000;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  resize: none;
  width: 100%;

  &:hover {
    border: 1px solid #e4e4e4;
  }

  &:focus {
    background-color: #f4f4f4;
  }
`;

export const Footer = styled.div`
  border: 1px solid #e5e5e5;
  position: fixed;
  left: 0px;
  bottom: 0px;
  right: 0px;
  padding: 10px 0;
  background-color: #fff;
  /* margin: 0 auto; */
  /* width: 100%; */
  margin: 0 auto;
  /* max-width: 1200px; */
  display: flex;
  justify-content: space-between;
`;

export const SubmitButton = styled.button<{ btnType?: string }>`
  padding: 17px 142px;
  color: #fff;
  background-color: #000;
  border: none;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;

  ${(props) =>
    props.btnType &&
    css`
      background-color: #fff;
      border: 1px solid #000;
      color: #000;
    `};

  &:hover {
    background-color: #e4e4e4;
  }

  &:disabled {
    background-color: lightgray;
  }

  @media (max-width: 767px) {
    padding: 7px 42px;
  }
`;

export const CustomDivdier = styled.div`
  border: 0.5px solid #000;
  margin-top: 8px;
`;

export const AddButton = styled.button`
  margin: 24px 0;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  background: transparent;
  border: none;
  cursor: pointer;
`;

export const AddItemSection = styled.div`
  border-top: 0.5px solid rgba(0, 0, 0, 0.15);
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.15);
  padding: 26px 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 64px;
`;

export const AddItemBlock = styled.div`
  border-top: 0.5px solid rgba(0, 0, 0, 0.15);
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.15);
`;

export const Row = styled.div<{ column?: boolean }>`
  display: flex;
  justify-content: flex-start;
  /* align-items: center; */
  ${(props) =>
    props?.column &&
    css`
      flex-direction: column;
    `}
`;

export const YearInput = styled.input`
  border: none;
  width: 40px;
  &:focus {
    outline: none;
  }
`;

export const MonthInput = styled.input`
  border: none;
  width: 30px;
  &:focus {
    outline: none;
  }
`;

export const ItemInput = styled.input`
  border: none;
  /* width: 30px; */

  /* width: 300px; */
  /* width: 30px; */
  &:focus {
    outline: none;
  }
`;

export const TagInput = styled.input`
  padding: 12px 16px;
  border: 1px solid #000;
  border-radius: 8px 0 0 8px;
  font-size: 16px;
  font-weight: 500;
  width: 90%;

  &:hover {
    border: 1px solid #e4e4e4;
  }

  &:focus {
    background-color: #f4f4f4;
  }
`;

export const TagButton = styled.button`
  padding: 13px 16px;
  width: 10%;
  border-radius: 0 8px 8px 0;
  border: 1px solid #000000;
  background: #fff;
  border-left: none;

  &:hover {
    border: 1px solid #e4e4e4;
  }
`;
