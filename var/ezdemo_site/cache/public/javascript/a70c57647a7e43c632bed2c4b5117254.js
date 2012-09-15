
(function($) {
    var _rootUrl = '/siliconnexion/index.php/siteadmin/', _serverUrl = _rootUrl + 'ezjscore/', _seperator = '@SEPERATOR$',
        _prefUrl = _rootUrl + 'user/preferences';

    // FIX: Ajax is broken on IE8 / IE7 on jQuery 1.4.x as it's trying to use the broken window.XMLHttpRequest object
    if ( window.XMLHttpRequest && window.ActiveXObject )
        $.ajaxSettings.xhr = function() { try { return new window.ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {} };

    // (static) jQuery.ez() uses jQuery.post() (Or jQuery.get() if post paramer is false)
    //
    // @param string callArgs
    // @param object|array|string|false post Optional post values, uses get request if false or undefined
    // @param function Optional callBack
    function _ez( callArgs, post, callBack )
    {
        callArgs = callArgs.join !== undefined ? callArgs.join( _seperator ) : callArgs;
        var url = _serverUrl + 'call/';
        if ( post )
        {
            var _token = '', _tokenNode = document.getElementById('ezxform_token_js');
            if ( _tokenNode ) _token = _tokenNode.getAttribute('title');
            if ( post.join !== undefined )// support serializeArray() format
            {
                post.push( { 'name': 'ezjscServer_function_arguments', 'value': callArgs } );
                post.push( { 'name': 'ezxform_token', 'value': _token } );
            }
            else if ( typeof(post) === 'string' )// string
            {
                post += ( post ? '&' : '' ) + 'ezjscServer_function_arguments=' + callArgs + '&ezxform_token=' + _token;
            }
            else // object
            {
                post['ezjscServer_function_arguments'] = callArgs;
                post['ezxform_token'] = _token;
            }
            return $.post( url, post, callBack, 'json' );
        }
        return $.get( url + encodeURIComponent( callArgs ), {}, callBack, 'json' );
    };
    _ez.url = _serverUrl;
    _ez.root_url = _rootUrl;
    _ez.seperator = _seperator;
    $.ez = _ez;

    $.ez.setPreference = function( name, value )
    {
        var param = {'Function': 'set_and_exit', 'Key': name, 'Value': value};
            _tokenNode = document.getElementById( 'ezxform_token_js' );
        if ( _tokenNode )
            param.ezxform_token = _tokenNode.getAttribute( 'title' );

        return $.post( _prefUrl, param );
    };

    // Method version, for loading response into elements
    // NB: Does not use json (not possible with .load), so ezjscore/call will return string
    function _ezLoad( callArgs, post, selector, callBack )
    {
        callArgs = callArgs.join !== undefined ? callArgs.join( _seperator ) : callArgs;
        var url = _serverUrl + 'call/';
        if ( post )
        {
            post['ezjscServer_function_arguments'] = callArgs;
            post['ezxform_token'] = jQuery('#ezxformtoken').attr('title');
        }
        else
            url += encodeURIComponent( callArgs );

        return this.load( url + ( selector ? ' ' + selector : '' ), post, callBack );
    };
    $.fn.ez = _ezLoad;
})(jQuery);
        var YUI3_config = {"modules":{}};
YUI( YUI3_config ).add('io-ez', function( Y )
{
    var _rootUrl = '/siliconnexion/index.php/siteadmin/', _serverUrl = _rootUrl + 'ezjscore/', _seperator = '@SEPERATOR$', _configBak,
        _prefUrl = _rootUrl + 'user/preferences';

    // (static) Y.io.ez() uses Y.io()
    //
    // @param string callArgs
    // @param object|undefined c Same format as second parameter of Y.io()
    function _ez( callArgs, c )
    {
        callArgs = callArgs.join !== undefined ? callArgs.join( _seperator ) : callArgs;
        var url = _serverUrl + 'call/';

        // Merge configuration object
        if ( c === undefined )
            c = {on:{}, data: '', headers: {}, method: 'POST'};
        else
            c = Y.merge( {on:{}, data: '', headers: {}, method: 'POST'}, c );

        var _token = '', _tokenNode = document.getElementById('ezxform_token_js');
        if ( _tokenNode ) _token = '&ezxform_token=' + _tokenNode.getAttribute('title');

        // Append function arguments as post param if method is POST
        if ( c.method === 'POST' )
            c.data += ( c.data ? '&' : '' ) + 'ezjscServer_function_arguments=' + callArgs + _token;
        else
            url += encodeURIComponent( callArgs );

        // force json transport
        c.headers.Accept = 'application/json,text/javascript,*/*';

        // backup user success call
        if ( c.on.success !== undefined )
            c.on.successCallback = c.on.success;

        c.on.success = _ioezSuccess;
        _configBak = c;

        return Y.io( url, c );
    }

    function _ioezSuccess( id, o )
    {
        if ( o.responseJSON === undefined )
        {
            // create new object to avoid error in ie6 (and do not use Y.merge since it fails in ff)
            var returnObject = {'responseJSON': Y.JSON.parse( o.responseText ),
                                'readyState': o.readyState,
                                'responseText': o.responseText,
                                'responseXML': o.responseXML,
                                'status': o.status,
                                'statusText': o.statusText
            };
        }
        else
        {
            var returnObject = o;
        }

        var c = _configBak;
        if ( c.on.successCallback !== undefined )
        {
            if ( c.arguments !== undefined )
                c.on.successCallback( id, returnObject, c.arguments );
            else
                c.on.successCallback( id, returnObject, null );
        }
        else if ( window.console !== undefined )
        {
            if ( returnObject.responseJSON.error_text )
                window.console.error( 'Y.ez(): ' + returnObject.responseJSON.error_text );
            else
                window.console.log( 'Y.ez(): ' + returnObject.responseJSON.content );
        }
        _configBak.on.success = _configBak.on.successCallback;
        _configBak.on.successCallback = undefined;
    }

    _ez.url = _serverUrl;
    _ez.root_url = _rootUrl;
    _ez.seperator = _seperator;
    Y.io.ez = _ez;
    Y.io.ez.setPreference = function( name, value )
    {
        var c = {on:{}, data:'', headers: {}, method: 'POST'},
            _tokenNode = document.getElementById( 'ezxform_token_js' );

        c.data = 'Function=set_and_exit&Key=' + encodeURIComponent( name ) + '&Value=' + encodeURIComponent( value );
        if ( _tokenNode )
            c.data += '&ezxform_token=' + _tokenNode.getAttribute( 'title' );
        return Y.io( _prefUrl, c );
    }
}, '3.0.0' ,{requires:['io-base', 'json-parse']});
        /* start: design/standard/javascript/tools/ezjsselection.js */
//
// Created on: <20-Jul-2004 10:54:01 fh>
//
// ## BEGIN COPYRIGHT, LICENSE AND WARRANTY NOTICE ##
// SOFTWARE NAME: eZ Publish
// SOFTWARE RELEASE: 4.1.x
// COPYRIGHT NOTICE: Copyright (C) 1999-2012 eZ Systems AS
// SOFTWARE LICENSE: GNU General Public License v2
// NOTICE: >
//   This program is free software; you can redistribute it and/or
//   modify it under the terms of version 2.0  of the GNU General
//   Public License as published by the Free Software Foundation.
// 
//   This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   GNU General Public License for more details.
// 
//   You should have received a copy of version 2.0 of the GNU General
//   Public License along with this program; if not, write to the Free
//   Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
//   MA 02110-1301, USA.
// ## END COPYRIGHT, LICENSE AND WARRANTY NOTICE ##
//

/*! \file ezjsselection.js
*/


/*!
    Invert the status of checkboxes named 'checkboxname' in form 'formname'.
    If you have a list of checkboxes name them with 'someName[]' in order to toggle them all.
*/
function ezjs_toggleCheckboxes( formname, checkboxname )
{
    with ( formname )
    {
        for ( var i = 0, l = elements.length; i < l; i++ )
        {
            if ( elements[i].type === 'checkbox' && elements[i].name == checkboxname && elements[i].disabled == false )
            {
                if ( elements[i].checked == true )
                {
                    elements[i].checked = false;
                }
                else
                {
                    elements[i].checked = true;
                }
            }
        }
    }
}

/* end: design/standard/javascript/tools/ezjsselection.js */

/* start: design/standard/javascript/lib/ezjslibimagepreloader.js */
//
// Created on: <12-Oct-2004 14:18:58 dl>
//
// ## BEGIN COPYRIGHT, LICENSE AND WARRANTY NOTICE ##
// SOFTWARE NAME: eZ Publish
// SOFTWARE RELEASE: 4.1.x
// COPYRIGHT NOTICE: Copyright (C) 1999-2012 eZ Systems AS
// SOFTWARE LICENSE: GNU General Public License v2
// NOTICE: >
//   This program is free software; you can redistribute it and/or
//   modify it under the terms of version 2.0  of the GNU General
//   Public License as published by the Free Software Foundation.
// 
//   This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   GNU General Public License for more details.
// 
//   You should have received a copy of version 2.0 of the GNU General
//   Public License along with this program; if not, write to the Free
//   Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
//   MA 02110-1301, USA.
// ## END COPYRIGHT, LICENSE AND WARRANTY NOTICE ##
//

/*! \file ezjslibimagepreloader.js
*/

/*!
    \brief
*/

function eZImagePreloader()
{
    this.setupEventHandlers( eZImagePreloader.prototype.onImageLoad,
                             eZImagePreloader.prototype.onImageError,
                             eZImagePreloader.prototype.onImageAbort );
}

eZImagePreloader.prototype.preloadImageList = function( imageList )
{
    this.nImagesCount           = imageList.length;
    this.nProcessedImagesCount  = 0;
    this.nLoadedImagesCount     = 0;
    this.bPreloadDone           = false;

    for ( var i in imageList )
    {
        if ( typeof imageList[i] != 'function' )
        {
            this.preload( imageList[i] );
        }
    }
}

eZImagePreloader.prototype.preload = function( imageFilePath )
{
    var image = new Image;

    image.onload  = this.onImageLoadEvent;
    image.onerror = this.onImageErrorEvent;
    image.onabort = this.onImageAbortEvent;

    image.preloader = this;

    image.bLoaded = false;
    image.bError  = false;
    image.bAbort  = false;

    image.src = imageFilePath;

}

eZImagePreloader.prototype.setupEventHandlers = function( onLoad, onError, onAbort )
{
    this.onImageLoadEvent = onLoad;
    this.onImageErrorEvent = onError;
    this.onImageAbortEvent = onAbort;
}

eZImagePreloader.prototype.onImageLoad = function()
{
    this.bLoaded = true;
    this.preloader.nLoadedImagesCount++;
    this.preloader.onComplete();
}

eZImagePreloader.prototype.onImageError = function()
{
    this.bError = true;
    this.preloader.onComplete();
}

eZImagePreloader.prototype.onImageAbort = function()
{
    this.bAbort = true;
    this.preloader.onComplete();
}

eZImagePreloader.prototype.onComplete = function( imageList )
{
    this.nProcessedImagesCount++;
    if ( this.nProcessedImagesCount == this.nImagesCount )
    {
        this.bPreloadDone = true;
    }
}

function ezjslib_preloadImageList( filepathList )
{
    var preloader = new eZImagePreloader();
    preloader.preloadImageList( filepathList );
}



/* end: design/standard/javascript/lib/ezjslibimagepreloader.js */

/* start: design/admin2/javascript/popupmenu/ezpopupmenu.js */
//
// Created on: <1-Aug-2002 16:45:00 fh>
//
// ## BEGIN COPYRIGHT, LICENSE AND WARRANTY NOTICE ##
// SOFTWARE NAME: eZ Publish
// SOFTWARE RELEASE: 4.1.x
// COPYRIGHT NOTICE: Copyright (C) 1999-2012 eZ Systems AS
// SOFTWARE LICENSE: GNU General Public License v2
// NOTICE: >
//   This program is free software; you can redistribute it and/or
//   modify it under the terms of version 2.0  of the GNU General
//   Public License as published by the Free Software Foundation.
// 
//   This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   GNU General Public License for more details.
// 
//   You should have received a copy of version 2.0 of the GNU General
//   Public License along with this program; if not, write to the Free
//   Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
//   MA 02110-1301, USA.
// ## END COPYRIGHT, LICENSE AND WARRANTY NOTICE ##
//

/*! \file ezpopupmenu.js
*/


/*!
  \brief
  This javascript provides a very cool and flexible DHTML popupmenu.
  In order to use this javascript you must also include ezlibdomsupport.js.


  Features:
  - Multilevel popupmenu
  - Supports all major browsers
  - All HTML code in template
  - Supports context sensitivity for eZ Publish through:
     - String substitution in the href attribute of menuitems.
     - Form submital with string substitution.

  Currenty not supported but possible if requested:
  - Dynamic building of menus based on eZ Publish content.

 Public interface:
ezpopmenu_showTopLevel - This method opens a new top-level popupmenu.
ezpopmenu_showSubLevel - This menu opens a sublevel popupmenu. It does not hide any parent menus.
ezpopmenu_submitForm - This method is used to activate a form.
ezpopmenu_mouseOver - This method should be called by all menuitems when a mouseover event occurs. It currently hides and submenus that should not be shown.
ez_createAArray - Helper method to create associative arrays. It takes an array with an even number of elements and makes a associate element out of every two array elements.

In order to use the popupmenu javascript you need to provide:
1. The HTML/CSS structure for you menu(s)
2. The menuArray javascript array containing the configuration of your popupmenu(s).

eZ Publish provides a default template for this purpose. It is located in popupmenu/popup_menu.tpl. You are encouraged to override this file in the siteacess where you want to use the menu.

 1. Setting up the HTML/CSS structure for your popup menu(s).
 Your menu should be set up completely with all elements. The following requirements apply:
- The outer element should be a "div".
- The css of the outer div must have the following CSS attributes set:
  position: absolute;
  z-index: +1;
  display: none;
- The menuitems must be of type "a".
- Both the menu and the menuitems must be given and "id". This id is used in the menuArray to set up that menu/item.
- Each menuitem must call ezpopmenu_mouseOver or one of the methods spawning a metnu on the mouseover event. The name of the enclosing menu must be given as parameter.
- The menus should be defined in the order they will be shown. In other words, the mainmenu first and then any submenus. This is to ensure the correct visible stack order.

An example example with a menu and a submenu.

 example with a main menu and a submenu:
 -------------------------------------------------------------------------------
<!-- The main menu -->
 <div class="menu" id="mainmenu">
  <a id="menu-main" href="http://www.ez.no" onmouseover="ezpopmenu_mouseOver( 'mainmenu' )" >ez.no</a>
  <a id="menu-substitute" href="#" onmouseover="ezpopmenu_mouseOver( 'mainmenu' )" >Dynamic node view</a>
  <a id="menu-spawn" href="#" onmouseover="ezpopmenu_showSubLevel( 'submenu', 'menu-spawn' )" >Show submenu</a>
 </div>
<!-- The submenu -->
 <div class="menu" id="submenu">
  <a id="submenu-item" href="#" onmouseover="ezpopmenu_submitForm( 'myform' )">Form submitter</a>
 </div>
--------------------------------------------------------------------------------


 2. Setting up the menuArray array containing the popupmenu configuration.
 The menuArray is a multilevel array describing the features of your menus. The structure of the
 menuArray array is flat. This means that each menu is described in the toplevel array.
 Each menu can have the following properties set:
  - "depth" [required]: The depth of the menu. Toplevel menus have depth 0. Menus appearing from a toplevel menu
    have depth 1 etc.
  - "elements": The elements property must be yet another array containing all the menuitems that require string substitution.
    Each item can contain the following properties:
      + "url": The URL that this element should point at. Put the part that should be substituted within "%" symbols.

The following example configures the menu created in step 1.
--------------------------------------------------------------------------------
<script language="JavaScript1.2" type="text/javascript">

 var menuArray = new Array();
 <!-- main menu -->
 menuArray['mainmenu'] = {};
 menuArray['mainmenu']['depth'] = 0;
 menuArray['mainmenu']['elements'] = {};
 menuArray['mainmenu']['elements']['menu-substitute'] = new Array();
 menuArray['mainmenu']['elements']['menu-substitute']['url'] = {'/content/view/%nodeID%'|ezurl};

 <!-- submenu -->
 menuArray['submenu'] = {};
 menuArray['submenu']['depth'] = 1; // this is a first level submenu of ContextMenu

</script>

 <!-- The form submitted by the submenu -->
 {* Remove a node. *}
<form id="myform" method="post" action="someactionhere">
  <!-- Notice that there is autoamatic string translation for the contents of value -->
  <input type="hidden" name="example" value="%nodeID%" />
</form>

--------------------------------------------------------------------------------


 Finally you will need to activate the "mainmenu" menu somehow. This is achieved through a call to ezpopmenu_showToplevel. In the eaxample case links in the setup array containing the string %nodeID% will be substituted by 42.

 example:
 <a onmouseclick="ezpopmenu_showTopLevel( event, 'ContextMenu', ez_createAArray( array( %nodeID%, 42) ) ); return false;">show</a><br />


#################### Developer info ##############################
 This script defines the following global constants/variables:
 EZPOPMENU_OFFSET - Added to the x,y position of the mouse when showing the menu.
 CurrentNodeID - Used to remember the node we are currently showing the menu for. Used by submenus.
 VisibleMenus - An array containing the currently visible menus.
 */

// Global vars used in templates
var CurrentSubstituteValues = -1;

// Create scope to avoid filling global scope more then needed
(function()
{
//POPUPMENU CONSTANTS
var EZPOPMENU_OFFSET = 8, EZPOPMENU_SUBOFFSET = 4, EZPOPMENU_SUBTOPOFFSET = 4;

// POPUPMENU VARS
var CurrentDisableIDList = [];
// Which Menu should be disabled
var CurrentDisableMenuID = -1;

var CurrentDisabledMenusItems = {}, DefaultDisabledMenuItemCSSClass = 'menu-item-disabled';;
// VisibleMenus is an array that holds the names of the currently visible menus
var VisibleMenus = [];

/*!
  Controls the popup offsets of the menu relative to the mouse position.
  Default values are offsetX = 8 and offsetY = 4.
 */
function _initOffsets( offsetX, offsetY )
{
    EZPOPMENU_OFFSET = offsetX;
    EZPOPMENU_SUBTOPOFFSET = offsetY;
}

/*!
 Sets an element of the substitute array.
 This function can be used if you want to change some substitution values dynamically,
 E.g based on the element you chose in the menu.
*/
function _setSubstituteValue( key, value )
{
  if ( CurrentSubstituteValues != -1 )
  {
      CurrentSubstituteValues[key] = value;
  }
}

/*!
   Shows toplevel menu at the current mouseposition + EZPOPMENU_OFFSET.
   'event' This parameter is for the mouse event.
   'menuID' is the identification of the menu to use.
   'substituteValues' is an associative array. The string value of each item in the menu will have they keys, substituted by the value in this array.
   'menuHeader' If the menu has a header it is replaced with this value.
   'disableID' If this id is found in the list of known disabled for this menu the item is disabled.
 */
function _showTopLevel( event, menuID, substituteValues, menuHeader, disableIDList, disableMenuID )
{
    if ( !document.getElementById( menuID ) ) return;
    var mousePos = _mouseHandler( event ); // register new mouse position

    if ( substituteValues != -1 ) // new topmenu
    {
        _hideAll();
        CurrentSubstituteValues = substituteValues;
    }

    if ( disableIDList && disableIDList != -1 )
    {
        CurrentDisableIDList = disableIDList.push !== undefined ? disableIDList : [disableIDList];
    }

    CurrentDisableMenuID = disableMenuID;

    _doItemSubstitution( menuID, menuHeader );

    // make menu visible
    _moveTopLevelOnScreen( menuID, mousePos );
    _makeVisible( menuID );
}

/*!
  Show sublevel menu. The current substitute values are remembered from the last call to
  ezpopmenu_showTopLevel().
  Params:
  event - Just pass the event causing the script to popup.
  menuName - The name of the menu to popup
  overItem - The id of the item that caused the popup. This is used to reposition the menu correctly.
 */
function _showSubLevel( event, menuID, overItem )
{
    if ( !document.getElementById( menuID ) ) return;
    //var mousePos = _mouseHandler( event ); // register new mouse position
    //    ezpopmenu_showTopLevel( event, menuName, -1 );
    _doItemSubstitution( menuID );

    _hideHigher( menuArray[menuID]['depth'] - 1 ); //hide all other submenus

    // make menu visible (show first since width is used in _moveSubLevelOnScreen)
    _makeVisible( menuID );
    _moveSubLevelOnScreen( menuID, overItem );
}

/*!
  Makes a window visible for the user.
  This method also sets the necessary variables in order to make the menu
  disappear when appropriate.
 */
function _makeVisible( menuID )
{
    var el = document.getElementById( menuID );
    if ( el ) el.style.display = 'block';
    VisibleMenus[menuArray[menuID]['depth']] = menuID;

    document.getElementById( menuID ).onmouseover = function() { document.onmousedown = null; }
    document.getElementById( menuID ).onmouseout = function() { document.onmousedown = _hideAll; }
    document.onmousedown = _hideAll;
}

/*!
  Substitute the values of the items in the menu with the items given to the first
  showTopLEvel call.
 */
function _doItemSubstitution( menuID, menuHeader )
{
    // Do URL replace for all items in that menu
    for ( var i in menuArray[menuID]['elements'] )
    {
        var hrefElement = document.getElementById( i );

        if ( !hrefElement )
        {
            continue;
        }

        // href replacement
        var replaceString = menuArray[menuID]['elements'][i]['url'];

        if ( replaceString )
        {
            replaceString = _substituteString( replaceString, CurrentSubstituteValues );
            hrefElement.setAttribute( "href", replaceString );
        }

        // dynamic generation
        var loopingVariable = menuArray[menuID]['elements'][i]['variable'];

        if ( loopingVariable )
        {
            var content = '';

            for ( var localVariableIndex in CurrentSubstituteValues[loopingVariable] )
            {
                var localVariable = CurrentSubstituteValues[loopingVariable][localVariableIndex];
                if ( typeof localVariable != 'object' )
                    continue;

                var partialContent = menuArray[menuID]['elements'][i]['content'];
                for ( var substItem in CurrentSubstituteValues )
                {
                    if ( typeof CurrentSubstituteValues[substItem] != 'object' && typeof CurrentSubstituteValues[substItem] != 'function' )
                    {
                        partialContent = partialContent.replace( substItem, CurrentSubstituteValues[substItem] );
                    }
                }
                for ( var localItem in localVariable )
                {
                    partialContent = partialContent.replace( '%' + localItem + '%', localVariable[localItem] );
                }
                content += partialContent;
            }

            hrefElement.innerHTML = content;
        }

        var disabledForElement = false;
        if ( typeof( menuArray[menuID]['elements'][i]['disabled_for'] ) != 'undefined' && CurrentDisableIDList )
        {
            for ( var disI = 0, disL = CurrentDisableIDList.length; disI < disL; disI++ )
            {
                if ( disabledForElement = menuArray[menuID]['elements'][i]['disabled_for'][ CurrentDisableIDList[disI] ] === 'yes'  )
                    break;
            }
        }

        if ( typeof( menuArray[menuID]['elements'][i]['disabled_class'] ) != 'undefined' &&
              ( disabledForElement ||
              ( CurrentDisableMenuID && hrefElement.id == CurrentDisableMenuID ) ) )
        {
            CurrentDisabledMenusItems[hrefElement.id] = new Array();
            CurrentDisabledMenusItems[hrefElement.id]['className'] = hrefElement.className;
            CurrentDisabledMenusItems[hrefElement.id]['href'] = hrefElement.href;
            CurrentDisabledMenusItems[hrefElement.id]['onmouseover'] = hrefElement.onmouseover;
            CurrentDisabledMenusItems[hrefElement.id]['onclick'] = hrefElement.onclick;

            hrefElement.className = menuArray[menuID]['elements'][i]['disabled_class'];
            hrefElement.setAttribute( "href", '#' );
            hrefElement.onmouseover = "";
            hrefElement.onclick = "";

        }
        else if ( typeof( menuArray[menuID]['elements'][i]['disabled_class'] ) != 'undefined' &&
                  hrefElement.className == menuArray[menuID]['elements'][i]['disabled_class'] )
        {
            // Restore(enable) menu item
            if ( typeof( CurrentDisabledMenusItems[hrefElement.id] ) != 'undefined' )
            {
                hrefElement.className = CurrentDisabledMenusItems[hrefElement.id]['className'];
                hrefElement.href = CurrentDisabledMenusItems[hrefElement.id]['href'];
                hrefElement.onmouseover = CurrentDisabledMenusItems[hrefElement.id]['onmouseover'];
                hrefElement.onclick = CurrentDisabledMenusItems[hrefElement.id]['onclick'];
            }
        }
    }

    // set header
    if ( menuHeader && typeof( menuArray[menuID]['headerID'] ) != 'undefined' )
    {
        var header = document.getElementById( menuArray[menuID]['headerID'] );
        if ( header ) header.innerHTML = menuHeader;
    }
}

function _substituteString( replaceString, substituteValues )
{
    // loop though substitute values and substitute for each of them
    for ( var substItem in substituteValues )
    {
        if ( typeof substituteValues[substItem] != 'object' && typeof substituteValues[substItem] != 'function' )
        {
            replaceString = replaceString.replace( substItem, substituteValues[substItem] );
        }
    }

    return replaceString;
}

/*!
  Reposition a toplevel menu according to the mouse position.
  Makes sure the complete menu is visible in the viewing area.
  The menu is repositioned like most OS's do if it doesn't fit at the normal position: is moved
  to the opposite side of the mouse pointer/menu.
*/
function _moveTopLevelOnScreen( menuID, mousePos )
{
    var menuElement = document.getElementById( menuID ), screenData = _getScreenProperties();
    var newX = 0; var newY = 0;

    // compensate if we are below the screen
    if ( (screenData.ScrollY + screenData.Height) < ( mousePos.y + EZPOPMENU_OFFSET + menuElement.offsetHeight ) )
        newY = mousePos.y - EZPOPMENU_OFFSET - menuElement.offsetHeight;
    // compensate if we are above the top of the screen
    else if ( screenData.ScrollY > EZPOPMENU_OFFSET + mousePos.y )
        newY = screenData.ScrollY;
    else
        newY = mousePos.y + EZPOPMENU_OFFSET;

    // compensate if we are to the right of the screen
    if ( (screenData.ScrollX + screenData.Width) < ( mousePos.x + EZPOPMENU_OFFSET + menuElement.offsetWidth ) )
        newX = mousePos.x - EZPOPMENU_OFFSET - menuElement.offsetWidth;
    // compensate if we are to the left
    else if ( screenData.ScrollX > EZPOPMENU_OFFSET + mousePos.x )
        newX = screenData.ScrollX;
    else
        newX = mousePos.x + EZPOPMENU_OFFSET;
    // reposition menu
    menuElement.style.left = newX + "px";
    menuElement.style.top = newY + "px";
}

function _mouseHandler( e )
{
    if ( !e )e = window.event;

    if ( e.pageX || e.pageY )//DOM
        return { 'x': e.pageX, 'y': e.pageY };
    else if ( e.clientX || e.clientY ) // IE needs special treatment
        return { 'x': e.clientX + document.documentElement.scrollLeft, 'y': e.clientY + document.documentElement.scrollTop };
    return { 'x': 0, 'y': 0 };
}


/*!
  Reposition a toplevel menu according to parent window.
  Makes sure the complete menu is visible in the viewing area.
  The menu is repositioned like most OS's do if it doesn't fit at the normal position: is moved
  to the opposite side of the mouse pointer/menu.
  TODO: If you have several submenus we should store any side adjustment in order to
  always adjust to the same side
*/
function _moveSubLevelOnScreen( menuID, alignItem )
{
    var menuElement = document.getElementById( menuID ), screenData = _getScreenProperties();
    var newX = 0; var newY = 0;

    alignElement = document.getElementById( alignItem );
    parentElement = document.getElementById( VisibleMenus[menuArray[menuID]['depth'] - 1] );

    if ( alignElement && parentElement )
    {
        newX = parseInt( parentElement.style.left ) + menuElement.offsetWidth - EZPOPMENU_SUBOFFSET;
        newY = parseInt( parentElement.style.top ) + alignElement.offsetTop + EZPOPMENU_SUBTOPOFFSET;
    }
    // compensate if we are below the screen
    if ( ( screenData.ScrollY + screenData.Height ) < ( newY + menuElement.offsetHeight ) )
        newY = screenData.ScrollY + screenData.Height - menuElement.offsetHeight;
    // compensate if above the screen
    else if ( screenData.ScrollY > newY )
        newY = screenData.ScrollY;

    // compensate if we are to the right of the screen
    if ( ( screenData.ScrollX + screenData.Width ) < ( newX + menuElement.offsetWidth ) )
    {
        newX = parseInt( parentElement.style.left ) + EZPOPMENU_SUBOFFSET - menuElement.offsetWidth;
    }
    // to the left is impossible

    // reposition menu
    menuElement.style.left = newX + "px";
    menuElement.style.top = newY + "px";
}

/*!
  Submit the form with id formID. All fields of type hidden will have the texts %nodeID%
  and %objectID% replaced with the corresponding real values.
*/
function _submitForm( formID, customSubstitute )
{
    var formElement = document.getElementById( formID );
    if ( formElement )
    {
        // for all children do replacement
        var children = formElement.childNodes,
            origValue = '', resetInputs = [];
        for ( var i = 0, l = children.length; i < l; i++)
        {
            if ( children[i].type == 'hidden' )
            {
                for ( var substItem in CurrentSubstituteValues )
                {
                    origValue = children[i].value;
                    children[i].value = children[i].value.replace( substItem, CurrentSubstituteValues[substItem] );
                    if ( customSubstitute )
                    {
                        for ( var j = 0, jl = customSubstitute.length; j < jl; j += 2 )
                        {
                            children[i].value = children[i].value.replace( '%'+customSubstitute[j]+'%', customSubstitute[j+1] );
                        }
                    }
                    if ( origValue != children[i].value )
                    {
                        resetInputs.push(
                            { 'input': children[i], 'originalValue': origValue }
                        );
                    }
                }
            }
        }
        formElement.submit();

        // restoring the form so that it gets correctly filled
        // if another click from the user occurs
        for( var i = 0; i != resetInputs.length; i++ )
        {
            resetInputs[i].input.value = resetInputs[i].originalValue;
        }
    }
}

/*!
  Hide menu id and all menu's beneath it
 */
function _hide( id )
{
    var level = menuArray[id]['depth'];
    _hideHigher( level - 1 );
}

/*!
  Hide all menus
*/
function _hideAll()
{
    document.onmousedown = null;
    _hideHigher( -1 );
}

/*
 * Hide all menus above 'level'
 */
function _hideHigher( level, el )
{
    for ( var i = level + 1, l = VisibleMenus.length; i < l && VisibleMenus[i] != 'none' ; i++ )
    {
        el = document.getElementById( VisibleMenus[i] );
        if ( el ) el.style.display = 'none';
        VisibleMenus[i] = 'none';
    }
}

/*
 * This method should be called by mouseover for all items in the implementation.
 * The method makes sure that no menus on a lower level are shown.
 */
function _mouseOver( id )
{
    _hideHigher( menuArray[id]['depth'] );
}

/*
 * Helper function to create an associative object. Every two items will be paired as a key and a value.
 */
function _createAArray( flat )
{
    var resultArray = {};

    if ( flat.length % 2 != 0 ) return resultArray;

    for ( var i = 0, l = flat.length; i < l; i += 2 )
    {
        resultArray[flat[i]] = flat[i+1];
    }

    return resultArray;
}

/*
 * Perform subsitution in 'href' and redirect browser to
 * newly created link.
 */
function _SubstituteAndRedirect( href )
{
    // loop though substitute values and substitute for each of them
    for ( var substItem in CurrentSubstituteValues )
    {
        href = href.replace( substItem, CurrentSubstituteValues[substItem] );
    }
    location.href = href;
}

function _getScreenProperties()
{
  // client width and height
  var result = { 'ScrollX': 0, 'ScrollY': 0, 'Height': 0, 'Width': 0 };
  if ( typeof( window.innerWidth ) == 'number' )// all but IE
  {
    result.Width = window.innerWidth;
    result.Height = window.innerHeight;
  }
  else if ( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) )// IE 6
  {
    result.Width = document.documentElement.clientWidth;
    result.Height = document.documentElement.clientHeight;
  }
  else if ( document.body && ( document.body.clientWidth || document.body.clientHeight ) )// IE 4
  {
    result.Width = document.body.clientWidth;
    result.Height = document.body.clientHeight;
  }

  if ( document.body && ( document.body.scrollLeft || document.body.scrollTop ) )// DOM
  {
    result.ScrollY = document.body.scrollTop;
    result.ScrollX = document.body.scrollLeft;
  }
  else if ( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) )// IE6
  {
    result.ScrollY = document.documentElement.scrollTop;
    result.ScrollX = document.documentElement.scrollLeft;
  }
  else if ( typeof( window.pageYOffset ) == 'number' )// Netscape compliant
  {
    result.ScrollY = window.pageYOffset;
    result.ScrollX = window.pageXOffset;
  }

  return result;
}

// Register some functions on global scope
window.ezpopup_SubstituteAndRedirect = _SubstituteAndRedirect;
window.ez_createAArray = _createAArray;
window.ezpopmenu_mouseOver = _mouseOver;
window.ezpopmenu_showTopLevel = _showTopLevel;
window.ezpopmenu_hideAll = _hideAll;
window.ezpopmenu_hide = _hide;
window.ezpopmenu_submitForm = _submitForm;
window.ezpopmenu_showSubLevel = _showSubLevel;

if ( window.menuArray === undefined )
{
    window.menuArray = {};
}

})();// Scope end

