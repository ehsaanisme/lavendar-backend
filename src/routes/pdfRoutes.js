import { Router } from "express";
import { processPDFController } from "../controller/pdfController.js";
import multer from "multer";

const router = Router();
const upload = multer({ dest: "uploads/" });


router.post("/pdf", upload.single("file"), processPDFController);

export default router;
