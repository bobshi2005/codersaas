jQuery(document).ready(function() {
    var map = new AMap.Map('mapContainer', {
        center: [116.397428, 39.90923],
        zoom: 4
    });
    map.plugin(["AMap.ToolBar"], function() {
        map.addControl(new AMap.ToolBar());
    });
    var markers = [];
    for (var i = 0; i < 10; i += 1) {
        var marker;
        var lng = Math.random() * 10 + 108;
        var lat = Math.random() * 9.6 + 32;
        marker = new AMap.Marker({
            position: [lng, lat],
            offset: new AMap.Pixel(-12, -12),
            zIndex: 101,
            map: map
        });
        marker.on('click', function(e) {
            self.location='devopt.html'
        })
    }

});
