//in this file we write the logic for the multer used for uploading 
const multer = require("multer")

const uplaod = multer({
    storage: multer.memoryStorage(),
    limits:{
        fileSize: 10 * 1024 * 1024, // 10MB
    }
})

module.exports = uplaod