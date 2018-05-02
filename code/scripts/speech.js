var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
recognition.continuous = true;
// recognition.autoRestart = true;

// https://stackoverflow.com/questions/29996350/speech-recognition-run-continuously
// recognition.interimResults = true;
recognition.start();

var speaking = false;

recognition.onspeechstart = function() {
    console.log(+new Date + ' You said sth!');
    changeSpeakingStatus();
};

recognition.onspeechend = function () {
    console.log(+new Date + ' You stopped talking');
    recognition.stop();
    changeSpeakingStatus();
    setTimeout(function () {
        recognition.start();
    }, 1000);

};

// https://stackoverflow.com/questions/17049839/continous-speech-recognition-with-webkit-speech-api?rq=1
recognition.onend = function () {
    // console.log("Speech recognition ended....");
    recognition.start();
};

function changeSpeakingStatus() {
    speaking = !speaking;
    $('#speakingStatus').text(speaking.valueOf());
}