import gigModel from "../models/gig.model.js";
import Gig from "../models/gig.model.js";
import createError from '../utils/createError.js';


export const createGig = async (req, res, next) => {
    if (!req.isSeller) {
        return next(createError(403, "Only sellers can create gigs"));
    }
    const newGig = new Gig({
        userId: req.userId,
        ...req.body,
    });

    try {
        const savedGig = await newGig.save();
        res.status(201).json(savedGig);
    } catch (err) {
        next(createError(400, err.message));
    }
};

export const deleteGig = async (req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.id);

        if (gig.userId !== req.userId) {
            return next(createError(403, "You are not authorized to delete this gig"));
        }
        await Gig.findByIdAndDelete(req.params.id);
        res.status(200).send("Gig deleted successfully");
    } catch (err) {
        next(createError(400, err.message));
    }
};

export const getGig = async (req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.id);
        if (!gig) {
            return next(createError(404, "Gig not found"));
        }
        res.status(200).json(gig);

    } catch (err) {
        next(createError(400, err.message));
    }
};

export const getGigs = async (req, res, next) => {
    const q = req.query;
    const filters = {
        ...(q.userId && { userId: q.userId }),
        ...(q.cat && { cat: q.cat }),
        ...((q.min || q.max) && {
            price: {
                ...(q.min && { $gt: q.min }),
                ...(q.max && { $lt: q.max }),
            },
        }),
        ...(q.search && { title: { $regex: q.search, $options: "i" } }),
    };

    try {
        const gigs = await Gig.find(filters);
        res.status(200).json(gigs);
    } catch (err) {
        next(createError(400, err.message));
    }
};
