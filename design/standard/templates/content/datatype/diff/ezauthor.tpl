{* DO NOT EDIT THIS FILE! Use an override template instead. *}
{def $oldAttr=$diff.old_content
     $newAttr=$diff.new_content}
<div class="attribute-view-diff-old">
<label>{'Version: %old'|i18n( 'design/standard/content/datatype',, hash( '%old', $old ) )}</label>
 <table class="list" cellspacing="0">
    <tr>
        <th>{'Name'|i18n( 'design/standard/content/datatype' )}</th>
        <th>{'Email'|i18n( 'design/standard/content/datatype' )}</th>
    </tr>
    {foreach $oldAttr.content.author_list as $item
             sequence array( 'bglight', 'bgdark' ) as $seq}
        <tr class="{$seq}">
            <td>{$item.name|wash}</td>
            <td>{$item.email|wash( email )}</td>
        </tr>
    {/foreach}
</table>
</div>
<div class="attribute-view-diff-new">
<label>{'Version: %new'|i18n( 'design/standard/content/datatype',, hash( '%new', $new ) )}</label>
 <table class="list" cellspacing="0">
    <tr>
        <th>{'Name'|i18n( 'design/standard/content/datatype' )}</th>
        <th>{'Email'|i18n( 'design/standard/content/datatype' )}</th>
    </tr>
    {foreach $newAttr.content.author_list as $item
             sequence array( 'bglight', 'bgdark' ) as $seq}
        <tr class="{$seq}">
            <td>{$item.name|wash}</td>
            <td>{$item.email|wash( email )}</td>
        </tr>
    {/foreach}
</table>
</div>
