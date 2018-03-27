window.onload = function () {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    var objects = new tracking.ObjectTracker('face');
    objects.setInitialScale(4);
    objects.setStepSize(2);
    objects.setEdgesDensity(0.1);
    tracking.track('#video', objects, {camera: true});
    objects.on('track', function (event) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        event.data.forEach(function(rect) {
            context.strokeStyle = '#a64ceb';
            context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            context.font = '11px Helvetica';
            context.fillStyle = "#fff";
            context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
            context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
        });

        $('#numOfFaces').text(event.data.length);
        if (event.data.length > 1) {
            $('#severalFacesModal').modal('show');
        }
    });
};