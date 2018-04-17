var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
// recognition.interimResults = false;
recognition.maxAlternatives = 5;
recognition.continuous = true;
recognition.autoRestart = true;
recognition.start();

recognition.onspeechstart = function() {
    console.log('You said sth!');
};

recognition.onspeechend = function () {
    console.log('You stopped talking');
    recognition.stop();
    setTimeout(function () {
        recognition.start();
    }, 1000);

};