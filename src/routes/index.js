import {Router} from 'express';
import videoRoutes from "./videoRoutes.js";

const router = Router();

// Add your routes here!
router.use('/video', videoRoutes)

export default router;