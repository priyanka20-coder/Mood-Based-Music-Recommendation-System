// Routes

const express = require("express");
const router = express.Router();
const songModel = require("../model/song.model")
const uploadFile = require("../storage/song.storage")
const multer = require("multer");
const cors = require("cors")

router.use(express.json())

router.use(cors()) // cross-origin resource sharing

const storage = multer({
    storage: multer.memoryStorage(),
    limits: {
        file: 20,
        fileSize: 200 * 1024 * 1024
    }
})
router.post("/song", storage.array("audioFile"), async (req, res) => {

    const { title, artist, mood } = req.body; // normal data
    const data = req.files; // audio
    //console.log(data)
    // console.log(data1)

    for (let i = 0; i < data.length; i++) {
        const filedata = await uploadFile(data[i]);
        console.log(filedata)

        const songData = await songModel.create({
            title: title,
            artist: artist,
            mood: mood,
            audioFile: filedata.url
        })
    }

    res.status(200).json({
        message: "Song created",
    })
})

router.get("/songs", async (req, res) => {
    const allsongs = await songModel.find()

    res.json(allsongs)
})


module.exports = router;