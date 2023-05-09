import * as yup from "yup";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{2,4}?$/;
const nameRegExp = /^[가-힣]{2,10}|[a-zA-Z]{2,10}\s[a-zA-Z]{2,10}$/;
const bizzNumberRegExp = /^[0-9]{3}-[0-9]{2}-[0-9]{5}$/;

export const schema = yup
  .object({
    desc: yup
      .string()
      .min(1, "병원소개는 1자리 이상 써주세요.")
      .max(3000, "병원소개는 3000자리 이하로 써주세요.")
      .required("병원소개는 필수 항목 입니다."),

    pdesc: yup
      .string()
      .min(1, "자기소개는 1자리 이상 써주세요.")
      .max(3000, "자기소개는 3000자리 이하로 써주세요.")
      .required("자기소개는 필수 항목 입니다."),

    address1: yup.string().required("주소는 필수 항목 입니다."),
    address2: yup.string().required("상세주소는 필수 항목 입니다."),

    subject: yup.string().required("진료항목은 필수 항목 입니다."),
    location: yup.string().required("지역은 필수 항목 입니다."),
    gender: yup.string().required("성별은 필수 항목 입니다."),
    career: yup.string().required("경력은 필수 항목 입니다."),
    school: yup.string().required("학력은 필수 항목 입니다."),
    license: yup.string().required("자격증은 필수 항목 입니다."),

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

    // years: yup
    //   .string()
    //   .min(1, "연도는 1자리 이상 써주세요.")
    //   .max(4, "연도는 4자리 이하로 써주세요.")
    //   .required("연도는 필수 항목 입니다."),

    // month: yup
    //   .string()
    //   .min(1, "월 입력은 1자리 이상 써주세요.")
    //   .max(2, "월 입력은 2자리 이하로 써주세요.")
    //   .required("월 입력은 필수 항목 입니다."),

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
