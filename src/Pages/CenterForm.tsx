import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Grid,
  Checkbox,
  FormControlLabel,
  Typography,
  Modal,
  Box,
  FormGroup,
  Chip,
} from "@mui/material";
import { P } from "../styles";
import { useRef, useState } from "react";
import { phoneNumber } from "../utils";
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
  TagInput,
  TagButton,
} from "./styles";
import { Select } from "../components";
import { schema } from "./constants";
import arrow from "./arrow.png";
import DaumPostcode from "react-daum-postcode";
import { useCreateCenter } from "../hooks";
import { allowOnlyNumber } from "../utils";

type FormData = yup.InferType<typeof schema>;
const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function CenterForm({ handle }: any) {
  const addressRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [preview, setPreview] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [multipleImages, setMultipleImages] = useState<any>([]);
  const [rawImages, setRawImages] = useState<any>([]);
  const { mutate: createCenter } = useCreateCenter();

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
    resetField,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: getLocalStorage.name,
      subject: { value: "00", label: "도수 치료" },
      location: { value: "00", label: "서울" },
      objList: [],
    },
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "objList",
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

  const handlee = {
    clickAdd: () => {
      append({
        name: watch("tag"),
      });
      resetField("tag");
    },

    clickDelete: (index: number) => {
      remove(index);
    },

    clickCheck: () => {
      alert("Success");
    },
  };

  console.log({ errors });

  // submit
  const onSubmit = (data: FormData) => {
    // const isSubmit = ErrorEmptyCheck(errors);
    // if (isSubmit) {
    const {
      name,
      proNumber,
      location,
      bizzNum,
      address1,
      address2,
      subject,
      phone,
      email,
      desc,
    } = data as any;
    console.log({ data });
    const formData = new FormData(); // 새로운 폼 객체 생성
    for (let i = 0; i < rawImages.length; i++) {
      formData.append("centerImages", rawImages[i]);
    }

    formData.append("registration", selectedImage); // <input name="item" value="hi"> 와 같다.
    formData.append("centerName", name);
    formData.append("city", location?.label);

    formData.append("address1", address1);
    formData.append("address2", address2);
    formData.append("businessRegistrationNumber", String(bizzNum));
    formData.append("memberCount", String(proNumber));

    formData.append("therapyCategory", subject?.label);
    formData.append("phoneNumber", phone);

    formData.append("email", email);
    formData.append("description", desc);
    // for (let i = 0; i < tags.length; i++) {
    //   formData.append(`tags[${i}]`, tags[i]);
    // }

    createCenter(formData, {
      onError: (e) => {
        console.log({ e });
      },
      onSuccess: (res) => {
        console.log({ res });
        onReset();
        alert("센터 입점 양식 등록 완료 ");
      },
    });

    // console.log({ selectedImage, multipleImages, rawImages });
    // console.log(JSON.stringify(data, null, 2));
    // }
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

  // const onSave = () => {
  //   const saveObj = {
  //     name: watch("name"),
  //     phone: watch("phone"),
  //   };
  //   localStorage.setItem("temp", JSON.stringify(saveObj));
  //   localStorage.setItem("singleImg", selectedImage);
  //   localStorage.setItem("singleImgPreview", preview);
  //   localStorage.setItem("multiImg", multipleImages);
  //   localStorage.setItem("multiImgPreview", rawImages);
  // };

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
                    // defaultValue={{ value: "00", label: "서울" }}
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

          <Grid item xs={6}>
            <Controller
              name="address1"
              control={control}
              render={({ field }) => (
                <Grid item xs={12}>
                  <Label>대표주소*</Label>
                  <Input
                    {...field}
                    placeholder="대표 주소 입력"
                    ref={addressRef}
                    onClick={() => {
                      setOpen(true);
                    }}
                  />
                  <P>{errors.address1?.message}</P>
                </Grid>
              )}
            />
            <Modal open={open} onClose={() => setOpen(false)}>
              <Box sx={style}>
                <DaumPostcode
                  onComplete={(data) => {
                    if (addressRef.current) {
                      addressRef.current.value = data.address;
                      setValue("address1", data.address, {
                        shouldValidate: true,
                      });
                    }
                    setOpen(false);
                  }}
                  autoClose={true}
                  defaultQuery="" //  판교역로 235
                />
              </Box>
            </Modal>
          </Grid>

          <Grid item xs={6}>
            <Controller
              name="address2"
              control={control}
              render={({ field }) => (
                <Grid item xs={12}>
                  <Label>상세 주소*</Label>
                  <Input
                    {...field}
                    // {...register("address2")}
                    placeholder="상세 주소 입력"
                  />
                  <P>{errors.address2?.message}</P>
                </Grid>
              )}
            />
          </Grid>

          {/*  */}
          <Grid item xs={6}>
            <Label>사업자 등록번호 *</Label>
            <Controller
              control={control}
              name="bizzNum"
              render={({ field: { onChange, ...rest } }) => (
                <>
                  <Input
                    {...rest}
                    onChange={(e) => onChange(allowOnlyNumber(e.target.value))}
                    placeholder="'-' 제외하고 10자리"
                  />
                  <P>{errors.bizzNum?.message}</P>
                </>
              )}
            />
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
                    // defaultValue={{ value: "00", label: "도수 치료" }}
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

          <Grid item xs={6}>
            <Label>치료사 수 *</Label>
            <Controller
              control={control}
              name="proNumber"
              render={({ field: { onChange, ...rest } }) => (
                <>
                  <Input
                    {...rest}
                    onChange={(e) => onChange(allowOnlyNumber(e.target.value))}
                    placeholder="치료사 수"
                  />
                  <P>{errors.proNumber?.message}</P>
                </>
              )}
            />
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

          <Grid item xs={12}>
            <Label>병원 소개(3000자 제한)</Label>
            <Controller
              control={control}
              name="desc"
              render={({ field: { value, ...rest } }) => {
                return (
                  <>
                    <TextArea
                      value={value}
                      {...rest}
                      rows={8}
                      placeholder="병원 소개를 적어주세요."
                    />
                    <div
                      style={{
                        textAlign: "right",
                        width: "100%",
                      }}
                    >
                      <span>{`${value?.length || 0} / 3000`}</span>
                    </div>
                  </>
                );
              }}
            />

            <P>{errors.desc?.message}</P>
          </Grid>

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

          <Grid item xs={12}>
            <Label>태그 *</Label>
            <FormGroup row>
              <TagInput
                {...register("tag")}
                type="text"
                placeholder="병원 검색 키워드 (키워드는 최대 3개까지 입력 가능합니다.)"
              />
              <TagButton
                // disabled={}
                type="button"
                onClick={handlee.clickAdd}
              >
                추가
              </TagButton>
            </FormGroup>
            <P>{errors.objList?.message}</P>
            {fields.map((obj, index) => {
              return (
                <div key={index}>
                  <Chip
                    label={obj.name}
                    key={index}
                    onClick={() => handlee.clickDelete(index)}
                  />
                  {/* <button onClick={() => handlee.clickDelete(index)}>
                    삭제
                  </button> */}
                </div>
              );
            })}
          </Grid>

          <Grid item xs={12}>
            <Label>이용약관</Label>
            <TextArea {...register("policy")} rows={8} readOnly />
            <P>{errors.policy?.message}</P>
          </Grid>
        </Grid>
        {/* <button type="button" onClick={onSave}>
          임시 저장
        </button>
        <button type="button" onClick={onReset}>
          초기화
        </button> */}
        <Footer>
          <div
            style={{
              width: "1200px",
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
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
            <SubmitButton type="submit">보내기</SubmitButton>
          </div>
        </Footer>
      </form>
    </Block>
  );
}
