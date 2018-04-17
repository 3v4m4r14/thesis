// put your keys in the header
var headers = {
    'Content-type'     : 'application/json',
    'app_id'          : '4c8f8aa8',
    'app_key'         : 'e117e2461afdc18a805dacb80599cd89'
};

var payload  = { 'image' : imgUrl };

var url = 'https://api.kairos.com/detect';

// make request
// $.ajax(url, {
//     headers  : headers,
//     type: 'POST',
//     data: JSON.stringify(payload),
//     dataType: 'text'
// }).done(function(response){
//     console.log(response);
// });



var imgUrl = null;

//https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos
(function () {
    var kairosWidth = 620;    // We will scale the photo width to this
    var kairosHeight = 0;     // This will be computed based on the input stream

    var streaming = false;

    var video = null;
    var kairosCanvas = null;
    var photo = null;
    var startbutton = null;

    function startup() {

        video = document.getElementById('kairos-video');
        kairosCanvas = document.getElementById('kairos-canvas');
        photo = document.getElementById('photo');
        startbutton = document.getElementById('startbutton');

        navigator.getMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);

        navigator.getMedia(
            {
                video: true,
                audio: false
            },
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
                console.log("An error occured! " + err);
            }
        );

        video.addEventListener('canplay', function (ev) {
            if (!streaming) {
                kairosHeight = video.videoHeight / (video.videoWidth / kairosWidth);

                // Firefox currently has a bug where the height can't be read from
                // the video, so we will make assumptions if this happens.

                if (isNaN(kairosHeight)) {
                    kairosHeight = kairosWidth / (4 / 3);
                }

                video.setAttribute('width', kairosWidth);
                video.setAttribute('height', kairosHeight);
                kairosCanvas.setAttribute('width', kairosWidth);
                kairosCanvas.setAttribute('height', kairosHeight);
                streaming = true;
            }
        }, false);

        startbutton.addEventListener('click', function (ev) {
            takepicture();
            ev.preventDefault();
        }, false);
    }


// Capture a photo by fetching the current contents of the video
// and drawing it into a canvas, then converting that to a PNG
// format data URL. By drawing it on an offscreen canvas and then
// drawing that to the screen, we can change its size and/or apply
// other changes before drawing it.
    function takepicture() {
        var context = kairosCanvas.getContext('2d');
        if (kairosWidth && kairosHeight) {
            kairosCanvas.width = kairosWidth;
            kairosCanvas.height = kairosHeight;
            context.drawImage(video, 0, 0, kairosWidth, kairosHeight);

            var data = kairosCanvas.toDataURL('image/png');
            // data = data.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
            console.log(data);
            photo.setAttribute('src', data);
            payload  = { 'image' : data };
            $.ajax(url, {
                headers  : headers,
                type: 'POST',
                data: JSON.stringify(payload),
                dataType: 'text'
            }).done(function(response){
                console.log(response);
            });
        } else {
        }
    }

// Set up our event listener to run the startup process
    // once loading is complete.
    window.addEventListener('load', startup, false);
})();

