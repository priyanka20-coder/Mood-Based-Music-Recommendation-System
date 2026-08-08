// storage

var Imagekit = require("imagekit"); // npm i imagekit
const mongoose = require("mongoose");

var imagekit = new Imagekit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
})

function uploadFile(file) {
    return new Promise((resolve, reject) => {
        // console.log(file)
        imagekit.upload({
            file: file.buffer,
            folder: "my-audio",
            fileName: new mongoose.Types.ObjectId().toString()
        }, (err, result) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(result)
            }
        })
    })
}

module.exports = uploadFile;