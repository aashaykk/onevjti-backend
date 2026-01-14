import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { getEventRegistrations, registerForEvent } from "../controllers/eventRegistration.controller.js";

const router = Router()

router.use(verifyJWT)

router.route("/register").post(registerForEvent)
router.route("/:eventId/registrations").get(getEventRegistrations)

export default router

