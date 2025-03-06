import dotenv from "dotenv"
dotenv.config()
import mongoose from "mongoose";
import crypto from "crypto";
import config from "../config/index.js";

if (!process.env.ENCRYPTION_KEY || !process.env.IV) {
    throw new Error("Missing encryption configuration: ENCRYPTION_KEY and IV must be defined in config");
}
let ENCRYPTION_KEY = config.ENCRYPTION_KEY
let IV_KEY = config.IV

// const algorithm = 'aes-256-cbc';

// const key = crypto
//     .createHash('sha512')
//     .update(ENCRYPTION_KEY)
//     .digest('hex')
//     .substring(0, 32)
// const encryptionIV = crypto
//     .createHash('sha512')
//     .update(ENCRYPTION_KEY)
//     .digest('hex')
//     .substring(0, 16)

//     function encryptText(text) {
//         if (!text) return "";

//         try {
//             const iv = crypto.randomBytes(16);  // Use a fresh IV each time
//             const cipher = crypto.createCipheriv(algorithm, key, iv);

//             const encrypted = Buffer.concat([
//                 cipher.update(text, 'utf8'),
//                 cipher.final()
//             ]);

//             // Combine IV and encrypted data, and encode to base64
//             return Buffer.concat([iv, encrypted]).toString('base64');

//         } catch (error) {
//             console.error("Encryption error:", error);
//             return "";
//         }
//     }

//     function decryptText(encryptedText) {
//         if (!encryptedText) return "";

//         try {
//             const data = Buffer.from(encryptedText, 'base64');

//             const iv = data.subarray(0, 16);  // First 16 bytes = IV
//             const encrypted = data.subarray(16);  // Rest = encrypted data

//             const decipher = crypto.createDecipheriv(algorithm, key, iv);

//             const decrypted = Buffer.concat([
//                 decipher.update(encrypted),
//                 decipher.final()
//             ]);

//             return decrypted.toString('utf8');

//         } catch (error) {
//             console.error("Decryption error:", error);
//             return "";
//         }
//     }



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
        voiceMessage: { type: String, default: null }
    },
    { timestamps: true }
);

// messageSchema.pre("save", function (next) {
//     if (this.isModified("text") && this.text) {
//         this.text = encryptText(this.text);
//     }
//     next();
// });

// messageSchema.post(["find", "findOne", "findById"], function (docs) {
//     if (!docs) return;

//     const processDoc = (doc) => {
//         if (doc && doc.text) {
//             try {
//                 doc.text = decryptText(doc.text);
//             } catch (error) {
//                 console.error("Error decrypting message:", error);
//             }
//         }
//     };

//     if (Array.isArray(docs)) {
//         docs.forEach(processDoc);
//     } else {
//         processDoc(docs);
//     }
// });

const Message = mongoose.model("Message", messageSchema);

export default Message; 