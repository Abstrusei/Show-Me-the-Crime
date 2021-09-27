<?php
/**
 * Endpoint to retrieve List of Local Government Areas.
 * 
 * @return array LGAs.
 */

// Initialize endpoint results as JSON.
header('Content-type: text/javascript');
$return_arr = array();

// Query for dataset.
$query = 'SELECT DISTINCT "LGA Name" from "39ca02ad-e4e4-4c4b-af17-d6696895864a" ORDER BY "LGA Name" ASC';

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
    $currentLGA = $value['LGA Name'];

    // Add to array.
    array_push($return_arr, $currentLGA);
}

// Encoding array in JSON format
echo json_encode($return_arr);
//echo json_encode($return_arr, JSON_PRETTY_PRINT);

?>