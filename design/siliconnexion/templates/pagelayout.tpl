{def 
$aboutPage = fetch('content', 'node', hash('node_id', 72))
$apiPage = fetch('content', 'node', hash('node_id', 76))
}

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

    <head>
        <title>Siliconnexion</title>
        <link rel="Shortcut icon" href={"favicon.ico"|ezimage} type="image/x-icon" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

        <link rel="stylesheet" type="text/css" href={'stylesheets/style.css'|ezdesign('single')} media="all" />
        <link rel="stylesheet" type="text/css" href={'stylesheets/chosen.css'|ezdesign('single')} media="all" />
        
        <link rel="stylesheet" type="text/css" href={'stylesheets/jquery.ui.autocomplete.css'|ezdesign('single')} media="all" />
        <link rel="stylesheet" type="text/css" href={'stylesheets/jquery.ui.base.css'|ezdesign('single')} media="all" />
        <link rel="stylesheet" type="text/css" href={'stylesheets/jquery.ui.core.css'|ezdesign('single')} media="all" />
        <link rel="stylesheet" type="text/css" href={'stylesheets/jquery.ui.theme.css'|ezdesign('single')} media="all" />
        <link rel="stylesheet" type="text/css" href={'stylesheets/jquery.ui.all.css'|ezdesign('single')} media="all" />
        
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
        
                </head>
                <body>

                    <div class="mainShell">

                        <div class="header relative">
                            <div class="logo absolute">Logo</div>
                            <div class="absolute userHeaderBlock">
                                {if $current_user.is_logged_in}
                                {$current_user.contentobject.name} - <a href={'/user/logout'|ezurl( 'no', 'full' )}>{'logout'|i18n('cadev')}</a>
                            
                            {else}
                            <a href="{'user/login'|ezurl( 'no', 'full' )}">Login</a>
                            <a href="{'user/register'|ezurl( 'no', 'full' )}">Sign up</a>
                            {/if}
                            </div>
                        </div>
                    
                    <div class="content">

                        {$module_result.content}

                    </div>
                    <div class="clear"></div>
                    <div class="footer">
                        <div class="padder">
                            <ul class="footerMenu horizontalList">
                                <li><a href="{'/'|ezurl('no', 'full')}">People</a></li>
                                <li><a href="{$aboutPage.url_alias|ezurl('no', 'full')}">About</a></li>
                                <li><a href="{$apiPage.url_alias|ezurl('no', 'full')}">API</a></li>
                            </ul>
                            <div class="clear"></div>
                        </div>
                    </div>
                    
</div>

                </body>
                </html>