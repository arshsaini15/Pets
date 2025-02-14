import multer from "multer"
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const fullPath = path.join(__dirname, '../public/temp');

        fs.access(fullPath, fs.constants.W_OK, (err) => {
            if (err) {
                console.error("No write access to the directory:", fullPath);
            } else {
                console.log("Write access confirmed for directory:", fullPath);
            }
        });

        cb(null, fullPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

export const upload = multer({ 
    storage
});