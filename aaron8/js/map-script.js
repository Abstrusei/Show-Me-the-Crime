/**
 * Show map.
 */

function mapbox() {

    // Stop focus scrolling.
    L.Control.prototype._refocusOnMap = function _refocusOnMap() {};

    // Initialize Map.
    var myMap = L.map("map").setView([-25, 135], 4);
    myMap.options.minZoom = 4;
    myMap.options.maxZoom = 15;

    // Fallback map.
    var tiles = L.esri.basemapLayer("Streets").addTo(myMap);

    // Load Tile Layers from mapbox.com.
    //TODO: Obtain personalised token for Major Project
     L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGFhbm0iLCJhIjoiY2tmcTJ3cnB3MGdhbTJ5cWpnY2ltZ2l0MCJ9.M7_7ZzSK3Q9LUimKk3OvVw", {
        attribution: 'Map data © href="https://www.openstreetmap.org/">OpenStreetMap contributors, href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA, Imagery © href="https://www.mapbox.com/">Mapbox',
        maxZoom: 15,
        // Change the style of map to either street or satellite view
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'your.mapbox.access.token',
    }).addTo(myMap);
 
    // Load Overlay of Local Government Area Boundaries.
    var wmsLayer = L.tileLayer.wms('https://data.gov.au/geoserver/qld-local-government-areas-psma-administrative-boundaries/wms?', {
        layers: 'ckan_16803f0b_6934_41ae_bf82_d16265784c7f',
        format: 'image/png',
        transparent: true,
        opacity: 0.5,
    }).addTo(myMap);

    // Holds marker of where user has clicked.
    var markerGroup = L.layerGroup().addTo(myMap);

        // Search.
    //var searchControl = L.esri.Geocoding.geosearch().addTo(myMap);
    var arcgisOnline = L.esri.Geocoding.arcgisOnlineProvider({
        // results from this provider will be listed under the label property
        label: 'ArcGIS Online World Geocoding Service',
        countries: ['AU'],
        // limit the number of results from this provider
    });

    var searchControl = L.esri.Geocoding.geosearch({
        useMapBounds: false,
        providers: [arcgisOnline], // will geocode via ArcGIS Online and search the GIS Day feature service.
        placeholder: 'Search for an address',
        title: 'Address Search',
        zoomToResult: true
    }).addTo(myMap);

    searchControl.on('results', function (e) {
        // do something on load
        // Replace with new marker.
        markerGroup.clearLayers();
        var mark = L.marker(e.latlng).addTo(markerGroup);
        
        updateLGA(mark, e.latlng.lat, e.latlng.lng);

    });



    function updateLGA(mark, lat, lng) {

        // Hijack a WMS server for info. (Async).
        var query = {
            request: 'GetFeature',
            typename: 'ckan_16803f0b_6934_41ae_bf82_d16265784c7f',
            outputFormat: 'json',
            bbox: `${lat},${lng},${lat},${lng}`,    // Uses template literals.
        }

        $.ajax({
            url: "https://data.gov.au/geoserver/qld-local-government-areas-psma-administrative-boundaries/wfs",
            timeout: 1000,
            data: query,
            dataType: "json",
            cache: true,
            success: function (data) {
                if(data.features.length !== 0) {
                    if(data.features.length > 1) {
                        console.log('Multiple LGAs found...');
                    }
                    lga = data.features[0].properties;
                    console.log(lga);


                    sessionStorage.setItem('lga', lga.qld_lga__2);

                    var found = false;
                    var lgaList = JSON.parse(sessionStorage.getItem('lgaList'));
                    var reg = new RegExp(`(${lga.qld_lga__2})`,'gi');
                    $.each(lgaList, function(index, value) {
                           if(value.match(reg)) {
                               sessionStorage.setItem('lga', value);
                               $(document).trigger('datasetUpdate', Date.now());
                               found = true;
                               return false;    // Exit each()
                           }
                    });

                    if(found) {
                        mark.bindPopup("Your nearest local government area is: " + lga.qld_lga__2).openPopup();
                    } else {
                        mark.bindPopup("Unable to find exact local government area. Please try again.").openPopup();
                    }

                } else {
                    mark.bindPopup("No Local Government Area exists here.").openPopup();
                }
            },
            error: function() {
                alert('An error has occurred.');
            }
        });

    }




    // Drops a marker when user clicks on the map
    myMap.on('click', function (e) {

        // Replace with new marker.
        markerGroup.clearLayers();
        var mark = L.marker(e.latlng).addTo(markerGroup);

        updateLGA(mark, e.latlng.lat, e.latlng.lng);

    });


    // Request GeoLocation of user.
    myMap.locate({setView: true, maxZoom: 16});

    //Displays GeoLocation of a user if permission is given
    function onLocationFound(e) {
        var radius = e.accuracy;

        markerGroup.clearLayers();
        var mark = L.marker(e.latlng).addTo(markerGroup);
        L.circle(e.latlng, radius).addTo(markerGroup);  // circle of accuracy.

        updateLGA(mark, e.latlng.lat, e.latlng.lng);


        console.log(e.latlng, "radius: " + radius+ "m");
    }  // onLocationFound.
    myMap.on('locationfound', onLocationFound);

    // Displays a default location if permission is not given
    function onLocationError(e) {
        var centerPt = new L.LatLng(-27.470125, 153.0251);
        myMap.flyTo([-27.470125, 153.0251], 6);

        var mark = L.marker(centerPt).addTo(markerGroup)
            .bindPopup("Default location: Brisbane City Council.")
            .openPopup();

        console.log("Geolocation permission: denied, " +
            "Default local council: Brisbane, " + centerPt);
        sessionStorage.setItem('lga', "Brisbane City Council");
        $(document).trigger('datasetUpdate');

    }  // onLocationError.
    myMap.on('locationerror', onLocationError);

}  // mapbox.


function collapseMap() {
    $("#vl").click(function(){
        reduceWidth();
        $("#triangle").toggleClass("flip-180");
    });

    $("#triangle").click(function(){
        reduceWidth();
        $("#triangle").toggleClass("flip-180");
    });
    // alert("Collapse that shit")
}

function reduceWidth() {
    $("#map").toggleClass("collapse");
    $("#map").toggleClass("beforeCollapse");
    if (($("#map").hasClass("collapse"))) {
        modifyBubbles("expand", "-1");
    } else {
        modifyBubbles("shrink", "-1");
    }
}


$(document).ready(function () {
    
    // Load map.
    mapbox();

    // 'Collapsible map' functionality.
    collapseMap();
});
