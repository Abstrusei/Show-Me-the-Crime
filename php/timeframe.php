<?php

function getTimeframe() {
$return_arr = array();

// Query for dataset.
$query = 'SELECT DISTINCT "Month Year" from "39ca02ad-e4e4-4c4b-af17-d6696895864a"';

// Build and query dataset.
$base_url = "https://www.data.qld.gov.au/api/3/action/datastore_search_sql?sql=";
$api_url = $base_url . $query;
$data = file_get_contents($api_url);
$data = json_decode($data, true);

// Check if dataset is working.
if(!isset($data['success']) || $data['success'] != true 
    || !isset($data['result']['records'])
) {
    return null;
}

// Parse data into return array.
$timeframe = array();
foreach($data['result']['records'] as $value) {
    $current = $value['Month Year'];
    
    // Add to array.
    array_push($timeframe, DateTime::createFromFormat('!My', $current)->getTimestamp());
}

// Sort timestamps.
arsort($timeframe);

// Convert back into Month Year keys.
foreach($timeframe as $value) {
    array_push($return_arr, strtoupper(date("My", $value)));
}

// Encoding array in JSON format
return $return_arr;
}

?>