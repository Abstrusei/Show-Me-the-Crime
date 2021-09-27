/**
 * AJAX Processing.
 * 
 * Code to retrieve & process data.
 */

// Global Variables for the site.
var isLoading = true;   // True if the loading spinner is present.
var dataset = [];       // Dataset.
var lga = [];           // List of valid LocalGovernmentAreas.
var timeframe = [];     // List of valid MonthYear times.

// AJAX query options.
// On initalisation of document, Date will revert to latest datapoint 
//   when retrieveTimeframe() is called.
var options = {
    date: "NOV19",
    lga: "Brisbane City Council",
};

/* ---------------------------------------------------------------------------*/

// Function to START script.
function startBessie() {
    console.log("Starting script.");

    // Configure Dropdown Boxes.
    retrieveLGA();
    retrieveTimeframe();
    
    // Request the data for default values.
    retrieveDataset();

// options['lga'] = "testing transmission from script.js!";


    $("#refresh").on("click", function() {
        showLoader();

        // Update LGA Dropdown.
        $('#lga').val(options['lga']);
        $('.js-example-basic-single').select2();

        // Update date range-slider.
        $("#date").val(timeframe.length - timeframe.indexOf(options['date']));
        $("#dte").text(options['date']);

        // Pull new data.
        retrieveDataset();
    });

    $("#lga").change(function() {
        showLoader();

        // Skip if default.
        if($('#lga').val() == "...") {
            return;
        }

        // Pull data from input, and query new dataset.
        options['lga'] = $('#lga').val();
        retrieveDataset();
    });

    $("#date").change(function() {
        showLoader();

        // Pull data from input, and query new dataset.  
        options['date'] = timeframe[timeframe.length - $('#date').val()];
        $("#dte").text(options['date']);

        retrieveDataset();
    });


    // Finished initialization. Hide the loader.
    hideLoader();
}

/* ---------------------------------------------------------------------------*/

// Show the loading spinner.
function showLoader() {
    isLoading = true;

    $("body").removeClass("loaded");
    $("body").addClass("unloaded");

    // Check if page / dataset has been loaded.
    setTimeout(function() {
        
        if(isLoading == true 
            && ((!dataset || dataset.length <= 0)
        )) {
            console.log("Webpage loading timeout. Please refresh the page and try again.");
            alert("Something bad has happened. Please refresh the page and try again.");
        }
    }, 10000);  // 10 seconds to timeout.
}

// Hide the loading spinner.
function hideLoader() {
    isLoading = false;

    $("body").removeClass("unloaded");
    $("body").addClass("loaded");
}



// Update the LGA Dropdown box.
function updateLGA() {

    $('#lga').empty();
    $.each(lga, function(index, value) {
        $('#lga').append($('<option>', {
            value: value,
            text: value,
        }));
    });

    // Reset dropdown to internal values.
    $('#lga').val(options['lga']);
    $('.js-example-basic-single').select2();
}

// Updates the Date Range-Slider.
function updateTimeframe() {

    // Resize range-slider.
    $("#date").attr('max', timeframe.length);

    // Set to latest datapoint.
    options['date'] = timeframe[0];
    $("#date").val(timeframe.length - 0);
    $("#dte").text(options['date']);
}

// Update the view.
function updateView() {
    var counter = 0;

    // clear element.
    $("#result").empty();

    $.each(dataset, function(offence, value) {
        if(counter >= 12) {
            return;
        }

        $("#result").append("<p>" + "Offence [" + offence + "]: " + value + "</p>");
        counter = counter + 1;
    });

    PrettyPrintJsonConsole(JSON.stringify(dataset,null,4));

    // This will call the bubbles only for the home page for now
    if (document.title == "Show Me The Crime | Home") {
        beginBubbles(dataset);
    }
}






/**
 * Retrieve Dataset.
 * @param: var options - AJAX Options.
 * @return var dataset - Data.
 */
function retrieveDataset() {

    // Report query options to console.
    PrettyPrintJsonConsole(JSON.stringify(options,null,4));

    // AJAX Call.
    $.ajax({
        url: 'php/search.php',
        data: options,
        dataType: 'json',
        cache: false,
        timeout: 10000,
        success: function(data) {
            if(data != null) {
                console.log("AJAX: Retrieved 'dataset'.");

                // Save to global variable.
                dataset = data;

                updateView();
            }
        },
        error: function() {
            console.log("AJAX: Failed to retrieve 'dataset'.");
        }
    });
}


function retrieveLGA() {
    // AJAX Call.
    $.ajax({
        url: 'php/get_lga.php',
        dataType: 'json',
        cache: false,
        timeout: 10000,
        success: function(data) {
            if(data != null) {
                console.log("AJAX: Retrieved 'lga'.");

                // Save to global variable.
                lga = data;

                updateLGA();
            }
        },
        error: function() {
            console.log("AJAX: Failed to retrieve 'lga'.");
        }
    });
}



function retrieveTimeframe() {
    // AJAX Call.
    $.ajax({
        url: 'php/get_timeframe.php',
        dataType: 'json',
        cache: false,
        timeout: 10000,
        success: function(data) {
            if(data != null) {
                console.log("AJAX: Retrieved 'timeframe'.");

                // Save to global variable.
                timeframe = data;

                updateTimeframe();
            }
        },
        error: function() {
            console.log("AJAX: Failed to retrieve 'timeframe'.");
        }
    });
}

$(document).ready(function(){

});