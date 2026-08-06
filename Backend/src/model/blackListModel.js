import mongoose from "mongoose";

const blackListTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required"], 
    }
}, {
    timestamps: true
}
);

const tokenBlackListModel = mongoose.model("TokenBlackList", blackListTokenSchema);

export default tokenBlackListModel;

