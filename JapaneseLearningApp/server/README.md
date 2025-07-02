# Pronunciation Analysis Feature

This document outlines the implementation of the Japanese pronunciation analysis feature, powered by Azure Speech Service.

## Feature Overview

The goal of this feature is to provide users with real-time feedback on their Japanese pronunciation. The user selects a word or phrase, records their pronunciation, and the system provides a detailed analysis including an overall score, accuracy, fluency, and specific areas for improvement.

### Architecture

The feature is implemented with a client-server architecture:

1.  **Frontend (React Native / Expo)**:
    *   The user interface is built using React Native components.
    *   Audio recording is handled by `expo-av` on mobile and the browser's `MediaRecorder` API on the web.
    *   The recorded audio blob is sent to the backend server along with the reference text (the word the user is trying to pronounce).
    *   The `PronunciationAnalyzer.ts` class on the client-side is responsible for sending the request and processing the analysis received from the server to display it in a user-friendly format.

2.  **Backend (Node.js / Express)**:
    *   A simple Express server (`server.js`) exposes a `/analyze-pronunciation` endpoint.
    *   It receives the audio file and reference text from the client using `multer` for file handling.
    *   It converts the audio from the browser's default format (WEBM) to a format compatible with Azure (OGG) using `fluent-ffmpeg`.
    *   It sends the converted audio to the Azure Speech Service REST API for analysis.
    *   It receives the detailed JSON response from Azure and forwards it back to the client.

## Key Implementation Details & Fixes

Several challenges were addressed during development to ensure the feature works reliably:

1.  **Audio Format Conversion**: The browser's MediaRecorder API often produces audio in WEBM format, which is not directly supported by the Azure Speech Service REST API for pronunciation assessment. We integrated `fluent-ffmpeg` and `@ffmpeg-installer/ffmpeg` into the backend to reliably convert the incoming audio to the OGG format on the fly before sending it to Azure.

2.  **Azure API Integration**:
    *   **Unicode in Headers**: A significant issue was encountered when passing the `Pronunciation-Assessment` configuration in an HTTP header. The reference text, being in Japanese (Unicode), was not being correctly encoded, leading to API errors.
    *   **Solution**: The fix was to move the entire `Pronunciation-Assessment` JSON object from the header into a URL query parameter. This ensured the reference text was correctly URL-encoded and parsed by Azure.
    *   **Fetch API**: We switched from `node-fetch` to the native `fetch` implementation available in modern Node.js versions to resolve subtle header encoding issues and improve standards compliance.

3.  **Secure Credential Management**: To avoid hardcoding sensitive information, the Azure Speech Service subscription key and region were moved into a `.env` file. The `dotenv` package is used to load these environment variables at runtime.

4.  **Robust Frontend Logic**:
    *   **Handling Incomplete Azure Responses**: We discovered that when the spoken audio is too different from the reference text, Azure's API returns a successful speech-to-text result but omits the `PronunciationAssessment` object entirely. The frontend logic in `PronunciationAnalyzer.ts` was enhanced to detect this scenario and provide clear, user-friendly feedback, guiding the user to try saying the correct word.
    *   **Improved Scoring**: The initial scoring logic was too lenient. It was refined to rely more on text similarity (`Levenshtein distance`) rather than just the recognition confidence from Azure. This prevents situations where a user says the wrong word clearly and still gets a high score.

## Future Enhancements

This feature has a solid foundation, but it can be enhanced in several ways:

*   **Real-time/Streaming Analysis**: Instead of waiting for the user to finish recording, we could use WebSockets and the Azure Speech SDK to stream audio to the backend and provide live feedback on pronunciation as the user speaks.
*   **Phoneme-Level Feedback**: The Azure response contains detailed information about each phoneme. We can parse this data to give users highly specific feedback (e.g., "Your 'shi' (し) sound was a bit unclear, try making it sharper").
*   **Pitch Accent Analysis**: While the current system assesses overall pronunciation, a more advanced version could analyze and visualize the user's pitch accent compared to a native speaker's, which is crucial for natural-sounding Japanese.
*   **Support for Longer Sentences**: The current implementation is optimized for words and short phrases. Expanding it to handle full sentences would require more sophisticated analysis of rhythm, intonation, and completeness.
*   **Gamification and Progress Tracking**: Store user scores and track their improvement over time. Add badges, leaderboards, and other gamification elements to keep users engaged.
*   **Integration with Other AI/ML Models**: Combine the pronunciation score with other models to analyze pitch, intonation, and rhythm for more comprehensive feedback.
*   **Improved Error Handling and UI**: Provide more specific and user-friendly error messages (e.g., "Microphone not detected," "Network connection is weak").
