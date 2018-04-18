// put your keys in the header
var headers = {
    'Content-type': 'application/json',
    'app_id': '4c8f8aa8',
    'app_key': 'e117e2461afdc18a805dacb80599cd89'
};

var payload = null;

var url = 'https://api.kairos.com/detect';



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

        takepicture();
        setInterval(function () {
            takepicture();
        }, 5000);
    }


// Capture a photo by fetching the current contents of the video
// and drawing it into a canvas, then converting that to a PNG
// format data URL. By drawing it on an offscreen canvas and then
// drawing that to the screen, we can change its size and/or apply
// other changes before drawing it.
    function takepicture() {
        var context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, kairosWidth, kairosHeight);

        var data = canvas.toDataURL('image/png');

        payload = {'image': data};
        $.ajax(url, {
            headers: headers,
            type: 'POST',
            data: JSON.stringify(payload),
            dataType: 'text'
        }).done(function (response) {
            showKairosData(response);
        });

    }

    // Set up our event listener to run the startup process
    // once loading is complete.
    window.addEventListener('load', startup, false);
})();


function showKairosData(response) {
    var parsed = JSON.parse(response);

    if (parsed.images !== null && parsed.images !== undefined) {

        var faces = parsed.images[0].faces;
        $('#numOfFacesKairos').text(faces.length);

        showFacesData(faces);

    } else if (parsed.Errors !== null) {
        console.log("Error: " + parsed.Errors.Message);

        $('#numOfFacesKairos').text('0');
        $('#genderKairos').text('unknown');
        $('#glassesKairos').text('unknown');
    }
}

function showFacesData(faces) {
    if (faces.length === 1) {
        var person = faces[0];
        $('#genderKairos').text(person.attributes.gender.type);
        $('#glassesKairos').text(person.attributes.glasses);
    } else {
        turnOverlayOn();
    }
}