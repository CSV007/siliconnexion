

<div class="memberSearchResult ">
    <div class="searchResultImageShell">
        {attribute_view_gui attribute=$node.data_map.photo image_class=fiche}
    </div>
    <div class="ficheMembreIcons">

{if $node.data_map.site.has_content}
        <a class="whiteSite" href="{$node.data_map.site.content}" target="_blank">www</a>
            {/if}




<a class="whiteMail" ></a>

        {if $node.data_map.twitter.has_content}
        <a class="whiteTwitter" target="_blank" href="{$node.data_map.twitter.content}"></a>
        {/if}
        {if $node.data_map.facebook.has_content}
        <a class="whiteFb" target="_blank" href="{$node.data_map.facebook.content}"></a>
        {/if}
        {if $node.data_map.dribbble.has_content}
        <a class="whiteDribbble" target="_blank" href="{$node.data_map.dribbble.content}"></a>
        {/if}
        {if $node.data_map.behance.has_content}
        <a class="whiteBehance" target="_blank" href="{$node.data_map.behance.content}"></a>
        {/if}

        {if $node.data_map.viadeo.has_content}
        <a class="whiteViadeo" target="_blank" href="{$node.data_map.viadeo.content}"></a>
        {/if}
        {if $node.data_map.linkedin.has_content}
        <a class="whiteLinkedin" target="_blank" href="{$node.data_map.linkedin.content}"></a>
        {/if}

<a class="whiteLink" href="{$node.url_alias|ezurl('no', 'full')}"></a>

        <div class="clear"></div>
        
    </div>
    <div class="memberSearchResultNameShell absolute fullCardTrigger pointer">
        <span class="absolute">{attribute_view_gui attribute=$node.data_map.first_name}</span>



    </div>




    <div class="showOnCard hide fullCardName absolute">



        <p class="guyName">{$node.name}</p>

{if $node.data_map.site.has_content}
        <p><a href="{$node.data_map.site.content}" target="_blank">Website &rarr;</a></p>
            {/if}

        {if $node.data_map.job.has_content}
        <p>{attribute_view_gui attribute=$node.data_map.job}</p>
        {/if}
        
         {if $node.data_map.skills.has_content}
         <p><em>Skills:</em> {attribute_view_gui attribute=$node.data_map.skills}</p>
            {/if}
        
        
            {if $node.data_map.places.has_content}
        <p><em>Places:</em> {attribute_view_gui attribute=$node.data_map.places}</p>
            {/if}


            {if $node.data_map.phone.has_content}
        <p>Phone: {attribute_view_gui attribute=$node.data_map.phone}</p>
            {/if}
            
            
            
      


    </div>
    <div class="showOnCard fullCardTrigger closeBigCard absolute">x</div>
</div>