/* end: design/admin2/javascript/popupmenu/ezpopupmenu.js */

/* start: design/admin2/javascript/leftmenu_widthcontrol.js */
// jquery code to a allow changing width  on left menu by dragging
jQuery(function( $ )
{
    var leftMenuDrag = {
            elements : false,
            timeout : null,
            down: function( e )
            {
                leftMenuDrag.elements = [ $( '#leftmenu' ), $( '#maincontent' ) ];
                if ( leftMenuDrag.timeout !== null )
                {
                    clearTimeout( leftMenuDrag.timeout );
                    leftMenuDrag.timeout = null;
                }
            },
            up: function( e )
            {
                if ( leftMenuDrag.elements )
                {
                    leftMenuDrag.elements = false;
                    leftMenuDrag.timeout = setTimeout( leftMenuDrag.save, 500 );
                }
            },
            on: function( e )
            {
                if ( leftMenuDrag.elements  )
                {
                    var els = leftMenuDrag.elements, offset = els[0].offset().left, pos = e.pageX, size = pos - offset;
                    if ( size < 20 ) size = 20;
                    els[0].css( 'width', ( size + 3 )  + 'px' );
                    els[1].css( 'marginLeft', ( size ) + 'px' );
                }
            },
            save: function()
            {
                var px  = $( '#leftmenu' ).width();
                var url = $.ez.url.replace( 'ezjscore/', 'user/preferences/' ) + 'set_and_exit/admin_left_menu_size/' + leftMenuDrag.em( px ) + 'em';
                var _token = '', _tokenNode = document.getElementById('ezxform_token_js');
                if ( _tokenNode ) _token = 'ezxform_token=' + _tokenNode.getAttribute('title');
                $.post( url, _token, function(){} );
            },
            em: function( px )
            {
                var test = jQuery('<div style="display: none; font-size: 1em; margin: 0; padding:0; height: auto; line-height: 1; border:0;">&nbsp;</div>').appendTo('#columns'), scale = test.height();
                test.remove();
                return (px / scale).toFixed(8);
            }
    };
    var wl = $('#widthcontrol-links'), wh = $('#widthcontrol-handler');
    if ( wl && wh )
    {
        wl.addClass( 'hide' );
        wh.removeClass( 'hide' ) ;
        wh.bind( 'mousedown', leftMenuDrag.down );
        $( document ).bind('mouseup click', leftMenuDrag.up );
        $( document ).bind('mousemove', leftMenuDrag.on );
        $('#leftmenu').addClass( 'widthcontroled' );
    }
});

