interface UploadResult {
  transcript: string;
  size: number;
}

export class UploadManager {
  static upload(blob: Blob): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      // Simulate a network request delay
      setTimeout(() => {
        // Randomly determine success or failure
        const isSuccess = Math.random() < 0.5;

        if (isSuccess) {
          // Simulate a successful upload and returning a transcript
          resolve({
            transcript:
              "This is a hardcoded transcript of the uploaded audio file.",
            size: blob.size,
          });
        } else {
          // Simulate an upload error
          reject(new Error("Failed to upload the file. Please try again."));
        }
      }, 5000); // 5 seconds delay to simulate network latency
    });
  }
}
