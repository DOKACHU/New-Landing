/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const postProAPI = async (Body: any) => {
  const URL = `https://api-dev.mnz-ai.com/entry/pro`;
  return await axios.post(URL, Body, {
    headers: {
      "Content-Type": `multipart/form-data`,
    },
  });
};

export default function useCreatePro() {
  return useMutation({
    mutationFn: (body: any) => postProAPI(body),
    // onSuccess: async () => {
    //   console.log("I'm first!");
    // },
    // onSettled: async () => {
    //   console.log("I'm second!");
    // },
  });
}
