window.onload = function () {
    var objects = new tracking.ObjectTracker('face');
    objects.setInitialScale(4);
    objects.setStepSize(2);
    objects.setEdgesDensity(0.1);
    tracking.track('#video', objects, {camera: true});
    objects.on('track', function (event) {
        $('#numOfFaces').text(event.data.length);
        if (event.data.length > 1) {
            $('#severalFacesModal').modal('show');
        }
    });
};