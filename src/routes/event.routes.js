import { Router } from "express";
import { createEvent, deleteEvent, getAllEvents, getEventById, updateEvent } from "../controllers/event.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()


router.route("/").post(verifyJWT,createEvent)
router.route("/").get(getAllEvents)
router.route("/:eventId").get(getEventById)
router.route("/:eventId").patch(updateEvent)
router.route("/:eventId").delete(deleteEvent)

export default router