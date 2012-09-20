<div class="page registerPage">
    
    <h1>Sign Up</h1>
    
<form enctype="multipart/form-data"  action={"/user/register/"|ezurl} method="post" name="Register">


{if and( and( is_set( $checkErrNodeId ), $checkErrNodeId ), eq( $checkErrNodeId, true ) )}
    <div class="message-error">
        <h2><span class="time">[{currentdate()|l10n( shortdatetime )}]</span> {$errMsg}</h2>
    </div>
{/if}

{section show=$validation.processed}
<div class="warning">
    <h2>{"There is a little problem"|i18n("design/standard/user")}</h2>
      <ul>
    {section name=UnvalidatedAttributes loop=$validation.attributes show=$validation.attributes}
        <li>{$UnvalidatedAttributes:item.name}: {$UnvalidatedAttributes:item.description}</li>
    {/section}
    </ul>
</div>
{/section}

{section show=count($content_attributes)|gt(0)}
    {section name=ContentObjectAttribute loop=$content_attributes}
    
    
    
    <input type="hidden" name="ContentObjectAttribute_id[]" value="{$ContentObjectAttribute:item.id}" />
    <div class="block attribute{$ContentObjectAttribute:item.id}">
        <label class="attributeName attributeNameTopLabel">{$ContentObjectAttribute:item.contentclass_attribute.name} {if $ContentObjectAttribute:item.is_required}*{/if}</label><div class="labelbreak"></div>
        {attribute_edit_gui attribute=$ContentObjectAttribute:item}
    </div>
    {/section}

    

    <div class="confirmButtonShell">
    {if and( is_set( $checkErrNodeId ), $checkErrNodeId )|not()}
        <input class="button" type="submit" id="PublishButton" name="PublishButton" value="{'Register'|i18n('design/standard/user')}" onclick="window.setTimeout( disableButtons, 1 ); return true;" />
    {else}
        <input class="button" type="submit" id="PublishButton" name="PublishButton" disabled="disabled" value="{'Register'|i18n('design/standard/user')}" onclick="window.setTimeout( disableButtons, 1 ); return true;" />
    {/if}
        <input class="hide" type="submit" id="CancelButton" name="CancelButton" value="{'Discard'|i18n('design/standard/user')}" onclick="window.setTimeout( disableButtons, 1 ); return true;" />
    </div>
{section-else}
    <div class="warning">
        <h2>{"Unable to register new user"|i18n("design/standard/user")}</h2>
    </div>
    <div class="buttonblock">
        <input class="button" type="submit" id="CancelButton" name="CancelButton" value="{'Back'|i18n('design/standard/user')}" onclick="window.setTimeout( disableButtons, 1 ); return true;" />
    </div>
{/section}
</form>

{literal}
<script type="text/javascript">
    function disableButtons()
    {
        document.getElementById( 'PublishButton' ).disabled = true;
        document.getElementById( 'CancelButton' ).disabled = true;
    }
</script>
{/literal}
</div>