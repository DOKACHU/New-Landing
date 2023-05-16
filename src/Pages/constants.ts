import * as yup from "yup";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{2,4}?$/;
const nameRegExp = /^[가-힣]{2,10}|[a-zA-Z]{2,10}\s[a-zA-Z]{2,10}$/;
// const bizzNumberRegExp = /^[0-9]{3}-[0-9]{2}-[0-9]{5}$/;

// center
export const schema = yup
  .object({
    // test: yup.object().required(),
    objList: yup
      .array()
      .min(1)
      .max(3)
      .of(
        yup.object().shape({
          name: yup.string().min(4),
        })
      )
      .typeError("asdf"),
    desc: yup
      .string()
      .min(1, "병원소개는 1자리 이상 써주세요.")
      .max(3000, "병원소개는 3000자리 이하로 써주세요.")
      .required("병원소개는 필수 항목 입니다."),

    address1: yup.string().required("주소는 필수 항목 입니다."),
    address2: yup.string().required("상세주소는 필수 항목 입니다."),

    subject: yup.object().required("진료항목은 필수 항목 입니다."),
    location: yup.object().required("지역은 필수 항목 입니다."),
    policy: yup.string(),

    bizzNum: yup
      .string()
      // .matches(bizzNumberRegExp, "사업자 등록번호는 10자리로 입력해주세요.")
      .required("사업자 등록번호는 필수 항목 입니다."),
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

    proNumber: yup
      .number()
      .min(1, "치료사 수는 1이상 써주세요.")
      .max(999, "치료사 수는 999이하로 써주세요.")
      .positive("양수만 허용됩니다.")
      .typeError("치료사 수는 숫자만 가능합니다.")
      .required("치료사 수는 필수 항목 입니다."), // number 에러 시, typeError 로 작성

    email: yup
      .string()
      .required("이메일은 필수 항목 입니다.")
      .email("이메일 형식이 아닙니다."),
    acceptTerms: yup.bool().oneOf([true], "Accept Terms is required"),
  })
  .shape({
    tag: yup.string(),
    // tags: yup.array().of(yup.object()).required("태그는 필수 항목입니다."),
    // .test("required", "태그는 필수 항목입니다.", (value: any) =>
    //   console.log({ value })
    // ),

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
      // .test("fileSize", "File Size is too large", (value: any) => {
      //   return value?.length && value[0].size <= 5242880;
      // })
      .test("fileType", "Unsupported File Format", (value: any) => {
        return (
          value?.length &&
          ["image/jpeg", "image/png", "image/jpg"].includes(value[0].type)
        );
      }),
  })
  .required();

// pro
export const proSchema = yup
  .object({
    desc: yup
      .string()
      .min(1, "자기소개는 1자리 이상 써주세요.")
      .max(3000, "자기소개는 3000자리 이하로 써주세요.")
      .required("자기소개는 필수 항목 입니다."),

    subject: yup.object().required(),
    location: yup.object().required(),
    gender: yup.object().required(),
    // career: yup.string().required("경력은 필수 항목 입니다."),
    // school: yup.string().required("학력은 필수 항목 입니다."),
    // license: yup.string().required("자격증은 필수 항목 입니다."),
    channel: yup.string(),
    policy: yup.string(),

    name: yup
      .string()
      .matches(nameRegExp, "정확한 한글 또는 영어로 이름을 입력해주세요.")
      .min(2, "이름은 2글자 이상 써주세요.")
      .max(9, "이름은 10자 이내로 써주세요.")
      .required("이름을 필수 항목 입니다."),
  })
  .shape({
    careerList: yup.array().of(
      yup.object().shape({
        startYear: yup.string().required("연도를 입력해주세요."),
        startMonth: yup.string().required("월를 입력해주세요."),
        endYear: yup.string().required("연도를 입력해주세요."),
        endMonth: yup.string().required("월를 입력해주세요."),
        content: yup.string().required("경력을 입력해주세요."),
        // age: yup
        //   .number()
        //   .min(3, "3이상 값을 입력해주세요.")
        //   .max(10, "10이하 값을 입력해주세요."),
      })
    ),

    schoolList: yup.array().of(
      yup.object().shape({
        startYear: yup.string().required("연도를 입력해주세요."),
        startMonth: yup.string().required("월를 입력해주세요."),
        endYear: yup.string().required("연도를 입력해주세요."),
        endMonth: yup.string().required("월를 입력해주세요."),
        content: yup.string().required("학력을 입력해주세요."),
        // age: yup
        //   .number()
        //   .min(3, "3이상 값을 입력해주세요.")
        //   .max(10, "10이하 값을 입력해주세요."),
      })
    ),

    licenseList: yup.array().of(
      yup.object().shape({
        registerYear: yup.string().required("연도를 입력해주세요."),
        registerMonth: yup.string().required("월를 입력해주세요."),
        licenseName: yup.string().required("자격증 이름을 입력해주세요."),
        licenseNumber: yup.string().required("자격증 번호을 입력해주세요."),
      })
    ),

    channelList: yup.array().of(
      yup.object().shape({
        channelLink: yup.string().required("링크를 입력해주세요."),
      })
    ),
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
      // .test("fileSize", "File Size is too large", (value: any) => {
      //   return value?.length && value[0].size <= 5242880;
      // })
      .test("fileType", "Unsupported File Format", (value: any) => {
        return (
          value?.length &&
          ["image/jpeg", "image/png", "image/jpg"].includes(value[0].type)
        );
      }),
  })
  .required();
