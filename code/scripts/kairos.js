// instantiates a new instance of the Kairos client
var kairos = new Kairos('4c8f8aa8', 'e117e2461afdc18a805dacb80599cd89');

var candidate = {
    'id': null,
    'gender': null,
    'age': null,
    'race': null
};

var successfulEnroll = false;


//https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos
(function () {
    var canvas = document.getElementById('canvas');
    var kairosWidth = canvas.width;
    var kairosHeight = canvas.height;
    var video = document.getElementById('video');

    function startup() {
        kairosRemoveGallery();

        // navigator.getMedia = (navigator.getUserMedia ||
        //     navigator.webkitGetUserMedia ||
        //     navigator.mozGetUserMedia ||
        //     navigator.msGetUserMedia);
        //
        // navigator.getMedia({video: true, audio: false},
        //     function (stream) {
        //         if (navigator.mozGetUserMedia) {
        //             video.mozSrcObject = stream;
        //         } else {
        //             var vendorURL = window.URL || window.webkitURL;
        //             try {
        //                 video.srcObject = stream;
        //             } catch (error) {
        //                 video.src = vendorURL.createObjectURL(stream);
        //             }
        //         }
        //         video.play();
        //     },
        //     function (err) {
        //         console.log('An error occured! ' + err);
        //     }
        // );

        // kairosDetectFaces();
        // setInterval(function () {
        //     // kairosDetectFaces();
        // }, 10000);
    }


    function kairosDetect() {
        var image = getImageFromCanvas();
        kairos.detect(image, showDetectData);
    }

    function kairosEnroll() {
        var image = getImageFromCanvas();
        kairos.enroll(image, "thesis_gallery", candidate['id'], showEnrollData);
    }


    function kairosRecognize() {
        var image = getImageFromCanvas();
        //{"threshold":"0.80"}
        kairos.recognize(image, "thesis_gallery", showRecognitionResult);
    }

    function kairosVerify() {
        var image = getImageFromCanvas();
        kairos.verify(image, "thesis_gallery", candidate['id'], showVerifyResult)
    }

    function kairosViewSubjectsInGallery() {
        kairos.viewSubjectsInGallery("thesis_gallery", function (response) {
            showErrors(response);
        });
    }

    function kairosRemoveGallery() {
        kairos.removeGallery("thesis_gallery", function (response) {
            showErrors(response);
        });
    }


    function getImageFromCanvas() {
        var context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, kairosWidth, kairosHeight);
        return canvas.toDataURL('image/png');
    }

    $('#kairosDetect').click(function () {
        kairosDetect();
    });

    $('#kairosEnroll').click(function () {
        kairosEnroll();
    });
    $('#kairosRecognise').click(function () {
        kairosRecognize();
    });
    $('#kairosVerify').click(function () {
        kairosVerify();
    });
    $('#kairosGalleryView').click(function () {
        kairosViewSubjectsInGallery();
    });
    $('#kairosGalleryRemove').click(function () {
        kairosRemoveGallery();
    });
    $('#loginBtn').click(function () {
        candidate['id'] = $('#candidateEmail').val();
        var valid = validEmail(candidate['id']);
        kairosEnroll();
        setTimeout(function () {
            if (valid && successfulEnroll) {
                $('#candidateId').text(candidate['id']);
                $('#registrationModal').modal('hide');
            } else if (!valid){
                $('#loginHelp').text("Invalid email.").css("color", "red");
            } else if (!successfulEnroll) {
                $('#loginHelp').text("Facial recognition error.").css("color", "red");
            }
        }, 1500);
    });


    // Set up our event listener to run the startup process
    // once loading is complete.
    window.addEventListener('load', startup, false);
    window.addEventListener('beforeunload', kairosRemoveGallery, false);
})();


function resetDataText() {
    $('#numOfFacesKairos').text('0');
    $('#genderKairos').text('unknown');
    $('#glassesKairos').text('unknown');
    $('#raceKairos').text('unknown');
    $('#ageKairos').text('unknown');
    $('#feedbackMsg').text('');
}

function showDetectData(response) {
    resetDataText();
    var parsed = JSON.parse(response.responseText);
    console.log(parsed);

    if (parsed.images !== null && parsed.images !== undefined) {

        var faces = parsed.images[0].faces;
        $('#numOfFacesKairos').text(faces.length);

        showFacesData(faces);

    } else if (hasErrors(parsed)) {
        console.log(parsed);
        var detErr = parsed.Errors[0].Message;
        console.log("Error: " + detErr);

        setErrorText(detErr);
    }
}

