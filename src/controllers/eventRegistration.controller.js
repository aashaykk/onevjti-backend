import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {EventRegistration} from "../models/eventRegistration.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"

const registerForEvent = asyncHandler(async(req, res) => {
    const { eventId } = req.params

    if(!eventId) {
        throw new ApiError(400, "Event Id is required")
    }

    const event = await Event.findById(eventId)

    if(!event) {
        throw new ApiError(404, "Event not found")
    }

    const userId = req.user._id

    const alreadyRegistered = await EventRegistration.findOne({ user: userId, event: eventId })

    if(alreadyRegistered) {
        throw new ApiError(409, "You are already registered for this event");
    }

    const registration = await EventRegistration.create({
        user: userId,
        event: eventId
    })

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            registration,
            "Registered For the event successfully!"
        )
    )

})

const getEventRegistrations = asyncHandler(async(req, res) => {
    const { eventId } = req.params

    if(!eventId) {
        throw new ApiError(400, "Event Id is required")
    }

    const requester = await Member.findOne({ user: req.user._id })

    if(!requester) {
        throw new ApiError(403, "Not a committee member")
    }

    if(!["head","core"].includes(requester.role)) {
        throw new ApiError(403, "Only head and core members can perform this action")
    }

    const event = await Event.findById(eventId)

    if(!event) {
        throw new ApiError(404, "Event not found")
    }

    if(event.committee.toString() !== requester.committee.toString()
) {
        throw new ApiError(403, "Unauthorized action performed")
    }

    const registrations = await EventRegistration.find({ event: eventId })
    .populate("user", "username fullName email")
    .sort({ createdAt: -1 });

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            registrations,
            "Registrations fetched successfully"
        )
    )

})

export {
    registerForEvent,
    getEventRegistrations
}