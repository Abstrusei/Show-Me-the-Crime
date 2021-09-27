/**
 * Process dataset from PHP endpoints.
 * Loads data into sessionStorage for external use.
 */

// Loading State of website.
var isLoading = false;

 /**
  * Perform test of sessionStorage.
  * @return true if sessionStorage works,
  *         otherwise false if unusable.
  */
function testStorage() {
    var testKey = "test";
    var testVal = "showmethecrime";

    // Check if Storage exists.
    if (typeof(Storage) !== "undefined") {

        // Test storage of key-value.
        sessionStorage.setItem(testKey, testVal);
        if(sessionStorage.getItem(testKey) == testVal) {
            return true;
        }
    }
    return false;
}

/**
 * Initialize element events.
 */
function initEvents() {

    // 'Refresh' Button
    $("#refresh").on("click", function() {
        showLoader();

        // Retrieve user preferences.
        var lga = sessionStorage.getItem('lga');
        var date = sessionStorage.getItem('date');
        var dateList = JSON.parse(sessionStorage.getItem('dateList'));

        // Update LGA Dropdown.
        $('#lga1').val(lga);
        $('#lga2').val(lga);
        $('.js-example-basic-single').select2();

        // Update date range-slider.
        $("#date").val(dateList.length - dateList.indexOf(date));
        $("#date-value").text(date);

        // Pull new data.
        // Just call both dataset, bubble.js will handle whether to display both dataset or one
        retrieveDataset(1);
        retrieveDataset(2);
    });

    // 'LGA' (Local Government Area) Dropdown selection.
    $("#lga1").change(function() {
        showLoader();

        // Skip if default.
        if($('#lga1').val() == "...") {
            return;
        }

        // Pull data from input, and query new dataset.
        sessionStorage.setItem('lga', $('#lga1').val());
        retrieveDataset(1);
    });

    // 'LGA' (Local Government Area) Dropdown selection.
    $("#lga2").change(function() {
        showLoader();

        // Skip if default.
        if($('#lga2').val() == "...") {
            return;
        }

        // Pull data from input, and query new dataset.
        sessionStorage.setItem('lga', $('#lga2').val());
        retrieveDataset(2);
    });

    // Handle date range-slider.
    $("#date").change(function() {
        showLoader();

        // Retrieve user preferences.
        var date = sessionStorage.getItem('date');
        var dateList = JSON.parse(sessionStorage.getItem('dateList'));

        // Pull data from input, and query new dataset.  
        date = dateList[dateList.length - $('#date').val()];
        sessionStorage.setItem('date', date);
        $("#date-value").text(date);

        retrieveDataset(1);
        retrieveDataset(2);
    });

    // Update dataset if someone wants it.
    $(document).on('datasetUpdate', function() {
        retrieveDataset(1);
        retrieveDataset(2);
    });

}

// Show the loading spinner.
function showLoader() {
    isLoading = true;

    $("body").removeClass("loaded");
    $("body").addClass("unloaded");

    // Check if page / dataset has been loaded, after 10 seconds.
    setTimeout(function() {
        if(isLoading) {
            console.log("Webpage loading timeout. Please refresh the page and try again.");
            alert("Something bad has happened. Please refresh the page and try again.");
        }
    }, 10000);
}

// Hide the loading spinner.
function hideLoader() {
    isLoading = false;

    $("body").removeClass("unloaded");
    $("body").addClass("loaded");
}

// Update the LGA Dropdown box.
function updateLGA() {
    var lga = sessionStorage.getItem('lga');
    var lgaList = JSON.parse(sessionStorage.getItem('lgaList'));
    var crimeList = JSON.parse(sessionStorage.getItem('crimeList'));
    console.log(crimeList);
    $('#lga1').empty();
    $.each(lgaList, function(index, value) {
        $('#lga1').append($('<option>', {
            value: value,
            text: value,
        }));
    });

    $('#lga2').empty();
    $.each(lgaList, function(index, value) {
        $('#lga2').append($('<option>', {
            value: value,
            text: value,
        }));
    });

    $('#mselect').empty();
    $.each(crimeList, function(index, value) {
        $('#mselect').append($('<option>', {
            value: value,
            text: value,
        }));
    });

    // Reset dropdown to internal values.
    $('#lga1').val(lga);
    $('#lga2').val(lga);
    $('.js-example-basic-single').select2();
}

// Updates the Date Range-Slider.dte
function updateDateList() {
    var dateList = JSON.parse(sessionStorage.getItem('dateList'));

    // Resize range-slider.
    $("#date").attr('max', dateList.length);

    // Set to latest datapoint.
    sessionStorage.setItem('date', dateList[0]);
    $("#date").val(dateList.length);
    $("#date-value").text((dateList[0]));
}