/* end: design/admin2/javascript/leftmenu_widthcontrol.js */

/* start: design/admin2/javascript/contentstructuremenu_dynamic.js */
function ContentStructureMenu( params, i18n )
{
    this.cookieName     = "contentStructureMenu";
    this.cookieValidity = 3650; // days
    this.cookie         = params.useCookie ? _getCookie( this.cookieName ) : '';
    this.open           = ( this.cookie )? this.cookie.split( '/' ): [];
    this.autoOpenPath   = params.path;


    this.updateCookie = function()
    {
        if ( !params.useCookie )
            return;
        this.cookie = this.open.join('/');
        expireDate  = new Date();
        expireDate.setTime( expireDate.getTime() + this.cookieValidity * 86400000 );
        _setCookie( this.cookieName, this.cookie, expireDate );
    };

    this.setOpen = function( nodeID )
    {
        if ( jQuery.inArray( '' + nodeID, this.open ) !== -1 )
        {
            return;
        }
        this.open[this.open.length] = nodeID;
        this.updateCookie();
    };

    this.setClosed = function( nodeID )
    {
        var openIndex = jQuery.inArray( '' + nodeID, this.open );
        if ( openIndex !== -1 )
        {
            this.open.splice( openIndex, 1 );
            this.updateCookie();
        }
    };

    this.generateEntry = function( item, lastli, rootNode )
    {
        var liclass = '';
        if ( lastli )
        {
            liclass += ' lastli';
        }
        if ( params.path && ( params.path[params.path.length-1] == item.node_id || ( !item.has_children && jQuery.inArray( item.node_id, params.path ) !== -1 ) ) )
        {
            liclass += ' currentnode';
        }
        var html = '<li id="n'+item.node_id+'"'
            + ( ( liclass )? ' class="' + liclass + '"':
                             '' )
            + '>';
        if ( item.has_children && !rootNode )
        {
            html += '<a class="openclose-open" id="a'
                + item.node_id
                + '" href="#" onclick="this.blur(); return treeMenu.load( this, '
                + item.node_id
                + ', '
                + item.modified_subnode
                +' )"><\/a>';
        }

        var languages = "[";
        var firstLanguage = true;
        for ( var j = 0; j < item.languages.length; j++ )
        {
            if ( params.languages[item.languages[j]] )
            {
                if ( !firstLanguage )
                {
                    languages += ",";
                }
                firstLanguage = false;
                languages += "{locale:'"
                    + item.languages[j].replace(/'/g,"\\'")
                    + "',name:'"
                    + params.languages[item.languages[j]].replace(/'/g,"\\'")
                    + "'}";
            }
        }
        languages += "]";

        var canCreateClasses = false;
        var classes = "[";
        if ( params.createHereMenu != 'disabled' )
        {
            if ( params.createHereMenu == 'full' )
            {
                var classList = item.class_list;

                for ( var j = 0; j < classList.length; j++ )
                {
                    if ( params.classes[classList[j]] )
                    {
                        if ( canCreateClasses )
                        {
                            classes += ",";
                        }
                        canCreateClasses = true;
                        classes += "{classID:'"
                            + classList[j]
                            + "',name:'"
                            + String(params.classes[classList[j]].name).replace(/'/g,"\\'").replace(/>/g,'&gt;').replace(/"/g,'&quot;')
                            + "'}";
                    }
                }
            }
            else
            {
                for ( j in params.classes )
                {
                    if ( canCreateClasses )
                    {
                        classes += ",";
                    }
                    canCreateClasses = true;
                    classes += "{classID:'"
                        + j
                        + "',name:'"
                        + String(params.classes[j].name).replace(/'/g,"\\'").replace(/>/g,'&gt;').replace(/"/g,'&quot;')
                        + "'}";
                }
            }
        }
        classes += "]";

        var classIdentifier = params.classes[item.class_id].identifier;
        var icon = ( params.iconsList[classIdentifier] )? params.iconsList[classIdentifier]: params.iconsList['__default__'];
        if ( params.context != 'browse' && item.node_id > 1 )
        {
            html += '<a class="nodeicon" href="#" onclick="ezpopmenu_showTopLevel( event, \'ContextMenu\', {\'%nodeID%\':'
                + item.node_id
                + ', \'%objectID%\':'
                + item.object_id
                + ', \'%languages%\':'
                + languages
                + ', \'%classList%\':'
                + classes
                + ' }, \''
                + String(item.name).replace(/'/g,"\\'").replace(/>/g,'&gt;').replace(/"/g,'&quot;')
                + '\', '
                + item.node_id
                + ', '
                + ( ( canCreateClasses )? '-1':
                                          '\'menu-create-here\'' )
                + ' ); return false"><img src="'
                + icon
                + '" alt="" title="['
                + params.classes[item.class_id].name.replace(/>/g,'&gt;').replace(/"/g, '&quot;')
                + '] ' + i18n.expand + '" width="16" height="16" /><\/a>';
        }
        else
        {
            html += '<img src="'
                + icon
                + '" alt="" width="16" height="16" />';
        }
        html += '&nbsp;<a class="image-text" href="'
            + ( ( params.action )? params.action + '/' + item.node_id : item.url )
            + '"';

        if ( params.showTips )
        {
            html += ' title="' + i18n.node_id + ': '
                + item.node_id
                + ', ' + i18n.object_id + ': '
                + item.object_id
                + ', ' + i18n.visibility + ': '
                + ( item.is_hidden ? i18n.hidden: ( item.is_invisible ? i18n.hiddenbyparent : i18n.visible ) )
                + '"';
        }

        html += '><span class="node-name-'
            + ( ( item.is_hidden )? 'hidden':
                                    ( item.is_invisible )? 'hiddenbyparent':
                                                           'normal' )
            + '">'
            + item.name
            + '<\/span>';

        if ( item.is_hidden )
        {
            html += '<span class="node-hidden"> (' + i18n.hidden + ')<\/span>';
        }
        else if ( item.is_invisible )
        {
            html += '<span class="node-hiddenbyparent"> (' + i18n.hiddenbyparent + ')<\/span>';
        }

        html += '<\/a>';
        html += '<div id="c'
             + item.node_id
             + '"><\/div>';
        html += '<\/li>';

        return html;
    };

    this.load = function( aElement, nodeID, modifiedSubnode )
    {
        var divElement = document.getElementById('c' + nodeID);

        if ( !divElement )
        {
            return false;
        }

        if ( divElement.className == 'hidden' )
        {
            divElement.className = 'loaded';
            if ( aElement )
            {
                aElement.className = 'openclose-close';
            }

            this.setOpen( nodeID );

            return false;
        }

        if ( divElement.className == 'loaded' )
        {
            divElement.className = 'hidden';
            if ( aElement )
            {
                aElement.className = 'openclose-open';
            }

            this.setClosed( nodeID );

            return false;
        }

        if ( divElement.className == 'busy' )
        {
            return false;
        }

        var url = params.contentTreeUrl + nodeID
            + "/" + modifiedSubnode
            + "/" + params.expiry
            + "/" + params.perm;

        divElement.className = 'busy';
        if ( aElement )
        {
            aElement.className = "openclose-busy";
        }

        var thisThis = this, request = jQuery.ajax({
            'url': url,
            'dataType': 'json',
            'success': function( data, textStatus )
            {
                var html = '<ul>', items = [];
                // Filter out nodes to hide
                for ( var i = 0, l = data.children_count; i < l; i++ )
                {
                    if ( jQuery.inArray( data.children[i].node_id, params.hideNodes ) === -1 )
                    {
                        items.push( data.children[i] );
                    }
                }
                // Generate html content
                for ( var i = 0, l = items.length; i < l; i++ )
                {
                    html += thisThis.generateEntry( items[i], i == l - 1, false );
                }
                html += '<\/ul>';

                divElement.innerHTML += html;
                divElement.className = 'loaded';
                if ( aElement )
                {
                    aElement.className = 'openclose-close';
                }

                thisThis.setOpen( nodeID );
                thisThis.openUnder( nodeID );

                return;
            },
            'error': function( xhr, textStatus, errorThrown )
            {
                divElement.className = 'error';
                if (aElement) aElement.className = 'openclose-error';

                function setErrorText( txt )
                {
                    if (aElement) aElement.title = txt;
                    else divElement.innerHTML = '<span></span>' + txt;
                }

                switch( xhr.status )
                {
                    case 403:
                    {
                      setErrorText( i18n.disabled );
                    } break;
                    case 404:
                    {
                      setErrorText( i18n.not_exist );
                    } break;
                    default:
                    {
                      setErrorText( i18n.internal_error );
                    }
                }
                if (aElement) aElement.onclick = function()
                {
                    return false;
                };
            }
        });

        return false;
    };

    this.openUnder = function( parentNodeID )
    {
        var divElement = document.getElementById( 'c' + parentNodeID );
        if ( !divElement )
        {
            return;
        }

        var ul = divElement.getElementsByTagName( 'ul' )[0];
        if ( !ul )
        {
            return;
        }

        var children = ul.childNodes;
        for ( var i = 0; i < children.length; i++ )
        {
            var liCandidate = children[i];
            if ( liCandidate.nodeType == 1 && liCandidate.id )
            {
                var nodeID = liCandidate.id.substr( 1 ), openIndex = jQuery.inArray( nodeID, this.autoOpenPath );
                if ( this.autoOpen && openIndex !== -1 )
                {
                    this.autoOpenPath.splice( openIndex, 1 );
                    this.setOpen( nodeID );
                }
                if ( jQuery.inArray( nodeID, this.open ) !== -1 )
                {
                    var aElement = document.getElementById( 'a' + nodeID );
                    if ( aElement )
                    {
                        aElement.onclick();
                    }
                }
            }
        }
    };

    this.collapse = function( parentNodeID )
    {
        var divElement = document.getElementById( 'c' + parentNodeID );
        if ( !divElement )
        {
            return;
        }

        var aElements = divElement.getElementsByTagName( 'a' );
        for ( var index in aElements )
        {
            var aElement = aElements[index];
            if ( aElement.className == 'openclose-close' )
            {
                var nodeID        = aElement.id.substr( 1 );
                var subdivElement = document.getElementById( 'c' + nodeID );
                if ( subdivElement )
                {
                    subdivElement.className = 'hidden';
                }
                aElement.className = 'openclose-open';
                this.setClosed( nodeID );
            }
        }

        var aElement = document.getElementById( 'a' + parentNodeID );
        if ( aElement )
        {
            divElement.className = 'hidden';
            aElement.className   = 'openclose-open';
            this.setClosed( parentNodeID );
        }
    };

    // Internal cookie functions
    function _setCookie( name, value, expires, path )
    {
        document.cookie = name + '=' + escape(value) + ( expires ? '; expires=' + expires.toUTCString(): '' ) + '; path='+ (path ? path : '/');
    }

    function _getCookie( name )
    {
        var n = name + '=', c = document.cookie, start = c.indexOf( n ), end = c.indexOf( ";", start );
        if ( start !== -1 )
        {
            return unescape( c.substring( start + n.length, ( end === -1 ? c.length : end ) ) );
        }
        return null;
    }

    function _delCookie( name )
    {
        _setCookie( name, '', ( new Date() - 86400000 ) );
    }
}

/* end: design/admin2/javascript/contentstructuremenu_dynamic.js */

/* start: design/admin2/javascript/fixed_toolbar.js */
YUI(YUI3_config).use('event', 'node-screen', 'node-style', 'selector-css3', 'transition', function (Y) {

    Y.on('domready', function() {
        var toolbar, formY, form, fixed = true, firstInput,
            toolbarHeight, toTop = Y.one('.scroll-to-top');

        var handleScroll = function () {
            if ( !fixed && toolbar.get('docScrollY') > formY ) {
                toolbar.addClass('controlbar-fixed');
                fixed = true;
            } else if ( toolbar.get('docScrollY') > (formY+20) && toTop ) {
                toTop.show('fadeIn', {opacity: 0.6, duration: 0.5});
            } else if ( fixed && toolbar.get('docScrollY') < formY ) {
                toolbar.removeClass('controlbar-fixed');
                fixed = false;
                if ( toTop )
                    toTop.hide('fadeOut', {opacity: 0, duration: 0.5});
            }
        }

        if ( toTop ) {
            toTop.setStyle('opacity', 0);
            toTop.on('click', function (e) {
                toTop.hide('fadeOut', {opacity: 0, duration: 0.5});
            });
        }

        toolbar = Y.one('#controlbar-top');
        form = Y.one('#editform,#ClassEdit');
        if ( form && toolbar ) {
            toolbarHeight = parseInt(toolbar.getStyle('height')) + parseInt(toolbar.getStyle('top'));
            formY = parseInt(form.getY()) - toolbarHeight;
            Y.on('scroll', handleScroll);
            if ( form.get('docScrollY') < formY ) {
                window.scrollTo(0, formY + 1, 0);
                firstInput = form.one('input[type=text]:enabled');
                if ( firstInput )
                    firstInput.focus();
            }
            handleScroll();
        }
    });
});


/* end: design/admin2/javascript/fixed_toolbar.js */

/* start: design/admin2/javascript/ezmodalwindow.js */
YUI(YUI3_config).add('ezmodalwindow', function (Y) {
    /**
     * Constructor of eZModalWindow class
     *
     * @param conf Configuration object containing the following keys
     *              - 'window'   [required] a selector used to get the window container
     *              - 'content'  [default ".window-content"] a relative selector to get the container of the window's content
     *              - 'title'    [default "h2 span"]a relative selector to get the element containing the title text
     *              - 'mask'     [default "#overlay-mask"] a selector to get the mask element
     *              - 'maskOpacity' [default 0.5] the opacity of the mask after animation
     *              - 'close'    [default ".window-close, .window-cancel"] a relative selector of elements that will close the window on click
     *              - 'width'    [default "auto"] the width of the window in pixel
     *              - 'centered' [default "true"] boolean
     *              - 'xy'       [default empty array] array to define the position of the window in pixel, the first element can also be 'centered'
     *              - 'zIndex'   [default 50] the z-index CSS value of the window
     */
    function eZModalWindow(conf) {
        this.conf = Y.merge(eZModalWindow.DEFAULT_CONFIG, conf);

        this.window = Y.one(this.conf.window);
        this.isOpen = false;
        this.closeCallback = {};

        this.mask = null;
        if ( !Y.UA.ie || Y.UA.ie > 6 ) {
            // the mask is ugly in IE6
            this.mask = Y.one(this.conf.mask);
        }
        this.overlay = new Y.Overlay({
            srcNode: this.conf.window,
            width: this.conf.width,
            centered: this.conf.centered,
            visible: false,
            zIndex: this.conf.zIndex
        });

        this.overlay.render();
        this.window.show();

        var that = this;
        this.window.delegate('click', function (e) {
            e.preventDefault();
            that.close();
        }, this.conf.close);

        // close with <ESC>
        Y.one(document).on('keydown', function (e) {
            if ( e.charCode === 27 ) {
                that.close();
            }
        });
    };

    /**
     * Default configuration of eZModalWindow
     */
    eZModalWindow.DEFAULT_CONFIG = {
        content: '.window-content',
        close: '.window-close, .window-cancel',
        title: 'h2 span',
        centered: true,
        xy: [],
        zIndex: 50,
        mask: '#overlay-mask',
        maskOpacity: 0.5
    };

    /**
     * Defines a function to call when the window is closed
     *
     * @param fn a function
     * @param context the context to use when calling the function
     */
    eZModalWindow.prototype.onClose = function (fn, context) {
        this.closeCallback = {
            fn: fn,
            context: context
        };
    };

    /**
     * Opens the window
     */
    eZModalWindow.prototype.open = function () {

        this.overlay.reset();
        if ( this.conf.xy && this.conf.xy.join ) {
            var x = this.conf.xy[0],
                y = this.conf.xy[1];
            if ( x == 'centered' ) {
                x = (Y.DOM.winWidth() - this.overlay.get('width')) / 2;
            }
            y = Y.DOM.docScrollY() + y;
            this.overlay.set('xy', [x, y]);
        }
        if ( this.mask ) {
            this.mask.show();
            var anim = new Y.Anim({
                node: this.mask,
                to: {
                    opacity: this.conf.maskOpacity
                },
                duration: 0.4
            });
            anim.run();
        }
        this.overlay.show();
        this.isOpen = true;
    };

    /**
     * Defines the content of the window
     *
     * @param content String or Node or HTMLElement
     */
    eZModalWindow.prototype.setContent = function (content) {
        this.getContentNode().setContent(content);
    };

    /**
     * Returns the Node used to show the content of the window
     *
     * @return Node
     */
    eZModalWindow.prototype.getContentNode = function () {
        return this.window.one(this.conf.content);
    };

    /**
     * Defines the title of the window
     */
    eZModalWindow.prototype.setTitle = function (title) {
        this.window.one(this.conf.title).setContent(title);
    };

    /**
     * Checks if the content of the window is empty or not
     *
     * @return boolean
     */
    eZModalWindow.prototype.empty = function () {
        return !this.getContentNode().hasChildNodes();
    };

    /**
     * Closes the window
     *
     * @param keepContent boolean
     */
    eZModalWindow.prototype.close = function (keepContent) {
        var that = this;

        this.overlay.hide();
        if ( this.mask ) {
            var anim = new Y.Anim({
                node: this.mask,
                to: {
                    opacity: 0
                },
                duration: 0.2
            });
            anim.run();
            anim.on('end', function () {
                that.mask.hide();
            });
        }
        this.isOpen = false;
        if ( !keepContent ) {
            this.setContent('');
        }

        if ( this.closeCallback.fn && this.closeCallback.fn.call ) {
            var context = this;
            if ( this.closeCallback.context ) {
                context = this.closeCallback.context;
            }
            this.closeCallback.fn.call(context);
        }
    };

    Y.namespace('eZ');

    Y.eZ.ModalWindow = eZModalWindow;

}, '1.0.0', {
    requires: [
        'node', 'overlay', 'dom-base', 'anim'
    ]
});

/* end: design/admin2/javascript/ezmodalwindow.js */

/* start: design/admin2/javascript/ezajaxuploader.js */
YUI(YUI3_config).add('ezajaxuploader', function (Y) {

    /**
     * Constructor of the eZAjaxUploader component
     *
     * @param modalWindow eZModalWindow instance
     * @param conf Configuration object containing the following items
     *          - title String, title of the modal window
     *          - requiredInput [default "input.input-required"] selector to get the required input
     *          - labelErrorClass [default "message-error"] CSS class to add on a label for a required field if this field is filled
     *          - parseJSONErrorText [default "Unable to parse the JSON response."] text to show when the JSON response can not be parsed
     *          - validationErrorText [default "Some required fields are empty."] text to show if a required field is not filled
     *          - validationErrorTextElement [default ".ajaxuploader-error"] selector to get the element where to put the validationErrorText
     *          - errorTemplate [default"'<div class="message-error">%message</div>'"] template to use when displaying a server side error, %message is the variable for the message
     *          - defaultValuedInputClass [default "has-default-value"] CSS class set on input that have a default value
     *          - loading Object containing the following values
     *              - opacity [default 0.2] opacity to set while an AJAX request is being done
     *              - loader [default "#ajaxuploader-loader"] selector to get the GIF loader to show
     *              - zIndex [default 51] z-index style to set on the GIF loader
     *          - target Object containing the hidden fields to post in each POST request
     *          - open Object containing the following values
     *              - action eZJSCore ajax action to use to open the window
     *          - upload Object containing the following values
     *              - action eZJSCore ajax action to use to upload a file
     *              - form selector to get the upload form relative to window's content
     *          - location Object containing the following values
     *              - action eZJSCore ajax action to use to post the location
     *              - form selector to get the location form relative to window's content
     *              - browse selector to get the are where links are used to browse the content tree
     *              - required the error message to display if the user does not select a location
     *          - preview Object containing the following values
     *              - form selector to get the preview form relative to window's content
     *              - callback callback function called at the end of the process
     */
    function eZAjaxUploader(modalWindow, conf) {

        this.conf = Y.merge(eZAjaxUploader.DEFAULT_CONFIG, conf);
        this.modalWindow = modalWindow;

        this.lastMetaData = false;
        this.windowEvents = [];

        var that = this;
        this.defaultAjaxConfiguration = {
            on:{
                start: function () {
                    that.waitAjax();
                },
                end: function () {
                    that.endAjax();
                },
                success: function (transactionId, data) {
                    var input;
                    if ( data.responseJSON.error_text != "" ) {
                        that.displayError(data.responseJSON.error_text);
                    } else {
                        that.lastMetaData = data.responseJSON.content.meta_data;
                        that.modalWindow.setContent(data.responseJSON.content.html);
                    }
                }
            },
            method: 'POST'
        };
    };

    eZAjaxUploader.HANDLER_FIELD_NAME = "AjaxUploadHandlerData";
    eZAjaxUploader.HAD_DEFAULT_VALUE = "had-default-value";

    eZAjaxUploader.DEFAULT_CONFIG = {
        requiredInput: 'input.input-required',
        labelErrorClass: 'message-error',
        validationErrorText: "Some required fields are empty.",
        parseJSONErrorText: "Unable to parse the JSON response.",
        validationErrorTextElement: '.ajaxuploader-error',
        errorTemplate: '<div class="message-error">%message</div>',
        defaultValuedInputClass: 'has-default-value',
        loading:{
            opacity: 0.2,
            loader: "#ajaxuploader-loader",
            zIndex:51
        }
    };

    /**
     * Displays the errorText in the modal window using the template
     * from the configuration
     *
     * @param errorText
     */
    eZAjaxUploader.prototype.displayError = function (errorText) {
        var e = Y.Node.create(this.conf.errorTemplate),
            contentNode = this.modalWindow.getContentNode();
        e.setContent(e.get('innerHTML').replace('%message', errorText));
        contentNode.setContent(e);
    };

    /**
     * Adds an effect while an AJAX request is being done
     */
    eZAjaxUploader.prototype.waitAjax = function () {
        var contentNode = this.modalWindow.getContentNode(),
            xy = contentNode.getXY(),
            height = parseInt(contentNode.getStyle('height')),
            width = parseInt(contentNode.getStyle('width')),
            img = Y.one(this.conf.loading.loader);

        xy[0] = xy[0] + (width/2);
        xy[1] = xy[1] + (height/4);
        contentNode.setStyle('opacity', this.conf.loading.opacity);
        img.show();
        img.setStyle('zIndex', this.conf.loading.zIndex)
        img.setXY(xy)

    };

    /**
     * Stops the effect set by eZAjaxUploader::waitAjax()
     */
    eZAjaxUploader.prototype.endAjax = function () {
        var contentNode = this.modalWindow.getContentNode();

        contentNode.setStyle('opacity', 1);
        Y.one(this.conf.loading.loader).hide();
    };

    /**
     * Defines the events needed by eZAjaxUploader
     */
    eZAjaxUploader.prototype.delegateWindowEvents = function () {

        var contentNode = this.modalWindow.getContentNode();
        var that = this, sub, defaultValues = {};

        var clearDefaultValueHint = function (e) {
            defaultValues[this.generateID()] = this.get('value');
            this.set('value', '');
            this.removeClass(that.conf.defaultValuedInputClass).addClass(eZAjaxUploader.HAD_DEFAULT_VALUE);
        };
        sub = contentNode.delegate(
            'click', clearDefaultValueHint, '.' + this.conf.defaultValuedInputClass
        );
        this.windowEvents.push(sub);

        var restoreDefaultValueHint = function(e) {
            var id = this.generateID();
            if ( this.get('value') == '' && defaultValues[id] ) {
                this.set('value', defaultValues[id]);
                this.addClass(that.conf.defaultValuedInputClass);
            }
        };
        sub = contentNode.delegate(
            'blur', restoreDefaultValueHint, '.' + eZAjaxUploader.HAD_DEFAULT_VALUE
        );
        this.windowEvents.push(sub);

        /**
         * Highlight the submit button by adding the "defaultbutton" class when a location is choosen
         * Using click instead of change to make it works in IE
         */
        var highlightSubmitButton = function (e) {
            contentNode.one('input[type="submit"]').addClass('defaultbutton');
            contentNode.one(that.conf.validationErrorTextElement).setContent('');
        };
        sub = contentNode.delegate(
            'click', highlightSubmitButton, this.conf.location.browse + ' input[type="radio"]'
        );
        this.windowEvents.push(sub);

        /**
         * Highlights the button to submit the upload form
         * as soon as the file input is filled
         * @todo find a way to fix this in IE
         */
        sub = contentNode.delegate('change', highlightSubmitButton, 'input[type="file"]');
        this.windowEvents.push(sub);

        // Internet Explorer does not support delegate() on form submit...
        // http://yuilibrary.com/forum/viewtopic.php?p=7784
        // As a workaround, click on submit button is used to detect
        // form submit...

        /**
         * Makes generic operations on the form to be submited:
         *   - check required fields
         *   - fill the token if necessary  (see ezformtoken)
         *   - add hidden fields
         */
        var formPreSubmit = function (e) {
            var valid = true,
                hiddenPlace = contentNode.one('form p'),
                form = this.ancestor('form', false);

            contentNode.all(that.conf.requiredInput).each(function () {
                if ( !this.get('value') ) {
                    contentNode.all('label[for="' + this.get('id') + '"]').addClass(that.conf.labelErrorClass);
                    valid = false;
                }
            });
            if ( !valid ) {
                contentNode.one(that.conf.validationErrorTextElement).setContent(that.conf.validationErrorText);
                e.halt(true);
                return;
            }
            contentNode.all('label').removeClass(that.conf.labelErrorClass);
            contentNode.all('.has-default-value').set('value', '');
            contentNode.one(that.conf.validationErrorTextElement).setContent("");

            for(var k in that.conf.target) {
                hiddenPlace.append('<input type="hidden" name="' + eZAjaxUploader.HANDLER_FIELD_NAME + '[' + k + ']" value="' + that.conf.target[k] + '" />');
            }
            if ( that.conf.token )
                hiddenPlace.append('<input type="hidden" name="ezxform_token" value="' + that.conf.token + '" />');


        };
        sub = contentNode.delegate(
            'click', formPreSubmit, 'form input[type="submit"]'
        );
        this.windowEvents.push(sub);

        /**
         * Performs the upload
         */
        var upload = function (e) {
            e.halt(true);
            that.waitAjax()
            form = this.ancestor('form', false);

            var c = Y.clone(that.defaultAjaxConfiguration, true),
                ioCompleteSub = false;

            c.form = {
                id: form,
                upload: true
            };
            c.on.success = undefined;

            ioCompleteSub = Y.on('io:complete', function (transactionId, data) {
                // data.responseText is in fact a json encoded hash
                // and the value with 'html' key is url encoded to keep
                // the HTML...
                // see ezjscServerFunctionsAjaxUploader::upload()
                var json;

                ioCompleteSub.detach();
                try {
                    json = Y.JSON.parse(data.responseText);
                } catch (e) {
                    that.displayError(that.conf.parseJSONErrorText);
                    that.endAjax();
                    return;
                }
                if ( json.error_text ) {
                    that.displayError(json.error_text);
                } else {
                    that.modalWindow.setContent(decodeURIComponent(json.html));
                }
                that.endAjax();
            });

            Y.io(Y.io.ez.url + 'call/' + that.conf.upload.action, c);
        };
        sub = contentNode.delegate(
            'click', upload, this.conf.upload.form + ' input[type="submit"]'
        );
        this.windowEvents.push(sub);

        /**
         * Post the location form to set the location
         * of the future content object
         */
        var postLocation = function (e) {
            var c = Y.clone(that.defaultAjaxConfiguration, true),
                form = this.ancestor('form', false),
                radios = contentNode.all('input[type="radio"]'),
                checked = false;

            // forced to loop over radios button because
            // :checked selector does not work in IE
            radios.each(function () {
                if ( this.get('checked') ) {
                    checked = true;
                }
            });

            if ( !checked ) {
                contentNode.one(that.conf.validationErrorTextElement).setContent(that.conf.location.required);
                e.halt(true);
                return;
            }


            c.form = {
                id: form
            };
            Y.io.ez(that.conf.location.action, c);
            e.halt();
        };
        sub = contentNode.delegate(
            'click', postLocation, this.conf.location.form + ' input[type="submit"]'
        );
        this.windowEvents.push(sub);

        /**
         * Set click event in browse area to browse for the location
         * of the future content object
         */
        var browse = function (e) {
            var c = Y.clone(that.defaultAjaxConfiguration, true),
                placeholder = contentNode.one(that.conf.location.browse);

            e.halt(true);
            c.on.success = function (transactionId, data) {
                if ( data.responseJSON.error_text != "" ) {
                    that.displayError(data.responseJSON.error_text);
                } else {
                    that.lastMetaData = data.responseJSON.content.meta_data;
                    placeholder.setContent(data.responseJSON.content.html);
                    contentNode.one('input[type="submit"]').removeClass('defaultbutton').addClass('button');
                }
            };
            c.method = 'GET';
            Y.io.ez(e.currentTarget.getAttribute('href'), c);
        };
        sub = contentNode.delegate(
            'click', browse, this.conf.location.browse + ' a'
        );
        this.windowEvents.push(sub);


        /**
         * Call the preview.callback when the last form is submitted
         */
        var endForm = function (e) {
            e.halt();
            that.conf.preview.callback.call(that);
        };
        sub = contentNode.delegate(
            'click', endForm, this.conf.preview.form + ' input[type="submit"]'
        );
        this.windowEvents.push(sub);

        /**
         * Last event handler submitted before any submit
         * Make sure we cannot click several times on the submit buttons
         */
        var formLastBeforeSubmit = function (e) {
            this.addClass('button-disabled').removeClass('defaultbutton').removeClass('button').set('disabled', 'disabled');
        };
        sub = contentNode.delegate(
            'click', formLastBeforeSubmit, 'form input[type="submit"]'
        );
        this.windowEvents.push(sub);
    };

    /**
     * Detaches the events set by eZAjaxUploader::delegateWindowEvents
     */
    eZAjaxUploader.prototype.detachWindowEvents = function () {
        for (var i = 0; i != this.windowEvents.length; i++) {
            this.windowEvents[i].detach();
        }
    };

    /**
     * Build the POST string to use with the necessary POST parameters
     *
     * @return string
     */
    eZAjaxUploader.prototype.buildPostString = function () {
        var res = '';
        for (var k in this.conf.target) {
            if ( res != '' )
                res += '&';
            res += eZAjaxUploader.HANDLER_FIELD_NAME + '[' + k + ']=' + this.conf.target[k];
        }
        return res;
    };

    /**
     * Cleans the state of the eZAjaxUploader instance
     *    - detach events
     *    - hide the AJAX loader if it's not hidden
     */
    eZAjaxUploader.prototype.cleanup = function () {
        this.detachWindowEvents();
        this.endAjax();
    };

    /**
     * Opens the upload window and delegate events
     */
    eZAjaxUploader.prototype.open = function () {
        var c = Y.clone(this.defaultAjaxConfiguration, true);

        this.delegateWindowEvents();

        this.modalWindow.setTitle(this.conf.title);
        this.modalWindow.open();
        this.modalWindow.onClose(this.cleanup, this);

        c.data = this.buildPostString();
        Y.io.ez(this.conf.open.action, c);
    };

    Y.namespace('eZ');

    Y.eZ.AjaxUploader = eZAjaxUploader;

}, '1.0.0', {
    requires: [
        'ezmodalwindow', 'io-ez', 'io-form', 'io-upload-iframe', 'json-parse'
    ]
});

/* end: design/admin2/javascript/ezajaxuploader.js */

/* start: design/admin2/javascript/ezcollapsiblemenu.js */
YUI(YUI3_config).add('ezcollapsiblemenu', function (Y) {

    Y.namespace('eZ');

    function doTransition(elements, type, endCallback) {
        var el, transitionConf, e;
        for(var i=0; i!=elements.length; i++) {
            el = elements[i];
            e = Y.one(el.selector);
            if ( !e )
                continue;
            transitionConf = {duration: el.duration};
            for(var k in el[type]) {
                if ( el[type][k].call ) {
                    transitionConf[k] = el[type][k].call();
                } else {
                    transitionConf[k] = el[type][k];
                }
            }
            if ( i == 0 && endCallback ) {
                e.transition(transitionConf, endCallback);
            } else {
                e.transition(transitionConf);
            }
        }
    }

    /**
     * Constructor of the eZCollapsibleMenu component
     *
     * @param conf Configuration object containing the following items:
     *        - link: a selector to the element that (un)collapses the menu
     *        - content: array|false, contents of the link (see above) depending on uncollapsed/collapsed state, if false the link is not updated
     *        - collapsed: 0/1, the state of the menu
     *        - beforecollapse (not required): a callback function to call before collapsing
     *        - beforeuncollapse (not required): a callback function to call before uncollapsing
     *        - aftercollapse (not required): a callback function to call after collapsing
     *        - afteruncollapse (not required): a callback function to call after uncollapsing
     *        - callback (not required): a callback function to call when the menu is (un)collapsed.
     *                                   'this' in this function is the instance of eZCollapsibleMenu
     *        - elements: array of objects describing the transition between collapsed and uncollapsed state. each contains:
     *          - selector: a selector to the element to change
     *          - duration: duration in seconds of the transition
     *          - fullStyle: object containing the styles to apply on the element selected by 'selector' when the menu is uncollapsed,
     *                       each style can also be a function.
     *          - collapsedStyle: same as above for collapsed state.
     */
    function eZCollapsibleMenu(conf) {
        var that = this;
        this.conf = conf;

        Y.all(this.conf.link).on('click', function (e) {
            e.preventDefault();
            if ( that.conf.collapsed == 1 ) {
                that.uncollapse();
            } else {
                that.collapse();
            }
        });
    }

    /**
     * Executes the transitions to collapse the area
     */
    eZCollapsibleMenu.prototype.collapse = function () {
        if ( this.conf.beforecollapse ) {
            this.conf.beforecollapse.call(this);
        }
        doTransition(this.conf.elements, 'collapsedStyle', this.conf.aftercollapse);
        this.conf.collapsed = 1;
        this._setLinkContent();
        if ( this.conf.callback ) {
            this.conf.callback.call(this);
        }
    }

    /**
     * Executes the transition to uncollapse the area
     */
    eZCollapsibleMenu.prototype.uncollapse = function () {
        if ( this.conf.beforeuncollapse ) {
            this.conf.beforeuncollapse.call(this);
        }
        doTransition(this.conf.elements, 'fullStyle', this.conf.afteruncollapse);
        this.conf.collapsed = 0;
        this._setLinkContent();
        if ( this.conf.callback ) {
            this.conf.callback.call(this);
        }
    }

    /**
     * Sets the link content based on the configuration
     * @private
     */
    eZCollapsibleMenu.prototype._setLinkContent = function () {
        if ( Y.Lang.isArray(this.conf.content) ) {
            Y.one(this.conf.link).setContent(
                this.conf.content[this.conf.collapsed]
            );
        }
    }

    Y.eZ.CollapsibleMenu = eZCollapsibleMenu;

}, '1.0.0', {
    requires: [
        'transition', 'event'
    ]
});

/* end: design/admin2/javascript/ezcollapsiblemenu.js */

