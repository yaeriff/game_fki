<?php
header('Content-Type: application/json');

$jsonData = file_get_contents('questions.json');

echo $jsonData;
?>
