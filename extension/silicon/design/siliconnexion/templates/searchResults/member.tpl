

<div class="memberSearchResult ">
    <div class="searchResultImageShell">
        {attribute_view_gui attribute=$node.data_map.photo image_class=fichemec}
    </div>
    <div class="memberSearchResultNameShell absolute fullCardTrigger pointer">
        <span class="absolute">{attribute_view_gui attribute=$node.data_map.first_name}</span>



    </div>




    <div class="showOnCard hide fullCardName absolute">



        <p class="guyName">{$node.name}</p>

        {if $node.data_map.job.has_content}
        <p>{attribute_view_gui attribute=$node.data_map.job}</p>
        {/if}
        
         {if $node.data_map.skills.has_content}
         <p>Skills: {attribute_view_gui attribute=$node.data_map.skills}</p>
            {/if}
        
        
            {if $node.data_map.places.has_content}
        <p>Places: {attribute_view_gui attribute=$node.data_map.places}</p>
            {/if}


            {if $node.data_map.phone.has_content}
        <p>Phone: {attribute_view_gui attribute=$node.data_map.phone}</p>
            {/if}
            
            {if $node.data_map.site.has_content}
        <p><a href="{$node.data_map.site.content}" target="_blank">Site</a></p>
            {/if}
            
      


        {if $node.data_map.twitter.has_content}
        <p><a target="_blank" href="{$node.data_map.twitter.content}">Twitter</a></p>
        {/if}

        {if $node.data_map.facebook.has_content}
        <p><a target="_blank" href="{$node.data_map.facebook.content}">Facebook</a></p>
        {/if}

        {if $node.data_map.linkedin.has_content}
        <p><a target="_blank" href="{$node.data_map.linkedin.content}">Linkedin</a></p>
        {/if}

        {if $node.data_map.dribbble.has_content}
        <p><a target="_blank" href="{$node.data_map.dribbble.content}">Dribbble</a></p>
        {/if}
        {if $node.data_map.behance.has_content}
        <p><a target="_blank" href="{$node.data_map.behance.content}">BeHance</a></p>
        {/if}

        {if $node.data_map.viadeo.has_content}
        <a target="_blank" href="{$node.data_map.viadeo.content}">Viadeo</a></p>
        {/if}

        <p>









            

           


        </p>

    </div>
    <div class="showOnCard fullCardTrigger closeBigCard absolute">x</div>
</div>