function showEnrollData(response) {
    resetDataText();
    var parsed = JSON.parse(response.responseText);
    console.log(parsed);

    if (parsed.images !== null && parsed.images !== undefined) {

        var face = parsed.images[0];
        $('#numOfFacesKairos').text(face.length);

        showPersonData(face);
        successfulEnroll = true;

    } else if (hasErrors(parsed)) {
        var enrErr = parsed.Errors[0].Message;
        console.log("Error: " + enrErr);

        setErrorText(enrErr);

        successfulEnroll = false;
    }
    console.log("Enroll: " + successfulEnroll);
}

function showFacesData(faces) {
    if (faces.length === 1) {
        var person = faces[0];
        showPersonData(person);
    } else {
        turnOverlayOn();
    }
}

function showPersonData(person) {
    $('#feedbackMsg').text("-");
    $('#numOfFacesKairos').text('1');
    $('#genderKairos').text(person.attributes.gender.type);
    candidate['gender'] = person.attributes.gender.type;
    $('#glassesKairos').text(person.attributes.glasses);
    $('#ageKairos').text(person.attributes.age);
    candidate['age'] = person.attributes.age;
    showRaceData(person);
}

function showRaceData(person) {
    var races = {
        'white': person.attributes.white,
        'black': person.attributes.black,
        'asian': person.attributes.asian,
        'hispanic': person.attributes.hispanic,
        'other': person.attributes.other
    };
    var maxVal = -1;
    var text = "";
    for (var race in races) {
        text += "<div class='row'><div class='col'>" + race + "</div><div class='col'>" + races[race] + "</div></div>";
        if (races[race] > maxVal) {
            maxVal = races[race];
            candidate['race'] = race;
        }
    }
    $('#raceKairos').html(text);
}

function showRecognitionResult(response) {
    resetDataText();
    var parsed = JSON.parse(response.responseText);
    console.log(parsed);

    if (parsed.images !== null && parsed.images !== undefined) {
        var candidates = parsed.images[0].candidates;
        var transactionMessage = parsed.images[0].transaction.message;

        console.log("Recognition error message: " + transactionMessage);
        console.log(candidates);

        if (candidates !== null && candidates !== undefined) {
            var curCandidate = candidates[0].subject_id;
            var confidence = candidates[0].confidence;
            console.log(curCandidate + ":" + confidence);

            $('#feedbackMsg').text(curCandidate + " (" + confidence + ")");
            $('#numOfFacesKairos').text('1');
            if (confidence >= 0.6) {
                $('#genderKairos').text(candidate['gender']);
                $('#raceKairos').text(candidate['race']);
                $('#ageKairos').text(candidate['age']);
            }
        }
        if (transactionMessage !== null && transactionMessage !== undefined) {
            console.log("Recognition error: " + transactionMessage);
            $('#feedbackMsg').text(transactionMessage);
        }

    } else if (hasErrors(parsed)) {
        var recErr = parsed.Errors[0].Message;
        setErrorText(recErr)
    }
}

function showCandidateData() {
    $('#genderKairos').text(candidate['gender']);
    $('#raceKairos').text(candidate['race']);
    $('#ageKairos').text(candidate['age']);
}

function showVerifyResult(response) {
    resetDataText();
    var parsed = JSON.parse(response.responseText);
    console.log(parsed);

    if (parsed.images !== null && parsed.images !== undefined) {
        var transaction = parsed.images[0].transaction;
        var confidence = transaction.confidence;
        var subjectId = transaction.subject_id;
        var status = transaction.status;
        console.log(subjectId + confidence + status);

        $('#feedbackMsg').text(subjectId + " (" + confidence + ")");
        $('#numOfFacesKairos').text('1');

        if (confidence >= 0.8) {
            showCandidateData();
        }

    } else if (hasErrors(parsed)) {
        var verErr = parsed.Errors[0].Message;
        console.log("Error: " + verErr);

        setErrorText(verErr)
    }
}

function hasErrors(parsed) {
    return parsed.Errors !== null && parsed.Errors !== undefined;
}

function showErrors(response) {
    var parsed = JSON.parse(response.responseText);
    console.log(parsed);
    if (hasErrors(parsed)) {$('#feedbackMsg').text(parsed.Errors[0].Message);}

}

function setErrorText(err) {
    resetDataText();
    $('#feedbackMsg').text(err);
}

function validEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
