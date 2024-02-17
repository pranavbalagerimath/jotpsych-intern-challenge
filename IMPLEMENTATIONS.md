### Stage I - Fix the problems
* The timer keeps going up after I press stop. <br><br>

**Implementation:** Used 'clearInterval' to stop the timer

*The app does not update the download status message after the user downloads the audio.<br><br>

**Implementation:** Passed the function 'onDownloadRecording' as a prop to the Recorder Component. This function sets the value of the download status to 'true' once the user downloads the audio.

### Stage II - Improve the UX
* Don't show the start recording button unless the user has granted microphone permissions.<br><br>

**Implementation:** Declared the new state 'permission' that checks if the user has granted microphone access. The button is displayed only if the permission is set to 'true'.

* Only let the user start the recording if they have already named it.<br><br>

**Implementation:** If the 'recordName' is empty and the user clicks on the 'Start recording' button, a validation message is displayed on the screen. The recording begins once a valid name is entered in the text box.

* Make the name of the downloaded file the name of the recording.<br><br>

**Implementation:** Set the link.download in the onClick method to recordName, which is stored as a state.

### Stage III - Implement a new feature
* In addition to the download button, add an "Upload" button that implements the handleUpload function. This function simulates a transcription process whereby the audio is sent to a server and a transcript is returned. The function takes 5 seconds to run and can either fail or succeed. <br><br>

**Implementation:** Created a button that triggers 'handleUpload' on click. Store the audioBlob as a state and pass it as the argument to the handleUpload. The rest of the task is taken care of by the UploadManager.

* Add UI to indicate a status while the audio is "uploading" <br><br>

**Implementation:** Created a new state, 'isUploading,' to keep track of the uploading process. Once the upload button is clicked, the state is changed to true. It is reverted to false after receiving the response. The button name is conditioned on the value of this state.

* Add UI to handle the case where the upload fails.
* Add UI to handle the case where the upload succeeds, displaying the returned data.<br><br>

**Implementation:** 'isUploaded' and 'isUploadSuccess' indicate if the process is completed. The data returned by the UploadManager is stored in a state 'responseMessage'. The response is displayed on the screen. The styling of the div is based on the success/failure of the request.

### BONUS: Stage IV - Indicate Microphone Input Volume
OPTIONAL: Right now, when the user is recording, there is no feedback on the screen indicating that the microphone is working. Let's solve this.<br><br>

**Implementation:** This was an exciting part. The audio is processed using the audioContext, analyzer, and script processor, taking this article as a reference. Instead of using jQuery and modifying the DOM, I stored the average volume and intensity indicators as states.


### Additional cheks
I have added few additional checks.
- Reset the download status to false when the user starts a new recording.
- Since, we are downloading the audio file with recordName, I disbale download and upload buttons if the user clears the name after finishing the recording.
