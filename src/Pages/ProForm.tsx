import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Grid, Typography } from "@mui/material";
import { P } from "../styles";
import { useState } from "react";
// import { ErrorEmptyCheck } from "../utils";
import { proSchema } from "./constants";
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
  CustomDivdier,
  AddButton,
  AddItemSection,
  Row,
  YearInput,
  MonthInput,
  ItemInput,
} from "./styles";
import { Select } from "../components";
import arrow from "./arrow.png";
import { useCreatePro } from "../hooks";
import { allowOnlyNumber } from "../utils";
type FormData = yup.InferType<typeof proSchema>;

export default function BForm() {
  const [preview, setPreview] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [multipleImages, setMultipleImages] = useState<any>([]);
  const [rawImages, setRawImages] = useState<any>([]);
  const { mutate: createPro } = useCreatePro();

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
      subject: { value: "00", label: "도수 치료" },
      gender: { value: "male", label: "남자" },
      location: { value: "00", label: "서울" },
      careerList: [
        {
          startYear: "",
          startMonth: "",
          endYear: "",
          endMonth: "",
          content: "",
        },
      ],
      schoolList: [
        {
          startYear: "",
          startMonth: "",
          endYear: "",
          endMonth: "",
          content: "",
        },
      ],
      licenseList: [
        {
          registerYear: "",
          registerMonth: "",
          licenseName: "",
          licenseNumber: "",
        },
      ],
      channelList: [
        {
          channelLink: "",
        },
      ],
    },
    resolver: yupResolver(proSchema),
    mode: "onChange",
  });
  // const { onChange: onPhoneChange, ...rest } = register("phone");
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
  console.log({ errors });
  // submit
  const onSubmit = (data: FormData) => {
    // const isSubmit = ErrorEmptyCheck(errors);
    // if (isSubmit) {    console.log({ data });

    const { name, location, subject, desc, gender } = data as any;
    console.log({ location, subject });

    const formData = new FormData(); // 새로운 폼 객체 생성
    for (let i = 0; i < rawImages.length; i++) {
      formData.append("proImages", rawImages[i]);
    }
    formData.append("licenseImage", selectedImage); // <input name="item" value="hi"> 와 같다.
    formData.append("proName", name);
    formData.append("gender", gender?.label);

    formData.append("city", location?.label);
    formData.append("therapyCategory", subject?.label);
    formData.append("description", desc);

    for (let i = 0; i < fields.length; i++) {
      formData.append(`careers[${i}][centerName]`, fields[i].content);
      formData.append(
        `careers[${i}][startDate]`,
        `${fields[i].startYear}-${fields[i].startMonth}`
      );
      formData.append(
        `careers[${i}][endDate]`,
        `${fields[i].endYear}-${fields[i].endMonth}`
      );
    }

    for (let i = 0; i < schools.length; i++) {
      formData.append(`educations[${i}][schoolName]`, schools[i].content);
      formData.append(
        `educations[${i}][startDate]`,
        `${schools[i].startYear}-${schools[i].startMonth}`
      );
      formData.append(
        `educations[${i}][endDate]`,
        `${schools[i].endYear}-${schools[i].endMonth}`
      );
    }

    for (let i = 0; i < licenses.length; i++) {
      formData.append(`licenses[${i}][licenseName]`, licenses[i].licenseName);
      formData.append(
        `licenses[${i}][licenseNumber]`,
        licenses[i].licenseNumber
      );
      formData.append(
        `licenses[${i}][issueDate]`,
        `${licenses[i].registerYear}-${licenses[i].registerMonth}`
      );
    }

    for (let i = 0; i < channels.length; i++) {
      formData.append(`channels[${i}]`, channels[i].channelLink);
    }

    createPro(formData, {
      onError: (e) => {
        console.log({ e });
      },
      onSuccess: (res) => {
        onReset();
        alert("프로 입점 양식 등록 완료 ");
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

  const onSave = () => {
    const saveObj = {
      name: watch("name"),
      // phone: watch("phone"),
    };
    localStorage.setItem("temp", JSON.stringify(saveObj));
    localStorage.setItem("singleImg", selectedImage);
    localStorage.setItem("singleImgPreview", preview);
    localStorage.setItem("multiImg", multipleImages);
    localStorage.setItem("multiImgPreview", rawImages);
  };

  // console.log({ career, school, license, channel });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "careerList",
  });

  const {
    fields: schools,
    append: sappend,
    remove: sremove,
  } = useFieldArray({
    control,
    name: "schoolList",
  });

  const {
    fields: licenses,
    append: lappend,
    remove: lremove,
  } = useFieldArray({
    control,
    name: "licenseList",
  });

  const {
    fields: channels,
    append: cappend,
    remove: cremove,
  } = useFieldArray({
    control,
    name: "channelList",
  });

  // handler
  const handle = {
    // 추가 (* 수정)
    clickAdd: () => {
      append({
        startYear: "",
        startMonth: "",
        endYear: "",
        endMonth: "",
        content: "",
      });
    },

    // 삭제 (* 수정)
    clickDelete: (index: number) => {
      remove(index);
    },

    // 검증
    clickCheck: () => {
      alert("Success");
      console.log(watch());
    },
  };

  const shandle = {
    // 추가 (* 수정)
    clickAdd: () => {
      sappend({
        startYear: "",
        startMonth: "",
        endYear: "",
        endMonth: "",
        content: "",
      });
    },

    // 삭제 (* 수정)
    clickDelete: (index: number) => {
      sremove(index);
    },

    // 검증
    clickCheck: () => {
      alert("Success");
      console.log(watch());
    },
  };

  const chandle = {
    // 추가 (* 수정)
    clickAdd: () => {
      cappend({
        channelLink: "",
      });
    },

    // 삭제 (* 수정)
    clickDelete: (index: number) => {
      cremove(index);
    },

    // 검증
    clickCheck: () => {
      alert("Success");
      console.log(watch());
    },
  };

  const lhandle = {
    // 추가 (* 수정)
    clickAdd: () => {
      lappend({
        registerYear: "",
        registerMonth: "",
        licenseName: "",
        licenseNumber: "",
      });
    },

    // 삭제 (* 수정)
    clickDelete: (index: number) => {
      lremove(index);
    },

    // 검증
    clickCheck: () => {
      alert("Success");
      console.log(watch());
    },
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
        프로필 정보를 등록해주세요.
      </Typography>

      <Typography variant="subtitle1" gutterBottom fontWeight={600}>
        도카츄는 병원 / 치료사들에게 편리한 환경을 제공하기 위해, 다음 정보를
        리뷰하여 병원 등록을 승인하고 있습니다
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Grid item xs={2}>
              <Label>프로필 이미지 *</Label>
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

          <Grid item xs={6}>
            <Label>이름 *</Label>
            <Input {...register("name")} placeholder="이름" />
            <P>{errors.name?.message}</P>
          </Grid>

          <Grid item xs={6}>
            <Label>성별*</Label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <SelectBlock>
                  <Select
                    {...field}
                    // defaultValue={{ value: "male", label: "남자" }}
                    options={[
                      { value: "male", label: "남자" },
                      { value: "female", label: "여자" },
                    ]}
                  />
                  <ArrowImg src={arrow} alt="" />
                </SelectBlock>
              )}
            />
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
            <Label>담당 항목*</Label>
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

          <Grid item xs={12}>
            <Label>간단 소개글(3000자 제한)</Label>
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
                      placeholder="자기 소개를 적어주세요."
                    />
                    <div
                      style={{
                        textAlign: "right",
                        width: "100%",
                      }}
                    >
                      <span>{`${value?.length || 0} / 3000`}</span>
                    </div>{" "}
                  </>
                );
              }}
            />

            <P>{errors.desc?.message}</P>
          </Grid>

          <Grid item xs={6}>
            <p>자격증 이미지 등록*</p>
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

          {/* 경력 */}
          <Grid item xs={12}>
            <Label>경력*</Label>
            <CustomDivdier />
            <AddButton type="button" onClick={handle.clickAdd}>
              +추가하기
            </AddButton>
            {fields.map((obj, index) => {
              return (
                <AddItemSection key={index}>
                  <div
                    style={{
                      display: "flex",
                      gap: "80px",
                    }}
                  >
                    <Row>
                      <Controller
                        control={control}
                        name={`careerList.${index}.startYear`}
                        render={({ field: { onChange, ...rest } }) => (
                          <Row column>
                            <YearInput
                              {...rest}
                              type="text"
                              placeholder="YYYY"
                              maxLength={4}
                              onChange={(e: any) =>
                                onChange(allowOnlyNumber(e.target.value))
                              }
                            />
                            <P>
                              {errors.careerList?.[index]?.startYear &&
                                errors.careerList?.[index]?.startYear?.message}
                            </P>
                          </Row>
                        )}
                      />

                      <span>.</span>
                      <Controller
                        control={control}
                        name={`careerList.${index}.startMonth`}
                        render={({ field: { onChange, ...rest } }) => (
                          <Row column>
                            <MonthInput
                              {...rest}
                              type="text"
                              placeholder="MM"
                              maxLength={2}
                              onChange={(e: any) =>
                                onChange(allowOnlyNumber(e.target.value))
                              }
                            />
                            <P>
                              {errors.careerList?.[index]?.startMonth &&
                                errors.careerList?.[index]?.startMonth?.message}
                            </P>
                          </Row>
                        )}
                      />
                    </Row>
                    <Row>
                      <Controller
                        control={control}
                        name={`careerList.${index}.endYear`}
                        render={({ field: { onChange, ...rest } }) => (
                          <Row column>
                            <YearInput
                              {...rest}
                              type="text"
                              placeholder="YYYY"
                              maxLength={4}
                              onChange={(e: any) =>
                                onChange(allowOnlyNumber(e.target.value))
                              }
                            />
                            <P>
                              {errors.careerList?.[index]?.endYear &&
                                errors.careerList?.[index]?.endYear?.message}
                            </P>
                          </Row>
                        )}
                      />
                      <span>.</span>
                      <Controller
                        control={control}
                        name={`careerList.${index}.endMonth`}
                        render={({ field: { onChange, ...rest } }) => (
                          <Row column>
                            <MonthInput
                              {...rest}
                              type="text"
                              placeholder="MM"
                              maxLength={2}
                              onChange={(e: any) =>
                                onChange(allowOnlyNumber(e.target.value))
                              }
                            />
                            <P>
                              {errors.careerList?.[index]?.endMonth &&
                                errors.careerList?.[index]?.endMonth?.message}
                            </P>
                          </Row>
                        )}
                      />
                    </Row>
                    <Row>
                      <Controller
                        control={control}
                        name={`careerList.${index}.content`}
                        render={({ field }) => (
                          <Row column>
                            <ItemInput
                              {...field}
                              type="text"
                              name="content"
                              placeholder="병원명"
                            />

                            {errors.careerList?.[index]?.content && (
                              <P>
                                {errors.careerList?.[index]?.content?.message}
                              </P>
                            )}
                          </Row>
                        )}
                      />
                    </Row>
                    {fields.length > 1 && (
                      <button onClick={() => handle.clickDelete(index)}>
                        삭제
                      </button>
                    )}
                  </div>
                </AddItemSection>
              );
            })}
          </Grid>

          {/* 학력 */}
          <Grid item xs={12}>
            <Label>학력*</Label>
            <CustomDivdier />
            <AddButton type="button" onClick={shandle.clickAdd}>
              +추가하기
            </AddButton>
            {schools.map((obj, index) => {
              return (
                <AddItemSection key={index}>
                  <div
                    style={{
                      display: "flex",
                      gap: "80px",
                    }}
                  >
                    <Row>
                      <Controller
                        control={control}
                        name={`schoolList.${index}.startYear`}
                        render={({ field: { onChange, ...rest } }) => (
                          <Row column>
                            <YearInput
                              {...rest}
                              type="text"
                              placeholder="YYYY"
                              maxLength={4}
                              onChange={(e: any) =>
                                onChange(allowOnlyNumber(e.target.value))
                              }
                            />
                            <P>
                              {errors.schoolList?.[index]?.startYear &&
                                errors.schoolList?.[index]?.startYear?.message}
                            </P>
                          </Row>
                        )}
                      />
                      <span>.</span>
                      <Controller
                        control={control}
                        name={`schoolList.${index}.startMonth`}
                        render={({ field: { onChange, ...rest } }) => (
                          <Row column>
                            <MonthInput
                              {...rest}
                              type="text"
                              placeholder="MM"
                              maxLength={2}
                              onChange={(e: any) =>
                                onChange(allowOnlyNumber(e.target.value))
                              }
                            />
                            <P>
                              {errors.schoolList?.[index]?.startMonth &&
                                errors.schoolList?.[index]?.startMonth?.message}
                            </P>
                          </Row>
                        )}
                      />
                    </Row>
                    <Row>
                      <Controller
                        control={control}
                        name={`schoolList.${index}.endYear`}
                        render={({ field: { onChange, ...rest } }) => (
                          <Row column>
                            <YearInput
                              {...rest}
                              type="text"
                              placeholder="YYYY"
                              maxLength={4}
                              onChange={(e: any) =>
                                onChange(allowOnlyNumber(e.target.value))
                              }
                            />
                            <P>
                              {errors.schoolList?.[index]?.endYear &&
                                errors.schoolList?.[index]?.endYear?.message}
                            </P>
                          </Row>
                        )}
                      />
                      <span>.</span>
                      <Controller
                        control={control}
                        name={`schoolList.${index}.endMonth`}
                        render={({ field: { onChange, ...rest } }) => (
                          <Row column>
                            <MonthInput
                              {...rest}
                              type="text"
                              placeholder="MM"
                              maxLength={2}
                              onChange={(e: any) =>
                                onChange(allowOnlyNumber(e.target.value))
                              }
                            />
                            <P>
                              {errors.schoolList?.[index]?.endMonth &&
                                errors.schoolList?.[index]?.endMonth?.message}
                            </P>
                          </Row>
                        )}
                      />
                    </Row>
                    <Row>
                      <Controller
                        control={control}
                        name={`schoolList.${index}.content`}
                        render={({ field }) => (
                          <Row column>
                            <ItemInput
                              {...field}
                              type="text"
                              placeholder="학력"
                            />
                            <P>
                              {errors.schoolList?.[index]?.content &&
                                errors.schoolList?.[index]?.content?.message}
                            </P>
                          </Row>
                        )}
                      />
                    </Row>
                    {schools.length > 1 && (
                      <button onClick={() => shandle.clickDelete(index)}>
                        삭제
                      </button>
                    )}
                  </div>
                </AddItemSection>
              );
            })}
          </Grid>

          {/* 자격증 */}
          <Grid item xs={12}>
            <Label> 자격증*</Label>
            <CustomDivdier />
            <AddButton type="button" onClick={lhandle.clickAdd}>
              +추가하기
            </AddButton>
            {licenses.map((obj, index) => {
              return (
                <AddItemSection key={index}>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <Row>
                      <Controller
                        control={control}
                        name={`licenseList.${index}.licenseName`}
                        render={({ field }) => (
                          <Row column>
                            <ItemInput
                              {...field}
                              type="text"
                              name="content"
                              maxLength={10}
                              placeholder={"자격증 이름"}
                            />
                            <P>
                              {errors.licenseList?.[index]?.licenseName &&
                                errors.licenseList?.[index]?.licenseName
                                  ?.message}
                            </P>
                          </Row>
                        )}
                      />
                    </Row>
                    <Row>
                      <Controller
                        control={control}
                        name={`licenseList.${index}.licenseNumber`}
                        render={({ field }) => (
                          <Row column>
                            <ItemInput
                              {...field}
                              type="text"
                              maxLength={10}
                              placeholder={"자격증 번호"}
                            />
                            <P>
                              {errors.licenseList?.[index]?.licenseNumber &&
                                errors.licenseList?.[index]?.licenseNumber
                                  ?.message}
                            </P>
                          </Row>
                        )}
                      />
                    </Row>
                    <Row>
                      <Controller
                        control={control}
                        name={`licenseList.${index}.registerYear`}
                        render={({ field: { onChange, ...rest } }) => (
                          <Row column>
                            <YearInput
                              {...rest}
                              type="text"
                              placeholder="YYYY"
                              maxLength={4}
                              onChange={(e: any) =>
                                onChange(allowOnlyNumber(e.target.value))
                              }
                            />
                            <P>
                              {errors.licenseList?.[index]?.registerYear &&
                                errors.licenseList?.[index]?.registerYear
                                  ?.message}
                            </P>
                          </Row>
                        )}
                      />
                      <span>.</span>
                      <Controller
                        control={control}
                        name={`licenseList.${index}.registerMonth`}
                        render={({ field: { onChange, ...rest } }) => (
                          <Row column>
                            <MonthInput
                              {...rest}
                              type="text"
                              placeholder="MM"
                              maxLength={2}
                              onChange={(e: any) =>
                                onChange(allowOnlyNumber(e.target.value))
                              }
                            />
                            <P>
                              {errors.licenseList?.[index]?.registerMonth &&
                                errors.licenseList?.[index]?.registerMonth
                                  ?.message}
                            </P>
                          </Row>
                        )}
                      />
                    </Row>

                    {licenses.length > 1 && (
                      <button onClick={() => lhandle.clickDelete(index)}>
                        삭제
                      </button>
                    )}
                  </div>
                </AddItemSection>
              );
            })}
          </Grid>

          {/* 채널 */}
          <Grid item xs={12}>
            <Label> 채널*</Label>
            <CustomDivdier />
            <AddButton type="button" onClick={chandle.clickAdd}>
              +추가하기
            </AddButton>
            {channels.map((obj, index) => {
              return (
                <AddItemSection key={index}>
                  <div
                    style={{
                      display: "flex",
                      gap: "30px",
                    }}
                  >
                    <Row>
                      <Controller
                        control={control}
                        name={`channelList.${index}.channelLink`}
                        render={({ field }) => (
                          <Row column>
                            <ItemInput
                              style={{
                                width: "300px",
                              }}
                              {...field}
                              type="text"
                              name="content"
                              placeholder={
                                "ex) https://www.youtube.com/watch?v=test"
                              }
                            />
                            <P>
                              {errors.channelList?.[index]?.channelLink &&
                                errors.channelList?.[index]?.channelLink
                                  ?.message}
                            </P>
                          </Row>
                        )}
                      />
                    </Row>

                    {channels.length > 1 && (
                      <button onClick={() => chandle.clickDelete(index)}>
                        삭제
                      </button>
                    )}
                  </div>
                </AddItemSection>
              );
            })}
          </Grid>

          <Footer>
            <div
              style={{
                width: "1200px",
                margin: "0 auto",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <SubmitButton type="button" btnType="save" onClick={onSave}>
                임시저장
              </SubmitButton>
              <SubmitButton type="submit">보내기</SubmitButton>
            </div>
          </Footer>
        </Grid>
      </form>
    </Block>
  );
}
