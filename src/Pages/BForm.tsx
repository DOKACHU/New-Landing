import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Paper,
  Box,
  Grid,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@material-ui/core";
import { P } from "../styles";
import { Fragment, useState } from "react";
import { phoneNumber, ErrorEmptyCheck } from "../utils";

//
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const nameRegExp = /^[가-힣]{2,10}|[a-zA-Z]{2,10}\s[a-zA-Z]{2,10}$/;

const schema = yup
  .object({
    phone: yup
      .string()
      .matches(phoneRegExp, "핸드폰 번호는 010-0000-0000 형태로 입력해주세요.")
      .required("핸드폰 번호는 필수 항목 입니다."),

    name: yup
      .string()
      .matches(nameRegExp, "정확한 한글 또는 영어로 이름을 입력해주세요.")
      .min(2, "이름은 2글자 이상 써주세요.")
      .max(9, "이름은 10자 이내로 써주세요.")
      .required("이름을 필수 항목 입니다."),

    years: yup
      .string()
      .min(1, "연도는 1자리 이상 써주세요.")
      .max(4, "연도는 4자리 이하로 써주세요.")
      .required("연도는 필수 항목 입니다."),

    month: yup
      .string()
      .min(1, "월 입력은 1자리 이상 써주세요.")
      .max(2, "월 입력은 2자리 이하로 써주세요.")
      .required("월 입력은 필수 항목 입니다."),

    age: yup
      .number()
      .min(1, "나이는 1이상 써주세요.")
      .max(99, "나이는 99이하로 써주세요.")
      .positive("양수만 허용됩니다.")
      .typeError("나이는 숫자만 가능합니다.")
      .required("나이는 필수 항목 입니다."), // number 에러 시, typeError 로 작성

    email: yup
      .string()
      .required("이메일은 필수 항목 입니다.")
      .email("이메일 형식이 아닙니다."),
    acceptTerms: yup.bool().oneOf([true], "Accept Terms is required"),
  })
  .shape({
    multiplePhoto: yup
      .mixed()
      .test(
        "required",
        "다중 이미지는 필수 항목입니다.",
        (value: any) => value.length > 0
      ),
    singlePhoto: yup
      .mixed()
      .test(
        "required",
        "이미지는 필수 항목입니다.",
        (value: any) => value.length > 0
      )
      .test("fileSize", "File Size is too large", (value: any) => {
        return value?.length && value[0].size <= 5242880;
      })
      .test("fileType", "Unsupported File Format", (value: any) => {
        return (
          value?.length &&
          ["image/jpeg", "image/png", "image/jpg"].includes(value[0].type)
        );
      }),
  })
  .required();

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
    <Fragment>
      <h1>b</h1>
      {/* <Paper elevation={1}>
        <Box sx={{ p: 2, border: "1px dashed grey" }}> */}
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

          <Grid item xs={6}>
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
          </Grid>

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
      {/* </Box>
      </Paper> */}
    </Fragment>
  );
}
