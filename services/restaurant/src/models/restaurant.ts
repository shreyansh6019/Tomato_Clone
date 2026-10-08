import mongoose, { Schema, Document } from "mongoose";

export interface IRestaurant extends Document {
    name: string;
    description?: string;
    image: string;
    ownerId: string;
    phone: Number;
    isVerified: boolean;

    autoLocation: {
        type: "Point";
        coordinates: [number, number];
        formattedAddress: string;
    };

    isOpen: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const restaurantSchema = new Schema<IRestaurant>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: false,
            trim: true,
        },
        image: {
            type: String,
            required: true,
            trim: true,
        },
        ownerId: {
            type: String,
            ref: "User",
            required: true,
            trim: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        isVerified: {
            type: Boolean,
            required: true,
        },
        autoLocation: {
            type: {
                type: String,
                required: true,
                enum: ["Point"],
                trim: true,
            },
            coordinates: {
                type: [Number],
                required: true,
                trim: true,
            },
            formattedAddress: {
                type: String,
                required: true,
                trim: true,
            },
        },
        isOpen: {
            type: Boolean,
            required: true,
        },
        createdAt: {
            type: Date,
            required: true,
        },
        updatedAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

restaurantSchema.index({ autoLocation: "2dsphere" });

export default mongoose.model<IRestaurant>("Restaurant", restaurantSchema);