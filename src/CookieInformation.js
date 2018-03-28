import { read_cookie } from "sfcookies";

export const getToken = () => {
  let match = read_cookie("CUser");
  if (Array.isArray(match)) {
    return false;
  } else {
    return true;
  }
};
