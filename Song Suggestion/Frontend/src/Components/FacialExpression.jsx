import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import axios from "axios";
 
function SongCard({ song, isPlaying, onPlayToggle }) {
  const audioRef = useRef(null);
 
  // Jab ye song "isPlaying" nahi rehta (kyunki koi aur song play hua),
  // to iska audio automatically pause ho jaayega
  useEffect(() => {
    if (!audioRef.current) return;
 
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);
 
  const togglePlay = () => {
    onPlayToggle();
  };
 
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`flex items-center justify-between bg-white px-5 py-4 rounded-xl shadow-sm border transition-colors ${
        isPlaying ? "border-green-400" : "border-transparent"
      }`}
    >
      <div className="min-w-0 pr-3">
        <p className="font-medium text-gray-800 truncate">{song.title}</p>
        <p className="text-sm text-gray-500 truncate">{song.artist}</p>
      </div>
 
      <div className="flex items-center gap-4 shrink-0">
        {/* Audio Element */}
        <audio ref={audioRef} src={song.audioFile} preload="auto" />
 
        {/* Play Button */}
        <motion.button
          onClick={togglePlay}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white shadow-md"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </motion.button>
      </div>
    </motion.div>
  );
}
 
export default function FacialExpression() {
  const videoRef = useRef();
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [expression, setExpression] = useState("Not detected");
  const [songs, setSongs] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
 
  let url = "http://localhost:7000/songs";
  async function fetchSongs() {
    let data = await fetch(url);
    let data1 = await data.json();
    //console.log(data1);
    setSongs(data1);
  }
 
  useEffect(() => {
    fetchSongs();
  }, []);
  console.log(songs);
 
  const filterSongs = songs.filter(
    (el) => el.mood?.toLowerCase() === expression.toLowerCase()
  );
  console.log(filterSongs);
 
  const dummySongs = [
    { title: "Sunrise Serenade", artist: "Ava Carter" },
    { title: "Midnight Groove", artist: "Ethan Blake" },
    { title: "Electric Pulse", artist: "Olivia Hayes" },
    { title: "Tranquil Echoes", artist: "Noah Bennett" },
    { title: "Rhythmic Heartbeat", artist: "Sophia Reed" },
    { title: "Dreamy Horizons", artist: "Liam Foster" },
    { title: "Urban Flow", artist: "Isabella Morgan" },
    { title: "Soulful Journey", artist: "Caleb Parker" },
    { title: "Cosmic Dance", artist: "Grace Ellis" },
    { title: "Velvet Nights", artist: "Owen Mitchell" },
  ];
 
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      setModelsLoaded(true);
      startVideo();
    };
 
    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        videoRef.current.srcObject = stream;
      });
    };
 
    loadModels();
  }, []);
 
  const handleClick = async () => {
    if (!modelsLoaded) return;
 
    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();
 
    if (detection) {
      const sorted = Object.entries(detection.expressions).sort(
        (a, b) => b[1] - a[1]
      );
      setExpression(sorted[0][0]);
    }
  };
 
  console.log(expression);
 
  const moodEmoji = {
    happy: "😄",
    sad: "😢",
    neutral: "😐",
    angry: "😠",
    fearful: "😨",
    disgusted: "🤢",
    surprised: "😲",
  };
 
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f3f0ff] to-[#faf9ff] px-6 py-8 md:px-16">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-10 flex items-center gap-2 text-gray-800"
        >
          🎧 Moody Player
        </motion.header>
 
        {/* Main Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center">
          {/* Camera */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative shrink-0"
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-[280px] h-[280px] rounded-2xl object-cover shadow-lg border-4 border-purple-100"
            />
            {expression !== "Not detected" && (
              <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-medium shadow">
                {moodEmoji[expression?.toLowerCase()] || "🙂"}{" "}
                <span className="capitalize">{expression}</span>
              </span>
            )}
          </motion.div>
 
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 text-center md:text-left"
          >
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              Live Mood Detection
            </h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Your current mood is being analyzed in real-time.
              Enjoy music tailored to your feelings.
            </p>
 
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClick}
              className="bg-purple-600 hover:bg-purple-700 transition-colors text-white px-8 py-3 rounded-full shadow-md font-medium"
            >
              Start Listening
            </motion.button>
 
            <p className="mt-5 text-sm text-gray-600">
              <span className="font-semibold text-gray-800">Detected Mood:</span>{" "}
              <span className="capitalize">{expression}</span>
            </p>
          </motion.div>
        </div>
 
        {/* Recommended Tracks */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Recommended Tracks
          </h3>
 
          {filterSongs.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-400">
              {expression === "Not detected"
                ? "Click \"Start Listening\" to detect your mood and get song recommendations."
                : "No songs found for this mood yet."}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filterSongs.map((song, index) => {
                const songId = song._id || index;
                return (
                  <SongCard
                    key={songId}
                    song={song}
                    isPlaying={currentlyPlaying === songId}
                    onPlayToggle={() =>
                      setCurrentlyPlaying(
                        currentlyPlaying === songId ? null : songId
                      )
                    }
                  />
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
 