import { Router } from "express";
import { getAllUsers } from "../controllers/users/fetchAllUsers";
import { patchProfile } from "../controllers/users/patchProfile";

const router = Router();

/* GET users listing. */
router.get("/", getAllUsers);
router.patch("/:id", patchProfile);

module.exports = router;
