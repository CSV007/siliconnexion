<?php

class lookforFunctions extends ezjscServerFunctions {
    
    public static function members() {

        //
        // Init the search parameters
        //
        $paramsMembers = array(
            'SortBy' => array('name', true),
            'ClassFilterType' => 'include',
            'ClassFilterArray' => array('user')
        );

        //
        // Handle "simple" attribute filters
        //
        $criterias = array();
        $attributesFilter = array();

        if (!empty($_POST['hairColor'])) {
            $criterias['hairColor'] = $_POST['hairColor'];
        }
        if (!empty($_POST['gender'])) {
            $criterias['gender'] = $_POST['gender'];
        }
        if (!empty($_POST['name'])) {
            $criterias['name'] = $_POST['name'];
        }
        
        if (!empty($criterias)) {
            $attributesFilter[] = 'and';

            foreach ($criterias as $key => $crit) {
                switch ($key) {
                    case 'hairColor':
                        $attributesFilter[] = array('user/hair', 'in', $crit);
                        break;
                    case 'gender':
                        $attributesFilter[] = array('user/gender', 'in', $crit);
                        break;
                    case 'name';
                        $attributesFilter[] = array('name', 'like', '*' . $crit . '*');
                        break;

                    default:
                        break;
                }
            }
        }
        if (!empty($attributesFilter)) {
            $paramsMembers['AttributeFilter'] = $attributesFilter;
        }



        
        
        //
        // Handle Extended attributes filters
        //
        $extendedFilters = array();
        
        if (!empty($_POST['places'])) {
            $extendedFilters[] = array(
                'callback' => array(
                    'class_name' => 'ORExtendedFilter',
                    'method_name' => 'CreateSqlParts'
                    ),
                'params' => array('AND', array('user/places', array($_POST['places']), 'or'))
                );
        }

        
        if (!empty($_POST['skill'])) {
            $extendedFilters[] = array(
                'callback' => array(
                    'class_name' => 'eZTagsAttributeFilter',
                    'method_name' => 'CreateSqlParts'
                    ),
                'params' => array('tag_id' => array($_POST['skill']))
                );
        }
        


        
        if (!empty($extendedFilters)) {
            
            $paramsMembers['ExtendedAttributeFilter'] = array(
                'id' => 'nxc_extendedfilter',
                'params' => array(
                    'sub_filters' => $extendedFilters
                )
            );
            
        }
        


        $members = eZContentObjectTreeNode::subTreeByNodeID($paramsMembers, array(12, 13));
        $resultCount = count($members);
        
        if ($resultCount == 0) {
            $resultSentence = "We did not find anybody. You are all alone.";
        }
        if ($resultCount == 1) {
            $resultSentence = "We found ONE nice coworker.";
        }
        if ($resultCount > 1) {
            $adjectivesArray = array("nice", "beautiful", "healthy", "working hard", " Justin Bieber fans");
            $resultSentence = "We found " . $resultCount . " coworkers. All of them are " . $adjectivesArray[array_rand($adjectivesArray)] . ".";
        }
        
        
        $result = array();
        $result['resultsCount'] = $resultCount;
        $result['resultsSentence'] = $resultSentence;
        $result['resultsDisplay'] = '';
        // We handle results display
        if (count($members) > 0) {
            $tpl = eZTemplate::factory();
            foreach ($members as $node) {
                $tpl->setVariable('node', $node);
                $result['resultsDisplay'] .= $tpl->fetch('design:searchResults/member.tpl');
            }
        }


        return $result;
    }

}

?>
