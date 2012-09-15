{def $lieux = fetch('content', 'list', 
                    hash('parent_node_id', 65))}
<div class="page">
    {attribute_view_gui attribute=$node.data_map.content}
    <hr />
    <h3>Liste des lieux</h3>
    <ul>
        {foreach $lieux as $lieu}
        <li><a href="{concat('api/place/', $lieu.contentobject_id)|ezurl('no', 'full')}">{$lieu.name}</a> - ID : {$lieu.contentobject_id}</li>
        {/foreach}
    </ul>
    
</div>