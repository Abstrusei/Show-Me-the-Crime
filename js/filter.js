/**
 * JS Functionality specific to filter.html
 */

/**
 * Initialize element events.
 */


/**
 * Load on page load.
 */
$(document).ready(function() {

    // initEvents();
    //"JavaScript is Enabled" Body Class
    $("body").addClass("js");

    // 'Compare' Button
    $('#compare-btn').on('click', function(event){
        $(this).toggleClass('btn-checked');
        $('#fltr-location-2').toggleClass('d-none');
        $('#fltr-location-2').toggleClass('container2');
    });

    // Form Submit Button
    $('#submit-btn').on('click', function(event) {
        event.preventDefault();
        $(this).addClass('btn-checked');
    });

    //Multiselect
    $("#mselect").chosen({max_selected_options: 12});
    $("#mselect").bind("chosen:maxselected", function () { alert("Max elements selected, " +
        "please replace one crime with a different one"); });

    // Update the dropdown once dataset is ready
    $(document).on('dataset2Ready', function() {
        $("#mselect").trigger("chosen:updated");
    });

    // Update the bubbles each time a crime is selected/deselected
    $("#mselect").chosen().change(function(){
        updateByCrime($("#mselect").val());
    });

    $("#mselect_chosen").click(function () {
        // alert("Click");
        $("#mselect").trigger("chosen:updated");
    });

});

