import { Router } from "express";
import registerUser from "../controllers/users/registerUser.js";
import verifyAccount from "../controllers/users/verifyAccount.js";
import loginUser from "../controllers/users/loginUser.js";
import refreshToken from "../controllers/users/refreshToken.js";
import patchProfile from "../controllers/users/patchProfile.js";
import forgotPassword from "../controllers/users/forgotPassword.js";
import fetchAllUsers from "../controllers/users/fetchAllUsers.js";

const userRouter = Router();

userRouter.get("/register", registerUser);
userRouter.get("/verify-account", verifyAccount);
userRouter.get("/login", loginUser);
userRouter.post("/refresh-token", refreshToken);
userRouter.get("/login", forgotPassword);

/* GET users listing. */
userRouter.patch("/:id", patchProfile);
userRouter.get("/", fetchAllUsers);

export default userRouter;
