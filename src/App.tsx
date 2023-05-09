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
import { P } from "./styles";
import { Fragment, useState } from "react";
import { phoneNumber } from "./utils";
const schema = yup
  .object({
    phone: yup
      .string()
      .matches(
        /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
        "핸드폰 번호는 010-0000-0000 형태로 입력해주세요."
      )
      .required("핸드폰 번호는 필수 항목 입니다."),

    name: yup
      .string()
      .matches(
        /^[가-힣]{2,10}|[a-zA-Z]{2,10}\s[a-zA-Z]{2,10}$/,
        "정확한 한글 또는 영어로 이름을 입력해주세요."
      )
      .min(2, "이름은 2글자 이상 써주세요.")
      .max(9, "이름은 10자 이내로 써주세요.")
      .required("이름을 필수 항목 입니다."),

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

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [multipleImages, setMultipleImages] = useState<any>([]);
  const [rawImages, setRawImages] = useState<any>([]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    // defaultValues: {
    //   name: "김민수",
    //   age: 33,
    //   email: "test@naver.com",
    // },
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
    console.log({ selectedImage, multipleImages, rawImages });
    console.log(JSON.stringify(data, null, 2));
  };

  return (
    <Fragment>
      <Paper elevation={1}>
        <Box px={3} py={2}>
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
                    console.log({ value });
                    const result = phoneNumber(value);
                    return (
                      <input
                        value={result}
                        {...rest}
                        placeholder="핸드폰 번호"
                      />
                    );
                  }}
                />

                {/* <input {...register("phone")} placeholder="핸드폰 번호" /> */}
                <P>{errors.phone?.message}</P>
              </Grid>

              <Grid item xs={6}>
                <input {...register("age")} placeholder="나이" />
                <P>{errors.age?.message}</P>
              </Grid>

              <Grid item xs={6}>
                <input {...register("email")} placeholder="이메일" />
                <P>{errors.email?.message}</P>
              </Grid>

              {/* single */}
              <Grid item xs={6}>
                <input
                  {...params}
                  type="file"
                  accept="image/*"
                  id="single"
                  onChange={(event: any) => {
                    setSelectedImage(event?.target?.files[0]);
                    onChange(event);
                  }}
                />
                <P>{errors.singlePhoto?.message}</P>
              </Grid>

              {/* multiple */}
              <Grid item xs={6}>
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
                    <Typography
                      color={errors.acceptTerms ? "error" : "inherit"}
                    >
                      I have read and agree to the Terms *
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
            <button type="submit">보내기</button>
            <button type="button">임시 저장</button>
          </form>
        </Box>
      </Paper>
    </Fragment>
  );
}
