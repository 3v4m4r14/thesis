var Demo = {

    update: function () {
        var x = xLabs.getConfig('state.gaze.estimate.x');
        var y = xLabs.getConfig('state.gaze.estimate.y');

        $('#target').css({'left' : (x-20) + 'px',
                           'top' : (y-80) + 'px',
                           'position' : 'absolute'});
    },

    ready: function () {
        xLabs.setConfig( 'calibration.clear', '1' ); // this also clears the memory buffer
        xLabs.setConfig('system.mode', 'learning');
        xLabs.setConfig('browser.canvas.paintHeadPose', '0');

        window.addEventListener( 'beforeunload', function() {
            xLabs.setConfig( 'system.mode', 'off' );
        });
    }

};

xLabs.setup(Demo.ready, Demo.update, null, 'a4518618-0fe6-4877-91b8-086fdc66e76c');