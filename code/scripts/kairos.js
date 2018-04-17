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
    var width = 320;    // We will scale the photo width to this
    var height = 0;     // This will be computed based on the input stream

    var streaming = false;

    var video = null;
    var canvas = null;
    var photo = null;
    var startbutton = null;

    function startup() {

        video = document.getElementById('kairos-video');
        canvas = document.getElementById('kairos-canvas');
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
                height = video.videoHeight / (video.videoWidth / width);

                // Firefox currently has a bug where the height can't be read from
                // the video, so we will make assumptions if this happens.

                if (isNaN(height)) {
                    height = width / (4 / 3);
                }

                video.setAttribute('width', width);
                video.setAttribute('height', height);
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                streaming = true;
            }
        }, false);

        startbutton.addEventListener('click', function (ev) {
            takepicture();
            ev.preventDefault();
        }, false);

        clearphoto();
    }


// Fill the photo with an indication that none has been
// captured.
    function clearphoto() {
        var context = canvas.getContext('2d');
        context.fillStyle = '#AAA';
        context.fillRect(0, 0, canvas.width, canvas.height);

        imgUrl = canvas.toDataURL('image/png');
        photo.setAttribute('src', imgUrl);
    }


// Capture a photo by fetching the current contents of the video
// and drawing it into a canvas, then converting that to a PNG
// format data URL. By drawing it on an offscreen canvas and then
// drawing that to the screen, we can change its size and/or apply
// other changes before drawing it.
    function takepicture() {
        var context = canvas.getContext('2d');
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            var data = canvas.toDataURL('image/png');
            data = data.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
            console.log(data);
            photo.setAttribute('src', data);
            payload  = { 'image' : imgUrl };
            $.ajax(url, {
                headers  : headers,
                type: 'POST',
                data: JSON.stringify(payload),
                dataType: 'text'
            }).done(function(response){
                console.log(response);
            });
        } else {
            clearphoto();
        }
    }

// Set up our event listener to run the startup process
    // once loading is complete.
    window.addEventListener('load', startup, false);
})();

