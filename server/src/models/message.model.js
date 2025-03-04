import dotenv from "dotenv"
dotenv.config()
import mongoose from "mongoose";
import crypto from "crypto";
import config from "../config/index.js";
// //used aes 256 algo to encryt the messages 

// if (!process.env.ENCRYPTION_KEY || !process.env.IV) {
//     throw new Error("Missing encryption configuration: ENCRYPTION_KEY and IV must be defined in config");
// }
// let ENCRYPTION_KEY=process.env.ENCRYPTION_KEY
// let IV_KEY=process.env.IV
// const algorithm = 'aes-256-cbc'; 
// const key = Buffer.from(ENCRYPTION_KEY, 'hex');  // 32 bytes hex key
// const iv = Buffer.from(IV_KEY, 'hex');               // 16 bytes hex IV

// function encryptText(text) {
//     const cipher = crypto.createCipheriv(algorithm, key, iv);
//     let encrypted = cipher.update(text, 'utf8', 'hex');
//     encrypted += cipher.final('hex');
//     return encrypted;
// }

// function decryptText(encryptedText) {
//     const decipher = crypto.createDecipheriv(algorithm, key, iv);
//     let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
//     decrypted += decipher.final('utf8');
//     return decrypted;
// }

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
        },
        image: {
            type: String,
        },
    },
    { timestamps: true }
);

// Pre-save hook to encrypt text before saving
// messageSchema.pre('save', function (next) {
//     if (this.isModified('text') && this.text) {
//         this.text = encryptText(this.text);
//     }
//     next();
// });

// Post-find hook to decrypt text after retrieving
// messageSchema.post('init', function (doc) {
//     if (doc.text) {
//         doc.text = decryptText(doc.text);
//     }
// });

const Message = mongoose.model("Message", messageSchema);

export default Message;
