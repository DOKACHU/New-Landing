import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Grid, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { P } from "../styles";
import { useState } from "react";
import { phoneNumber, ErrorEmptyCheck } from "../utils";
import { schema } from "./constants";
import {
  Block,
  Label,
  Img,
  Input,
  ArrowImg,
  SelectBlock,
  TextArea,
  Footer,
  SubmitButton,
} from "./styles";
type FormData = yup.InferType<typeof schema>;

export default function BForm() {
  const [preview, setPreview] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [multipleImages, setMultipleImages] = useState<any>([]);
  const [rawImages, setRawImages] = useState<any>([]);

  const getLocalStorage =
    localStorage.getItem("temp") === undefined
      ? null
      : JSON.parse(localStorage.getItem("temp") || "{}");

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: getLocalStorage.name,
      // age: 33,
      // email: "test@naver.com",
    },
    resolver: yupResolver(schema),
  });
  // const { onChange: onPhoneChange, ...rest } = register("phone");
  const { onChange, ...params } = register("singlePhoto");
  const { onChange: onMultipleChange, ...multiParams } =
    register("multiplePhoto");

  const changeMultipleFiles = (e: any) => {
    if (e.target?.files) {
      const imageArray = Array.from(e.target.files).map((file: any) =>
        URL.createObjectURL(file)
      ) as any;

      setMultipleImages((prevImages: any) => prevImages.concat(imageArray));
      setRawImages((prevRaws: any) => prevRaws.concat(e.target?.files[0]));
    }
  };

  // submit
  const onSubmit = (data: FormData) => {
    const isSubmit = ErrorEmptyCheck(errors);
    if (isSubmit) {
      console.log({ selectedImage, multipleImages, rawImages });
      console.log(JSON.stringify(data, null, 2));
    }
  };

  const onReset = () => {
    reset();
    setSelectedImage(null);
    setPreview(null);
    setMultipleImages([]);
    setRawImages([]);
    localStorage.removeItem("temp");
    localStorage.removeItem("singleImg");
    localStorage.removeItem("singleImgPreview");
    localStorage.removeItem("multiImg");
    localStorage.removeItem("multiImgPreview");
  };

  const onSave = () => {
    const saveObj = {
      name: watch("name"),
      phone: watch("phone"),
    };
    localStorage.setItem("temp", JSON.stringify(saveObj));
    localStorage.setItem("singleImg", selectedImage);
    localStorage.setItem("singleImgPreview", preview);
    localStorage.setItem("multiImg", multipleImages);
    localStorage.setItem("multiImgPreview", rawImages);
  };

  return (
    <Block>
      <Typography
        style={{
          marginTop: "56px",
        }}
        variant="h4"
        fontWeight={600}
      >
        병원 / 치료사 정보를 등록해주세요.
      </Typography>

      <Typography variant="subtitle1" gutterBottom fontWeight={600}>
        도카츄는 병원 / 치료사들에게 편리한 환경을 제공하기 위해, 다음 정보를
        리뷰하여 병원 등록을 승인하고 있습니다
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <input {...register("name")} placeholder="이름" />
            <P>{errors.name?.message}</P>
          </Grid>

          <Grid item xs={6}>
            <Controller
              control={control}
              name="phone"
              render={({ field: { value, ...rest } }) => {
                const result = phoneNumber(value);
                return (
                  <input value={result} {...rest} placeholder="핸드폰 번호" />
                );
              }}
            />
            <P>{errors.phone?.message}</P>
          </Grid>

          {/* <Grid item xs={6}>
            <input {...register("age")} placeholder="나이" />
            <P>{errors.age?.message}</P>
          </Grid>

          <Grid item xs={6}>
            <input {...register("years")} placeholder="YYYY" />
            <P>{errors.years?.message}</P>
          </Grid>

          <Grid item xs={6}>
            <input {...register("month")} placeholder="MM" />
            <P>{errors.month?.message}</P>
          </Grid>

          <Grid item xs={6}>
            <input {...register("email")} placeholder="이메일" />
            <P>{errors.email?.message}</P>
          </Grid> */}

          {/* single */}
          <Grid item xs={6}>
            <p>싱글</p>
            <input
              {...params}
              type="file"
              accept="image/*"
              id="single"
              onChange={(event: any) => {
                const file = event?.target?.files[0];
                setSelectedImage(file);
                setPreview(URL.createObjectURL(file));
                onChange(event);
              }}
            />
            {preview && (
              <img
                style={{
                  background: "#000",
                  width: "140px",
                  height: "140px",
                  objectFit: "contain",
                }}
                className="image"
                src={preview}
                alt=""
              />
            )}

            <P>{errors.singlePhoto?.message}</P>
          </Grid>

          {/* multiple */}
          <Grid item xs={6}>
            <p>다중</p>
            <input
              {...multiParams}
              type="file"
              accept="image/*"
              id="multiple"
              onChange={(e: any) => {
                changeMultipleFiles(e);
                onMultipleChange(e);
              }}
            />
            {multipleImages?.map((image: any) => {
              return (
                <img
                  style={{
                    background: "#000",
                    width: "140px",
                    height: "140px",
                    objectFit: "contain",
                  }}
                  className="image"
                  src={image}
                  alt=""
                  key={image}
                />
              );
            })}
            <P>{errors.multiplePhoto?.message}</P>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Controller
                  control={control}
                  name="acceptTerms"
                  defaultValue={false}
                  render={({ field: { onChange } }) => (
                    <Checkbox
                      color="primary"
                      onChange={(e) => onChange(e.target.checked)}
                    />
                  )}
                />
              }
              label={
                <Typography color={errors.acceptTerms ? "error" : "inherit"}>
                  I have read and agree to the Terms *
                </Typography>
              }
            />
          </Grid>
        </Grid>
        <button type="submit">보내기</button>
        <button type="button" onClick={onSave}>
          임시 저장
        </button>
        <button type="button" onClick={onReset}>
          초기화
        </button>
      </form>
    </Block>
  );
}
