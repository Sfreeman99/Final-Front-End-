import { read_cookie } from "sfcookies";

export const getToken = () => {
  let cashuser = read_cookie("CUser");
  let businessUser = read_cookie("BUser");
  if (Array.isArray(cashuser)) {
    if (Array.isArray(businessUser)) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
};
