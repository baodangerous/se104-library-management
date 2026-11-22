import { Router } from "express";
import { portalRouter } from "../portalRoutes";
import { router as authRoutes } from "./authRoutes";
import { router as catalogRoutes } from "./catalogRoutes";
import { router as readerRoutes } from "./readerRoutes";
import { router as circulationRoutes } from "./circulationRoutes";
import { router as adminRoutes } from "./adminRoutes";

export const apiRouter = Router();
apiRouter.use(portalRouter);
apiRouter.use(authRoutes);
apiRouter.use(catalogRoutes);
apiRouter.use(readerRoutes);
apiRouter.use(circulationRoutes);
apiRouter.use(adminRoutes);
