
<div class="page registerPage">
    <form enctype="multipart/form-data" method="post" action={concat("/content/edit/",$object.id,"/",$edit_version,"/",$edit_language|not|choose(concat($edit_language,"/"),''))|ezurl}>
    
        
        <h1>Edit your profile</h1>
        

        {include uri="design:content/edit_validation.tpl"}

        
        

        {foreach ezini( 'EditSettings', 'AdditionalTemplates', 'content.ini' ) as $additional_tpl}
            {include uri=concat( 'design:', $additional_tpl )}
        {/foreach}

        {include uri="design:content/edit_attribute.tpl"}

        <div class="confirmButtonShell">
        <input class="button" type="submit" name="PublishButton" value="{'Save'|i18n('design/standard/content/edit')}" />
        <input class="hide" type="submit" name="StoreButton" value="{'Store draft'|i18n('design/standard/content/edit')}" />
        <input class="right" type="submit" name="DiscardButton" value="{'Cancel'|i18n('design/standard/content/edit')}" />
        <input type="hidden" name="RedirectURI" value="{'/'|ezurl('no', 'full')}" />
        </div>
        <!-- Left part end -->
        

    </form>
</div>