import { auth } from "./firebase";

export const checkAuth = () => {
  const user = auth.currentUser;
  if (!user) {
    alert("Please login first");
    return null;
  }
  return user;
};