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



			
			$userInfo['id'] = $user->NodeID;
			$userInfo['last_name'] = ($userDM['last_name']->hasContent()) ? $userDM['last_name']->toString() : NULL;
			$userInfo['first_name'] = ($userDM['first_name']->hasContent()) ? $userDM['first_name']->toString() : NULL;

			$userInfo['twitter'] = ($userDM['twitter']->hasContent()) ? $userDM['twitter']->toString() : NULL;
			$userInfo['facebook'] = ($userDM['facebook']->hasContent()) ? $userDM['facebook']->toString() : NULL;
			$userInfo['viadeo'] = ($userDM['viadeo']->hasContent()) ? $userDM['viadeo']->toString() : NULL;
			$userInfo['linkedin'] = ($userDM['linkedin']->hasContent()) ? $userDM['linkedin']->toString() : NULL;
			$userInfo['behance'] = ($userDM['behance']->hasContent()) ? $userDM['behance']->toString() : NULL;
			$userInfo['dribbble'] = ($userDM['dribbble']->hasContent()) ? $userDM['dribbble']->toString() : NULL;
			$userInfo['gender'] = ($userDM['gender']->hasContent()) ? $userDM['gender']->toString() : NULL;
                       
                        
                    //    $userInfo['skills'] = ($userDM['skills']->hasContent()) ? $userDM['skills']->keywordString() : NULL;
			
                        $userInfo['drink'] = ($userDM['drink']->hasContent()) ? $userDM['drink']->toString() : NULL;
			$userInfo['phone'] = ($userDM['phone']->hasContent()) ? $userDM['phone']->toString() : NULL;
			$userInfo['site'] = ($userDM['site']->hasContent()) ? $userDM['site']->toString() : NULL;
                        $userInfo['hair'] = ($userDM['hair']->hasContent()) ? $userDM['hair']->toString() : NULL;
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


echo json_encode($placeResult);
//echo '<pre>';
//var_dump($placeResult);
//echo '</pre>';


eZExecution::cleanExit();
?>