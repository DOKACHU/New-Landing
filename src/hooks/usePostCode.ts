/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from "react";

const usePostCode = () => {
  const [openPostcode, setOpenPostcode] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const [address, setAddress] = useState<string>("");
  const handle = {
    // 버튼 클릭 이벤트
    clickButton: () => {
      setOpenPostcode((current) => !current);
    },

    // 주소 선택 이벤트
    selectAddress: (data: any) => {
      console.log(`
                주소: ${data.address},
                우편번호: ${data.zonecode}
            `);
      setAddress(data.address);
      setOpenPostcode(false);
    },
  };
  return {
    inputRef,
    handle,
    openPostcode,
    setOpenPostcode,
    address,
  };
};

export default usePostCode;
