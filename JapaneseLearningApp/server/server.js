const express = require('express');
const multer = require('multer');
// --- FIX: Remove the problematic node-fetch library ---
// const fetch = require('node-fetch'); 
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
require('dotenv').config({ path: path.join(__dirname, '.env') });

ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

const AZURE_API_KEY = process.env.SPEECH_KEY;
const AZURE_REGION = process.env.SPEECH_REGION;

if (!AZURE_API_KEY || !AZURE_REGION) {
  console.error("FATAL ERROR: Azure credentials not found in .env file.");
  process.exit(1);
}

const upload = multer({ dest: 'uploads/' });

async function convertWebMToOgg(audioBuffer) {
  return new Promise((resolve, reject) => {
    const tempInputPath = path.join(__dirname, 'uploads', `temp_input_${Date.now()}.webm`);
    const tempOutputPath = path.join(__dirname, 'uploads', `temp_output_${Date.now()}.ogg`);
    fs.writeFileSync(tempInputPath, audioBuffer);

    ffmpeg(tempInputPath)
      .audioCodec('libopus')
      .audioFrequency(16000)
      .format('ogg')
      .on('end', () => {
        const convertedBuffer = fs.readFileSync(tempOutputPath);
        fs.unlinkSync(tempInputPath);
        fs.unlinkSync(tempOutputPath);
        resolve(convertedBuffer);
      })
      .on('error', (err) => {
        fs.unlinkSync(tempInputPath);
        reject(new Error(`FFmpeg conversion failed: ${err.message}`));
      })
      .save(tempOutputPath);
  });
}

app.post('/analyze-pronunciation', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file uploaded' });
  }

  let audioFilePath = req.file.path;

  try {
    const audioBuffer = fs.readFileSync(audioFilePath);
    const convertedAudioBuffer = await convertWebMToOgg(audioBuffer);
    
    const referenceText = req.body.referenceText;
    if (!referenceText) {
      return res.status(400).json({ error: 'No referenceText provided' });
    }

    const baseUrl = `https://${AZURE_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=ja-JP&format=detailed`;
    
    const pronunciationAssessmentConfig = {
      ReferenceText: referenceText,
      GradingSystem: "HundredMark",
      Granularity: "Phoneme",
      Dimension: "Comprehensive",
      EnableMiscue: true
    };

    const assessmentJson = JSON.stringify(pronunciationAssessmentConfig);
    const encodedAssessment = encodeURIComponent(assessmentJson);
    const url = `${baseUrl}&pronunciationAssessment=${encodedAssessment}`;

    const headers = {
      'Ocp-Apim-Subscription-Key': AZURE_API_KEY,
      'Content-Type': 'audio/ogg; codecs=opus',
      'Accept': 'application/json'
    };

    console.log(`Analyzing pronunciation for: "${referenceText}"`);

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: convertedAudioBuffer,
    });

    const result = await response.json();

    // --- FIX: Add detailed logging for the full Azure response ---
    console.log("--- Full Azure Response ---");
    console.log(JSON.stringify(result, null, 2)); // Pretty-print the JSON
    console.log("---------------------------");

    if (!response.ok) {
        console.error("Azure API Error:", result);
        throw new Error(`Azure API responded with status ${response.status}`);
    }
    
    console.log("Azure analysis successful.");
    res.json(result);

  } catch (error) {
    console.error('Error during pronunciation analysis:', error);
    res.status(500).json({ error: `Analysis failed: ${error.message}` });
  } finally {
    fs.unlinkSync(audioFilePath);
  }
});

// --- FIX: Corrected the duplicated and malformed app.listen call ---
app.listen(port, () => {
  console.log(`Pronunciation server listening at http://localhost:${port}`);
});