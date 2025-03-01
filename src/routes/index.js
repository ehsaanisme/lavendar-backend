import { Router } from 'express';
import pdfRoutes from './pdfRoutes.js';

const router = Router();

router.use('/pdf', pdfRoutes);

export default router;