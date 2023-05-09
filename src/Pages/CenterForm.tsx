import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Grid, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { P } from "../styles";
import { useState } from "react";
import { phoneNumber, ErrorEmptyCheck } from "../utils";
import {
  Block,
  Label,
  Img,
  Input,
  ArrowImg,
  SelectBlock,
  TextArea,
} from "./styles";
import { Select } from "../components";
import { schema } from "./constants";
import arrow from "./arrow.png";

type FormData = yup.InferType<typeof schema>;

export default function CenterForm() {
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

  const { onChange, ...params } = register("singlePhoto");
  const { onChange: onMultipleChange, ...multiParams } =
    register("multiplePhoto");

  const changeMultipleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const imageLists = e.target.files;
      let imageUrlLists = [...multipleImages];

      if (imageLists) {
        for (let i = 0; i < imageLists.length; i++) {
          const currentImageUrl = URL.createObjectURL(imageLists[i]) as any;
          imageUrlLists.push(currentImageUrl as never);
          setRawImages([...rawImages, imageLists[i]]);
        }

        if (imageUrlLists.length > 5) {
          imageUrlLists = imageUrlLists.slice(0, 5);
        }
        setMultipleImages(imageUrlLists);
        // fileMuitleInput.current.value = "";
      }
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
      <Typography variant="h4" fontWeight={600}>
        병원 / 치료사 정보를 등록해주세요.
      </Typography>

      <Typography variant="subtitle1" gutterBottom fontWeight={600}>
        도카츄는 병원 / 치료사들에게 편리한 환경을 제공하기 위해, 다음 정보를
        리뷰하여 병원 등록을 승인하고 있습니다
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Grid item xs={2}>
              <Label>커버 이미지 *</Label>
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
            </Grid>
            <Grid item xs={10}>
              {multipleImages?.map((image: any) => {
                return <Img className="image" src={image} alt="" key={image} />;
              })}
              <P>{errors.multiplePhoto?.message}</P>
            </Grid>
          </Grid>

          {/*  */}
          <Grid item xs={6}>
            <Label>병원 이름 *</Label>
            <Input {...register("name")} placeholder="이름" />
            <P>{errors.name?.message}</P>
          </Grid>

          <Grid item xs={6}>
            <Label>지역*</Label>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <SelectBlock>
                  <Select
                    {...field}
                    defaultValue={{ value: "00", label: "서울" }}
                    options={[
                      { value: "00", label: "서울" },
                      { value: "01", label: "인천" },
                      { value: "02", label: "대구" },
                      { value: "03", label: "부산" },
                      { value: "04", label: "광주" },
                    ]}
                  />
                  <ArrowImg src={arrow} alt="" />
                </SelectBlock>
              )}
            />
          </Grid>

          {/*  */}
          <Grid item xs={6}>
            <Label>사업자 등록번호 *</Label>
            <Input {...register("bizzNum")} placeholder="'-' 제외하고 10자리" />
            <P>{errors.bizzNum?.message}</P>
          </Grid>

          {/*  */}
          <Grid item xs={6}>
            <Label>진료항목*</Label>
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <SelectBlock>
                  <Select
                    {...field}
                    defaultValue={{ value: "00", label: "도수 치료" }}
                    options={[
                      { value: "00", label: "도수 치료" },
                      { value: "01", label: "카이로 프택틱" },
                      { value: "02", label: "추나요법" },
                    ]}
                  />
                  <ArrowImg src={arrow} alt="" />
                </SelectBlock>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Label>병원 소개(3000자 제한)</Label>
            <Controller
              control={control}
              name="desc"
              render={({ field }) => {
                return (
                  <TextArea
                    {...field}
                    rows={8}
                    placeholder="병원 소개를 적어주세요."
                  />
                );
              }}
            />
            <P>{errors.desc?.message}</P>
          </Grid>

          {/* <Grid item xs={6}>
            <input {...register("years")} placeholder="YYYY" />
            <P>{errors.years?.message}</P>
          </Grid>

          <Grid item xs={6}>
            <input {...register("month")} placeholder="MM" />
            <P>{errors.month?.message}</P>
          </Grid> */}
          <Grid item xs={6}>
            <Label>담당자 연락처 *</Label>
            <Controller
              control={control}
              name="phone"
              render={({ field: { value, ...rest } }) => {
                const result = phoneNumber(value);
                return (
                  <Input value={result} {...rest} placeholder="핸드폰 번호" />
                );
              }}
            />
            <P>{errors.phone?.message}</P>
          </Grid>

          <Grid item xs={6}>
            <Label>정보 수신 이메일 *</Label>
            <Input {...register("email")} placeholder="ex) user@gmail.com" />
            <P>{errors.email?.message}</P>
          </Grid>

          <Grid item xs={6}>
            <Label>치료사 수 *</Label>
            <Input {...register("proNumber")} placeholder="치료사 수" />
            <P>{errors.proNumber?.message}</P>
          </Grid>
          {/* single */}
          <Grid item xs={6}>
            <p>사업자 이미지 등록*</p>
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
            <Grid item xs={6}>
              {preview && <Img className="image" src={preview} alt="" />}
            </Grid>

            <P>{errors.singlePhoto?.message}</P>
          </Grid>

          {/* multiple */}

          <Grid item xs={12}>
            <Label>이용약관</Label>
            <TextArea
              {...register("desc")}
              rows={8}
              placeholder="병원 소개를 적어주세요."
            />
            <P>{errors.desc?.message}</P>
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
                  이용약관 및 도카추 회원 가입에 동의합니다.
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
    </Block>
  );
}
