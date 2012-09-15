<?php
$Module = array( "name" => "api",
                 "variable_params" => true);
                 
$ViewList = array();

$ViewList["place"]= array(
        'functions' => array( 'place' ),       
        'script' => 'place.php',
        'params' => array('placeId', 'offset', 'limit')
);

$FunctionList = array();
$FunctionList['place'] = array();	


?>
