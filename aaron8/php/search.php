<?php
/**
 * Endpoint to retrieve data for specified LGA.
 * 
 * @return array statistics for LGA.
 */

 require('timeframe.php');

// Parameters.
$lga = '';
$excludeCrime = array();

// Parse GET.
if(!empty($_POST['lga'])) {
    // Sanitize.
    $lga = filter_var($_POST['lga'], FILTER_SANITIZE_STRING);
} else {
    // Default to BCC.
    $lga = "Brisbane City Council";
}

$timeframe = getTimeframe();    // From timeframe.php

if(!empty($_POST['date'])) {
    // Sanitize.
    $date = filter_var($_POST['date'], FILTER_SANITIZE_STRING);

    // Validate
    if(!in_array($date, $timeframe)) {
        echo json_encode(null);
        return;
    }
} else {
    // Default to latest datapoint.
    $date = $timeframe[0];
}

if(!empty($_POST['excludecrime'])) {
    $excludeCrime = json_decode($_POST['excludecrime']);
    if(empty($excludeCrime)) {
        $excludeCrime = array();
    }

} else {
    $excludeCrime = array();
}

// Initialize endpoint results as JSON.
header('Content-type: text/javascript');
$return_arr = array();

// Query for dataset.
$query = 'SELECT * from "39ca02ad-e4e4-4c4b-af17-d6696895864a" WHERE "LGA Name" LIKE \'' . $lga .'\' AND "Month Year" LIKE \''.$date.'\'';

// Build and query dataset.
$base_url = "https://www.data.qld.gov.au/api/3/action/datastore_search_sql?sql=";
$api_url = $base_url . $query;
$data = file_get_contents($api_url);
$data = json_decode($data, true);

// Check if dataset is working.
if(!isset($data['success']) || $data['success'] != true 
    || !isset($data['result']['records'])
) {
    echo json_encode(null);
    return;
}

// Parse data into return array.
foreach($data['result']['records'] as $value) {
    $current = $value['Month Year'];

    // Key as "Month Year".
    $return_arr = $value;

    // Remove unwanted entries.
    foreach(["_id", "_full_text", "LGA Name", "Month Year"] as $unwanted) {
        if(isset($return_arr[$unwanted])) {
            unset($return_arr[$unwanted]);
        }
    }
    foreach($excludeCrime as $excluded) {
        if(array_key_exists($excluded, $return_arr)) {
            unset($return_arr[$excluded]);
        }
    }

    arsort($return_arr);
}

// Encoding array in JSON format
echo json_encode($return_arr);
//echo json_encode($return_arr, JSON_PRETTY_PRINT);

?>
