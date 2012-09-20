{def 
$aboutPage = fetch('content', 'node', hash('node_id', 72))
$apiPage = fetch('content', 'node', hash('node_id', 76))
}

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

    <head>
        <title>we are coworkers</title>
        <link rel="Shortcut icon" href={"favicon.ico"|ezimage} type="image/x-icon" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

        <link rel="stylesheet" type="text/css" href={'stylesheets/style.css'|ezdesign('single')} media="all" />
        <link rel="stylesheet" type="text/css" href={'stylesheets/chosen.css'|ezdesign('single')} media="all" />
        
        <link rel="stylesheet" type="text/css" href={'stylesheets/jquery.ui.autocomplete.css'|ezdesign('single')} media="all" />
        <link rel="stylesheet" type="text/css" href={'stylesheets/jquery.ui.base.css'|ezdesign('single')} media="all" />
        <link rel="stylesheet" type="text/css" href={'stylesheets/jquery.ui.core.css'|ezdesign('single')} media="all" />
        <link rel="stylesheet" type="text/css" href={'stylesheets/jquery.ui.theme.css'|ezdesign('single')} media="all" />
        <link rel="stylesheet" type="text/css" href={'stylesheets/jquery.ui.all.css'|ezdesign('single')} media="all" />
        <link href='http://fonts.googleapis.com/css?family=Dosis' rel='stylesheet' type='text/css'>
        {ezscript_load( array( 'ezjsc::jqueryio', 'ezjsc::jquery' ))}
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.21/jquery-ui.min.js" type="text/javascript" charset="utf-8"></script>
        <script type="text/javascript" language="javascript" src="{'javascript/chosen.jquery.min.js'|ezdesign('no')}"></script>
        <script type="text/javascript" language="javascript" src="{'javascript/isotope.min.js'|ezdesign('no')}"></script>
        <script type="text/javascript" language="javascript" src="{'javascript/isotopeHack.js'|ezdesign('no')}"></script>
        
        <script type="text/javascript" language="javascript" src="{'javascript/jquery-ui-1.8.23.custom.min.js'|ezdesign('no')}"></script>
        
        <script type="text/javascript" language="javascript" src="{'javascript/main.js'|ezdesign('no')}"></script>
        <script>
            siteUrl = "{'/'|ezroot('no', 'full')}";
        </script>
        {literal}
        <script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-34855047-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
        {/literal}
                </head>
                <body>

                    
                    
                    <div class="bigHeader">
                    <div class="mainShell">
                        <div class="header relative">
                            <div class="logo absolute">
                                <a href="{'/'|ezurl('no', 'full')}"><img src={'logo.png'|ezimage()} /></a>
                                
                                
                            </div>
                            <div class="absolute userHeaderBlock">
                                {if $current_user.is_logged_in}
                                {$current_user.contentobject.name} - <a href="{concat('content/edit/', $current_user.contentobject_id)|ezurl('no', 'full')}">edit my profile</a> - <a href={'/user/logout'|ezurl( 'no', 'full' )}>{'logout'|i18n('cadev')}</a>
                            
                            {else}
                            <a href="{'user/login'|ezurl( 'no', 'full' )}">Login</a> / 
                            <a href="{'user/register'|ezurl( 'no', 'full' )}">Sign up</a>
                            {/if}
                            </div>
                        </div>
                        
                    </div>
                    </div>
                    {def $me = fetch('content', 'node', hash('node_id', 15))}
                    
                    
                    <div class="mainShell">
                    <div class="content">

                        {$module_result.content}

                    </div>
                    <div class="clear"></div>
                    <div class="footer">
                        <div class="padder">
                            
                            <ul class="footerMenu horizontalList">
                                <li class="right"><a href="https://twitter.com/wearecoworkers_" target="_blank">Twitter</a></li>
                                <li><a href="{'/'|ezurl('no', 'full')}">People</a></li>
                                <li><a href="{$aboutPage.url_alias|ezurl('no', 'full')}">About</a></li>
                                <li><a href="{$apiPage.url_alias|ezurl('no', 'full')}">{$apiPage.name}</a></li>
                            </ul>
                            
                            <div class="clear"></div>
                        </div>
                    </div>
                    
</div>

                </body>
                </html>