<?php
/**
 * Endpoint to retrieve valid Month Year pairs.
 * 
 * @return array valid Month Year.
 */

require('timeframe.php');

header('Content-type: text/javascript');
echo json_encode(getTimeframe());

?>