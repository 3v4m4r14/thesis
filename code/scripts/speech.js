var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
recognition.maxAlternatives = 5;
recognition.continuous = true;
recognition.autoRestart = true;
recognition.start();

var speaking = false;

recognition.onspeechstart = function() {
    console.log('You said sth!');
    changeSpeakingStatus();
};

recognition.onspeechend = function () {
    console.log('You stopped talking');
    recognition.stop();
    changeSpeakingStatus();
    setTimeout(function () {
        recognition.start();
    }, 1000);

};

function changeSpeakingStatus() {
    speaking = !speaking;
    $('#speakingStatus').text(speaking.valueOf());
}