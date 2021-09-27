<?php
/**
 * Endpoint to retrieve data for specified LGA.
 * 
 * @return array statistics for LGA.
 */

 require('timeframe.php');

// Parameters.
$lga = '';

// Parse GET.
if(!empty($_GET['lga'])) {
    // Sanitize.
    $lga = filter_var($_GET['lga'], FILTER_SANITIZE_STRING);
} else {
    // Default to BCC.
    $lga = "Brisbane City Council";
}

$timeframe = getTimeframe();    // From timeframe.php

if(!empty($_GET['date'])) {
    // Sanitize.
    $date = filter_var($_GET['date'], FILTER_SANITIZE_STRING);

    // Validate
    if(!in_array($date, $timeframe)) {
        echo json_encode(null);
        return;
    }
} else {
    // Default to latest datapoint.
    $date = $timeframe[0];
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

// Parse data into return array. Loads once.
foreach($data['result']['records'] as $value) {
    arsort($value);

    foreach($value as $k => $v) {
	if(!in_array($k, ["_id", "_full_text", "LGA Name", "Month Year"])) {
	    $entry = array('crime' => $k, 'crimeValue' => $v);
            array_push($return_arr, $entry);
	}
    }
}

// Encoding array in JSON format
echo json_encode($return_arr);
//echo json_encode($return_arr, JSON_PRETTY_PRINT);

?>
