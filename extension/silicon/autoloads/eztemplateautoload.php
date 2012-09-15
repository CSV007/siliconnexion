<?php

// Operator autoloading
$eZTemplateOperatorArray = array();
$eZTemplateOperatorArray[] =

array( 'script' => 'extension/silicon/autoloads/silicon.php',
        'class' => 'Silicon',
        'operator_names' => array( 
            'tags_json'
            )
     );
?>