import { useState } from "react";
import "./App.css";
import RecordingComponent from "./Recorder";

function App() {
    const [downloadStatus, setDownloadStatus] = useState<boolean>(false);

    return (
    <>
            <div>User has downloaded recording: {downloadStatus+""}</div>
            <RecordingComponent onDownloadRecording={() => setDownloadStatus(true)} />
    </>
  );
}

export default App;
