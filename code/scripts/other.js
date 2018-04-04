function turnOverlayOn() {
    $('#severalFacesModal').modal('show');
}

var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
recognition.interimResults = false;
recognition.maxAlternatives = 5;
recognition.continuous = true;
recognition.start();

//TODO make continuous
recognition.onspeechstart = function() {
    console.log('You said sth!');
};