import { createContext } from "react";

export const UserContext = createContext({
  userInfo: { name: null, email: null },
  setUserInfo: () => {},
});
