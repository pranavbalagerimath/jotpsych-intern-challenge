### Stage I - Fix the problems

- The timer keeps going up after I press stop.
- The app does not update the download status message after the user downloads the audio.

### Stage II - Improve the UX

- Don't show the start recording button unless the user has granted microphone permissions.
- Don't let the user start the recording unless they have named the recording already.
- Make the name of downloaded file the name of the recording.

### Stage III - Implement a new feature

- In addition to the download button, add an "Upload" button that implements the handleUpload function.
  This function simulates a transcription process whereby the audio is sent to a server and a transcript is returned.
  The function takes 5 seconds to run and can either fail or succeed.
- Add UI to indicate a status while the audio is "uploading"
- Add UI to handle the case where the upload fails.
- Add UI to handle the case where the upload succeeds, displaying the returned data.

### BONUS: Stage IV - Indicate Microphone Input Volume

- OPTIONAL: Right now, when the user is recording, there is no feedback on the screen indicating that the microphone is working. Let's solve this.

## Notes:

- Feel free to spice up the UI, but this is the least important part. We're primarily concerned with functionality, code clarity, and efficiency.
- Use valid TypeScript.
- OPTIONAL: If you're having fun and want to show off, go ahead and expand the project a little further. Show that you understand our product and our market by mocking a feature that is relevant to the SmartScribe technology.
