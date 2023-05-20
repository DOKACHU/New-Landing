import React, { useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import styled from "styled-components";

const Box = styled.div`
  position: fixed;
  inset: 0;
  background-color: #000;
  opacity: 0.5;

  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

export default function Spinner() {
  useEffect(() => {}, []);

  return (
    <Box>
      <CircularProgress />
    </Box>
  );
}
