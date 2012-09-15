<?php

$errors = array();
$placeResult = array();



$offset = (isset($Params['offset']) && is_numeric($Params['offset'])) ? $Params['offset'] : 0;
$limit = (isset($Params['limit']) && is_numeric($Params['limit'])) ? $Params['limit'] : 10;


// We check if we have a place id
if (!$Params['placeId']) {
	$errors[] = 'Please set a place id';
} else {
	$placeId = $Params['placeId'];
	$relationsParams = array('AND', array('user/places', array($placeId), 'or'));
}

// We fetch the place and check if this is a place object
$place = eZContentObject::fetch($placeId);
if ($place) {
	if ($place->ClassIdentifier == 'place') {

		$placeDataMap = $place->dataMap();
		$placeResult['id'] = $place->ID;
		$placeResult['name'] = $placeDataMap['name']->DataText;
	} else {
		$errors[] = 'This is not a place';
	}
} else {
	$errors[] = 'This object does not exist';
}

// If we dont have error we fetch this place users
if (empty($errors)) {
	$paramsUsers = array(
		'SortBy' => array('name', true),
		'ClassFilterType' => 'include',
		'ClassFilterArray' => array('user'),
		'ExtendedAttributeFilter' => array(
			'id' => 'orfilter',
			'params' => $relationsParams
			),
		);
	$users = eZContentObjectTreeNode::subTreeByNodeID($paramsUsers, array(12, 13));
	$placeResult['usersCount'] = count($users);

// Foreach user we need name, url, twitter, image url
	if (count($users)) {
		$resultUsers = array();
                $i = 1;
		foreach ($users as $user) {
                    
                    if ($i < $offset) continue;
                    if ($i++ > $offset + $limit) break;
                    
			$userInfo = array();
			// We get info from user datamap
			$userDM = $user->dataMap();



			$userInfo['name'] = $user->Name;
			$userInfo['id'] = $user->NodeID;
			$userInfo['twitter'] = ($userDM['twitter']->DataInt) ? $userDM['twitter']->toString() : NULL;
                        $userInfo['site'] = ($userDM['site']->DataInt) ? $userDM['site']->toString() : NULL;
                        $userPhoto = $userDM['photo']->content();
                        $userPhotoFile = $userPhoto->imageAlias('medium');
                        $userPhotoUrl = $userPhotoFile['url'];
                        ezuri::transformURI($userPhotoUrl, true, 'full');
			$userInfo['picture'] = array();
                            $userInfo['picture']['url'] = $userPhotoUrl;
                            $userInfo['picture']['width'] = $userPhotoFile['width'];
                            $userInfo['picture']['height'] = $userPhotoFile['height'];
                        $resultUsers[] = $userInfo;
		}
                $placeResult['users'] = $resultUsers;
	}
}


echo '<hr /><pre>';
var_dump($placeResult);
echo '</pre><hr />';



eZExecution::cleanExit();
?>