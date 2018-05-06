function turnOverlayOn() {
    $('#severalFacesModal').modal('show');
}

function showRegistration() {
    $('#registrationModal').modal('show');
}

showRegistration();

function changeInputLocation() {
    var btn = $("#clicker");
    var parent = btn.parent();
    var parentCoord = parent[0].getBoundingClientRect();

    var windowHeight = btn.parent().height();
    var windowWidth = btn.parent().width();

    var btnTop = Math.floor((Math.random() * (windowHeight - btn.height())) + 1);
    var btnLeft =  Math.floor((Math.random() * (windowWidth - btn.width())) + 1);

    btn.parent().css({position: 'relative'});
    btn.css({top: btnTop, left: btnLeft, position: 'absolute'});
}


// var btnInterval = setInterval(function () {
//     changeInputLocation();
// }, 5000);


$(document).ready(function () {
    // changeInputLocation();
    // btnInterval;

    $("#clicker").click(function () {
        // clearInterval(btnInterval);
        changeInputLocation();
        // btnInterval;
    });
});