// Update the view.
function updateView() {
    var numRows = 12;           // Number of rows to display.
    var dataset = JSON.parse(sessionStorage.getItem('dataset'));

    $("#result").empty();       // Clear element before appending.
    var counter = 0;
    $.each(dataset, function(offence, value) {
        if(counter >= numRows) {
            return;
        }

        $("#result").append("<p>" + "Offence [" + offence + "]: " + value + "</p>");
        counter = counter + 1;
    });

    $("#current_lga").text(sessionStorage.getItem("lga"));
    $("#current_date").text((sessionStorage.getItem("date")) );

}



/**
 * Retrieve Dataset.
 * Also hides the loading spinner when successful.
 * 
 * @param: var options - AJAX Options.
 * @return var dataset - Data.
 */
function retrieveDataset(set) {

    // Parameters for AJAX call.
    var options = {
        date: sessionStorage.getItem('date'),
        lga: sessionStorage.getItem('lga'),
        excludecrime: sessionStorage.getItem('excludeCrime'),
    };

    // AJAX Call.
    $.ajax({
        url: 'php/search.php',      // PHP endpoint
        data: options,              // Parameters
        method: 'POST',
        dataType: 'json',           // Receive JSON results.
        cache: false,               // Retrieve live everytime.
        timeout: 10000,             // Fail after 10 seconds.
        success: function(data) {
            if(data != null) {
                console.log("AJAX: Retrieved 'dataset'.");

                // Save to global variable.
                sessionStorage.setItem('dataset', JSON.stringify(data));
                hideLoader();               // dataset is finished updating.

                // Determines which dataset to update
                if (set == 1) { // First dataset, this will be used in Index.html and filter.html
                    $(document).trigger( "dataset1Ready", Date.now() );

                } else if (set == 2){ // Second dataset, only to be used in filter.html
                    $(document).trigger( "dataset2Ready", Date.now() );
                }
                // For crime dropdown box
                $(document).trigger( "crimeReady", Date.now() );



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
                sessionStorage.setItem('lgaList', JSON.stringify(data));
                $(document).trigger( "lgaListReady", Date.now() );

                updateLGA();
            }
        },
        error: function() {
            console.log("AJAX: Failed to retrieve 'lga'.");
        }
    });
}

function retrieveDateList() {
    // AJAX Call.
    $.ajax({
        url: 'php/get_timeframe.php',
        dataType: 'json',
        cache: false,
        timeout: 10000,
        success: function(data) {
            if(data != null) {
                console.log("AJAX: Retrieved 'dateList'.");

                // Save to global variable.
                sessionStorage.setItem('dateList', JSON.stringify(data));
                $(document).trigger( "dateListReady", Date.now() );
                
                updateDateList();
            }
        },
        error: function() {
            console.log("AJAX: Failed to retrieve 'dateList'.");
        }
    });
}

function retrieveCrimeList() {
    // AJAX Call.
    $.ajax({
        url: 'php/get_offences.php',
        dataType: 'json',
        cache: false,
        timeout: 10000,
        success: function(data) {
            if(data != null) {
                console.log("AJAX: Retrieved 'crimeList'.");

                // Save to global variable.
                sessionStorage.setItem('crimeList', JSON.stringify(data));
                $(document).trigger( "crimeListReady", Date.now() );
            }
        },
        error: function() {
            console.log("AJAX: Failed to retrieve 'dateList'.");
        }
    });
}


function initStorage() {
    // 'LGA' parameter.
    //if(!sessionStorage.getItem('lga')) {
        sessionStorage.setItem('lga', 'Brisbane City Council');
    //}

    // 'date' parameter.
    //if(!sessionStorage.getItem('date')) {
        sessionStorage.setItem('date', 'NOV19');
    //}

    // 'excludeCrime' parameter.
    //if(!sessionStorage.getItem('excludeCrime')) {
        sessionStorage.setItem('excludeCrime', JSON.stringify([]));
    //}

    // Keep clear for new data.
    sessionStorage.setItem('dateList', []); // Possible dates, format NOV19.
    sessionStorage.setItem('lgaList', []);  // Possible Local Government Areas
    sessionStorage.setItem('dataset', []);  // dataset.
}





/**
 * Load on page load.
 */
$(document).ready(function() {

    if(!testStorage()) {
        alert('Storage API is required for website functionality. \n'
            +'Please refresh this page, otherwise use a modern browser.');
    }

    initStorage();
    initEvents();

    // Configure Dropdown Boxes.
    retrieveLGA();
    retrieveDateList();
    retrieveCrimeList();

    // Request the data for default values.
    retrieveDataset(1);
    retrieveDataset(2);
});
