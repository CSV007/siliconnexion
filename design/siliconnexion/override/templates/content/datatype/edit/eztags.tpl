{def $tagsJson = tags_json($attribute.contentclass_attribute.data_int1)}

{def $has_add_access = false()}
{def $root_tag = fetch( tags, tag, hash( tag_id, $attribute.contentclass_attribute.data_int1 ) )}


{def $user_limitations = user_limitations( 'tags', 'add' )}
{if $user_limitations['accessWord']|ne( 'no' )}
{if is_unset( $user_limitations['simplifiedLimitations']['Tag'] )}
{set $has_add_access = true()}
{elseif $root_tag}
{foreach $user_limitations['simplifiedLimitations']['Tag'] as $key => $value}
{if $root_tag.path_string|contains( concat( '/', $value, '/' ) )}
{set $has_add_access = true()}
{break}
{/if}
{/foreach}
{else}
{set $has_add_access = true()}
{set $root_tag = array()}
{foreach $user_limitations['simplifiedLimitations']['Tag'] as $key => $value}
{set $root_tag = $root_tag|append( fetch( tags, tag, hash( tag_id, $value ) ) )}
{/foreach}
{/if}
{/if}

{default attribute_base=ContentObjectAttribute}
{literal}
<script>
    $(document).ready(function() {
        var tagsJson = {/literal}{$tagsJson}{literal};
    $('.TagSuggest{/literal}{$attribute.id}{literal}').autoSuggest(
    tagsJson, 
    {
        selectedItemProp: "name", 
        searchObjProps: "name",
        neverSubmit: true,
        selectionAdded: function(data){ 
            
        }
    });
    });
</script>
{/literal}    


<input type="hidden"  name="suggest_{$attribute_base}_eztags_data_text_{$attribute.id}" value=""  />
<input class="TagSuggest{$attribute.id}" type="text"  name="TagSuggest{$attribute.id}[]" value=""  />




<input id="ezcoa-{if ne( $attribute_base, 'ContentObjectAttribute' )}{$attribute_base}-{/if}{$attribute.contentclassattribute_id}_{$attribute.contentclass_attribute_identifier}" class="tagnames box ezcc-{$attribute.object.content_class.identifier} ezcca-{$attribute.object.content_class.identifier}_{$attribute.contentclass_attribute_identifier} " type="hidden" name="{$attribute_base}_eztags_data_text_{$attribute.id}" value="{$attribute.content.keyword_string|wash}"  />
<input id="ezcoa2-{if ne( $attribute_base, 'ContentObjectAttribute' )}{$attribute_base}-{/if}{$attribute.contentclassattribute_id}_{$attribute.contentclass_attribute_identifier}" class="box tagpids" type="hidden" name="{$attribute_base}_eztags_data_text2_{$attribute.id}" value="{$attribute.content.parent_string|wash}"  />
<input id="ezcoa3-{if ne( $attribute_base, 'ContentObjectAttribute' )}{$attribute_base}-{/if}{$attribute.contentclassattribute_id}_{$attribute.contentclass_attribute_identifier}" class="box tagids" type="hidden" name="{$attribute_base}_eztags_data_text3_{$attribute.id}" value="{$attribute.content.id_string|wash}"  />

<input type="hidden" class="eztags_subtree_limit" name="eztags_subtree_limit-{$attribute.id}" value="{$attribute.contentclass_attribute.data_int1}" />
<input type="hidden" class="eztags_hide_root_tag" name="eztags_hide_root_tag-{$attribute.id}" value="{$attribute.contentclass_attribute.data_int3}" />
<input type="hidden" class="eztags_max_tags" name="eztags_max_tags-{$attribute.id}" value="{if $attribute.contentclass_attribute.data_int4|gt( 0 )}{$attribute.contentclass_attribute.data_int4}{else}0{/if}" />



{/default}