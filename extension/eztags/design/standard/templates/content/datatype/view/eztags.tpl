{if $attribute.content.tag_ids|count}
    
    {foreach $attribute.content.tags as $tag}
        {$tag.keyword|wash}{delimiter}, {/delimiter}
    {/foreach}
{/if}