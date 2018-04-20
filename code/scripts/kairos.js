// instantiates a new instance of the Kairos client
var kairos = new Kairos('4c8f8aa8', 'e117e2461afdc18a805dacb80599cd89');

var candidate_id = "";



//https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos
(function () {
    var canvas = document.getElementById('canvas');
    var kairosWidth = canvas.width;
    var kairosHeight = canvas.height;
    var video = document.getElementById('video');

    function startup() {

        navigator.getMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);

        navigator.getMedia({video: true, audio: false},
            function (stream) {
                if (navigator.mozGetUserMedia) {
                    video.mozSrcObject = stream;
                } else {
                    var vendorURL = window.URL || window.webkitURL;
                    try {
                        video.srcObject = stream;
                    } catch (error) {
                        video.src = vendorURL.createObjectURL(stream);
                    }
                }
                video.play();
            },
            function (err) {
                console.log('An error occured! ' + err);
            }
        );

        // kairosDetectFaces();
        setInterval(function () {
            // kairosDetectFaces();
        }, 10000);
    }


    function kairosDetect() {
        var image = getImageFromCanvas();
        kairos.detect(image, showDetectData);
    }

    function kairosEnroll() {
        var image = getImageFromCanvas();
        kairos.enroll(image, "thesis_gallery", candidate_id, showEnrollData);
    }


    function kairosRecognize() {
        var image = getImageFromCanvas();
        kairos.recognize(image, "thesis_gallery", showRecognitionResult);
    }

    function kairosVerify() {
        var image = getImageFromCanvas();
        kairos.verify(image, "thesis_gallery", candidate_id, function (response) {
            console.log(response.responseText);
        })
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
        candidate_id = $('#candidateEmail').val();
        if (validEmail(candidate_id)) {
            $('#candidateId').text(candidate_id);
            $('#registrationModal').modal('hide');
            kairosEnroll();
        } else {
            $('#emailHelp').text("Invalid email.").css("color", "red");

        }
    });


    // Set up our event listener to run the startup process
    // once loading is complete.
    window.addEventListener('load', startup, false);
    window.addEventListener('beforeunload', kairosRemoveGallery, false)
})();





function showDetectData(response) {
    var parsed = JSON.parse(response.responseText);

    if (parsed.images !== null && parsed.images !== undefined) {

        var faces = parsed.images[0].faces;
        $('#numOfFacesKairos').text(faces.length);

        showFacesData(faces);

    } else if (parsed.Errors !== null) {
        console.log(parsed);
        var detErr = parsed.Errors[0].Message;
        console.log("Error: " + detErr);

        $('#feedbackMsg').text(detErr);
        $('#numOfFacesKairos').text('0');
        $('#genderKairos').text('unknown');
        $('#glassesKairos').text('unknown');
    }
}

function showEnrollData(response) {
    var parsed = JSON.parse(response.responseText);

    if (parsed.images !== null && parsed.images !== undefined) {

        var face = parsed.images[0];
        $('#numOfFacesKairos').text(face.length);

        showPersonData(face);

    } else if (parsed.Errors !== null) {
        var enrErr = parsed.Errors[0].Message;
        console.log("Error: " + enrErr);

        $('#feedbackMsg').text(enrErr);
        $('#numOfFacesKairos').text('0');
        $('#genderKairos').text('unknown');
        $('#glassesKairos').text('unknown');
    }
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
    $('#glassesKairos').text(person.attributes.glasses);
}

function showRecognitionResult(response) {
    var parsed = JSON.parse(response.responseText);

    if (parsed.images !== null && parsed.images !== undefined) {
        var candidates = parsed.images[0].candidates;
        var transactionMessage = parsed.images[0].transaction.message;

        console.log("Recognition error message: " + transactionMessage);
        console.log(candidates);

        if (candidates !== null && candidates !== undefined) {
            var candidate = candidates[0].subject_id;
            var confidence = candidates[0].confidence;
            console.log(candidate + ":" + confidence);
            $('#feedbackMsg').text(candidate + " (" + confidence + ")");
        }
        if (transactionMessage !== null && transactionMessage !== undefined) {
            console.log("Recognition error: " + transactionMessage);
            $('#feedbackMsg').text(transactionMessage);
        }

    } else if (parsed.Errors !== null) {
        var recError = parsed.Errors[0].Message;
        console.log("Error: " + recError);

        $('#feedbackMsg').text(recError);
        $('#numOfFacesKairos').text('unknown');
        $('#genderKairos').text('unknown');
        $('#glassesKairos').text('unknown');
    }
}

function showErrors(response) {
    console.log(response.responseText);
    var parsed = JSON.parse(response.responseText);
    if (parsed.Errors !== null && parsed.Errors !== undefined) {
        $('#feedbackMsg').text(parsed.Errors[0].Message);
    }
}

function validEmail(email)
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}