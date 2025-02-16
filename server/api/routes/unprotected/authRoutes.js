import { Router } from "express";
import {
  authenticate,
  register
} from "../../services/routeServices/authenticationService.js";
import { verifyToken } from "../../middlewares/appMiddlewares/authentication.js";

const authRouter = Router();

authRouter.post("/authenticate", (req, res, next) => {
  authenticate(req.body)
    .then((dataForLocalStorage) => res.json(dataForLocalStorage))
    .catch(next);
});

authRouter.post("/register-employee", (req, res, next) => {
  register(req.body)
    .then((token) => res.json({ token, success: true }))
    .catch(next);
});

export default authRouter;
