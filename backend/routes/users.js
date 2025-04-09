import { Router } from "express";
import { getAllUsers } from "../controllers/users/fetchAllUsers";
import { patchProfile } from "../controllers/users/patchProfile";
import { refreshToken } from "../controllers/users/refreshToken";
import { verifyAccount } from "../controllers/users/verifyAccount";

const router = Router();

router.get("/verify-account", verifyAccount);

/* GET users listing. */
router.get("/", getAllUsers);
router.patch("/:id", patchProfile);
router.post("/refresh-token", refreshToken);

export default router;
