import { getAllProducts, getProductById } from "../../controllers/product.controller";
import { login, register } from "../../controllers/user.controller";
import express from "express";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/products", getAllProducts)
router.get("/products/:id", getProductById)
export default router;
