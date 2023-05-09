/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";

const useTags = () => {
  const [tags, setTags] = useState<any>([]);

  const tagsRef = useRef<any>(null);

  const handleClick = () => {
    const { current } = tagsRef;

    if (current.value !== "") {
      setTags([...tags, current.value]);
      current.value = "";
    }
  };

  return { tags, tagsRef, handleClick };
};

export default useTags;
