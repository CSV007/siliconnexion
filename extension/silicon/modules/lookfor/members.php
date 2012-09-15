<?php

$tpl = eZTemplate::factory();
//$tpl->setVariable('view_parameters', $view_parameters);
// FETCH ALL PLACES
$paramsPlaces = array(
    'SortBy' => array('name', true),
    'ClassFilterType' => 'include',
    'ClassFilterArray' => array('place')
);
$places = eZContentObjectTreeNode::subTreeByNodeID($paramsPlaces, array(65));
$skillsTags = eZTagsObject::fetchByParentID(1);



$tpl->setVariable('places', $places);
$tpl->setVariable('skillsTags', $skillsTags);

$Result['content'] = $tpl->fetch('design:lookfor/members.tpl');
?>