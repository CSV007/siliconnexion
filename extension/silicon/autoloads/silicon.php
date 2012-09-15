<?php

class Silicon {
    /* !
      Constructor
     */

    function Silicon() {
        $this->Operators = array(
            'tags_json');
    }

    /* !
      Returns the operators in this class.
     */

    function &operatorList() {
        return $this->Operators;
    }

    /* !

      Return true to tell the template engine that the parameter list
      exists per operator type, this is needed for operator classes
      that have multiple operators.
     */

    function namedParameterPerOperator() {
        return true;
    }

    /* !

      The first operator has two parameters, the other has none.
      See eZTemplateOperator::namedParameterList()
     */

    function namedParameterList() {
        return array(
            'tags_json' => array('parenttagid' => array(
                    'type' => 'string',
                    'required' => true,
                    'default' => ''
                ))
        );
    }

    /* !
      Executes the needed operator(s).
      Checks operator names, and calls the appropriate functions.
     */

    function modify(&$tpl, &$operatorName, &$operatorParameters, &$rootNamespace, &$currentNamespace, &$operatorValue, &$namedParameters) {
        switch ($operatorName) {
            case 'tags_json': {
                    $operatorValue = $this->tags_json($namedParameters['parenttagid']);
                } break;
        }
    }

    function tags_json($parentTagId) {
        $tags = eZTagsObject::fetchByParentID($parentTagId);
        if (count($tags) > 0) {
            $result = array();
            $tagInfo = array();
            foreach ($tags as $tag) {
                $tagInfo['value'] = $tag->ID;
                $tagInfo['label'] = $tag->Keyword;
                $result[] = $tagInfo;
            }
                return json_encode($result);
            
        } else {
            return false;
        }
    }
    

    function convert_url_into_links($text) {

        $text = preg_replace_callback("/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/is", "smallLinks", $text);
        $text = preg_replace("/(^|[\n ])([a-z0-9&\-_\.]+?)@([\w\-]+\.([\w\-\.]+)+)/i", "$1<a href=\"mailto:$2@$3\">$2@$3</a>", $text);
        $text = preg_replace("/@(\w+)/", '<a href="http://www.twitter.com/$1" target="_blank">@$1</a>', $text);
        $text = preg_replace("/\#(\w+)/", '<a href="http://search.twitter.com/search?q=$1" target="_blank">#$1</a>', $text);


        return $text;
    }

    /// privatesection
    var $Operators;

}

function smallLinks($matches) {

    $url = $matches[0];
    $linkText = substr($matches[3], 0, 10) . '...';

    $link = '<a target="_blank" href="' . $url . '">' . $linkText . '</a>';

    return $link;
}

?>