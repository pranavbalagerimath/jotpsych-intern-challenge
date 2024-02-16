import React, { useState, useEffect, useRef } from "react";
import { UploadManager } from "./UploadManager";

interface RecordingProps {
  onDownloadRecording: () => void;
}

const RecordingComponent: React.FC<RecordingProps> = ({
  onDownloadRecording,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingName, setRecordingName] = useState<string>("");
  const [progressTime, setProgressTime] = useState<number>(0);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [audioUrl, setAudioUrl] = useState<string>("");
    const [permission, setPermission] = useState<boolean>(false);
    const [showInvalidNameMessage, setShowInvalidNameMessage] = useState<boolean>(false);
    const [audioBlob, setAudioBlob] = useState<Blob>();
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isUploaded, setIsUploaded] = useState<boolean>(false);
    const [isUploadSuccess, setIsUploadSuccess] = useState<boolean>();
    const [responseMessage, setResponseMessage] = useState<string>("");

  const progressInterval = useRef<number | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const handleStartRecording = () => {
      if (!mediaRecorder.current) return;
      if (recordingName === "") {
          setShowInvalidNameMessage(true);
          return;
      }

    setAudioChunks([]);
    setAudioUrl("");
    mediaRecorder.current.start();
    setIsRecording(true);

    progressInterval.current = setInterval(() => {
      setProgressTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  const handleStopRecording = () => {
    if (!mediaRecorder.current || !progressInterval.current) return;

    mediaRecorder.current.stop();
    setIsRecording(false);
    clearInterval(progressInterval.current);
    setProgressTime(0);
  };

    const handleUpload = (audioBlob: Blob) => {
        setIsUploading(true);
    UploadManager.upload(audioBlob)
        .then((response) => {
            setIsUploading(false);
            setIsUploaded(true);
            setIsUploadSuccess(true);
            setResponseMessage(response.transcript);
        console.log(
          `Upload successful. Transcript: ${response.transcript}, Size: ${response.size} bytes`
        );
      })
        .catch((error) => {
            setIsUploading(false);
            setIsUploaded(true);
            setIsUploadSuccess(false);
        setResponseMessage(error.message);
        console.error("Upload failed:", error.message);
      });
  };

  useEffect(() => {
    const initMediaRecorder = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error(
          "Media Devices or getUserMedia not supported in this browser."
        );
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
          if (stream) {
              setPermission(true);
          }
        mediaRecorder.current = new MediaRecorder(stream);
          mediaRecorder.current.ondataavailable = (event) => {
              setAudioChunks((currentChunks) => [...currentChunks, event.data]);
          }
          const audioContext = new AudioContext();
          const analyser = audioContext.createAnalyser();
          const microphone = audioContext.createMediaStreamSource(stream);
          const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

          analyser.smoothingTimeConstant = 0.8;
          analyser.fftSize = 1024;

          microphone.connect(analyser);
          analyser.connect(scriptProcessor);
          scriptProcessor.connect(audioContext.destination);
          scriptProcessor.onaudioprocess = function () {
              const array = new Uint8Array(analyser.frequencyBinCount);
              analyser.getByteFrequencyData(array);
              const arraySum = array.reduce((a, value) => a + value, 0);
              const average = arraySum / array.length;
              //console.log(Math.round(average));
          };
      } catch (err) {
        console.error("Failed to get user media", err);
      }
    };

    initMediaRecorder();
  }, []);

  useEffect(() => {
    if (audioChunks.length > 0 && !isRecording) {
      const audioBlob = new Blob(audioChunks, {
        type: "audio/webm;codecs=opus",
      });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      setAudioBlob(audioBlob);
    }
  }, [audioChunks, isRecording]);
    const uploadMessageStyle = isUploadSuccess ? { color: "#4ee44e" } : { color: "red" };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        height: "70vh",
        padding: "20px",
        boxSizing: "border-box",
        border: "2px solid",
      }}
    >
      <input
        type="text"
        value={recordingName}
        onChange={(e) => setRecordingName(e.target.value)}
        placeholder="Name your recording"
        style={{
          width: "80%",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
          />
          {recordingName === "" && showInvalidNameMessage && < p style={{ color: "red" }} > Please enter a valid name </p>}
          {permission && < button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              style={{
                  width: "80%",
                  padding: "10px",
                  marginBottom: "20px",
                  borderRadius: "5px",
                  border: "none",
                  backgroundColor: "#007bff",
                  color: "white",
                  cursor: "pointer",
              }}
          >
              {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
          }
      <div style={{ marginBottom: "20px" }}>
        Progress Time: {progressTime} seconds
      </div>
      {audioUrl && (
        <div>
          <button
            onClick={() => {
              const link = document.createElement("a");
              link.href = audioUrl;
              link.download = recordingName +`.webm`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              onDownloadRecording();
            }}
            style={{
              width: "80%",
              padding: "10px",
              marginBottom: "20px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#28a745",
              color: "white",
              cursor: "pointer",
            }}
          >
            Download Recording
          </button>
        <button
          onClick={(e) => audioBlob && handleUpload(audioBlob)}
          style={{
                width: "80%",
                padding: "10px",
                marginBottom: "20px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#28a745",
                color: "white",
                cursor: "pointer",
            }}
                  >
                      {isUploading ? "Uploading..." : "Upload Recording" }
                  </button>
                  {isUploaded ? <p style={uploadMessageStyle}> {responseMessage}</p> : null}
        </div>
      )}
    </div>
  );
};

export default RecordingComponent;
