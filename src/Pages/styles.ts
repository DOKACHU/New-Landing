import styled from "styled-components";
import { Grid } from "@mui/material";

export const Block = styled.div`
  min-height: calc(100vh- 56px);
  max-width: 1200px;
  margin: 0 auto;
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

export const SubmitButton = styled.button`
  padding: 17px 142px;
  color: #fff;
  background-color: #000;
  border: none;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;

  &:hover {
    background-color: #e4e4e4;
  }

  &:disabled {
    background-color: lightgray;
  }
`;
