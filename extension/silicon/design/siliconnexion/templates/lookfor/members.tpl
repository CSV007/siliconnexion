<script type="text/javascript" language="javascript" src="{'javascript/lookforMembers.js'|ezdesign('no')}"></script>
<div class="searchFilter">
    <div class="mainFiltersShell relative">
        <div class="left searchFilterBlock filterInputShell">
            <input class="filterInput triggerDelayChange" placeholder="Name" type="text" value="" name="name" autocomplete="off"/>
        </div>
        <div class="left searchFilterBlock">
            <select name="places" class="triggerChange" data-placeholder="Working Place">
                <option value></option>
                {foreach $places as $place}
                <option value="{$place.contentobject_id}">{$place.name}</option>
                {/foreach}
            </select>
        </div>
        <div class="left searchFilterBlock">
            <select name="skill" class="triggerChange" data-placeholder="Skill">
                <option value></option>
                {foreach $skillsTags as $tag}
                <option value="{$tag.id}">{$tag.keyword}</option>
                {/foreach}
            </select>
        </div>
        <div class="left searchFilterBlock horizontalFilter">
            And rather 
            <input class="triggerChange" type="checkbox" name="gender" value="0" id="femaleCrit" /> <label for="femaleCrit">Female</label>
            <input class="triggerChange" type="checkbox" name="gender" value="1" id="maleCrit" />  <label for="femaleCrit">Male</label>
        </div>
        <div class="clear"></div>
        <span class="absolute moreFiltersTrigger link">+</span>
    </div>
    <div class="secondaryFiltersShell relative hide">
        <div class="left searchFilterBlock">
            Hair Color<br />
            <input class="triggerChange" type="checkbox" name="hair" value="0" /> Bald<br />
            <input class="triggerChange" type="checkbox" name="hair" value="1" /> Black<br />
            <input class="triggerChange" type="checkbox" name="hair" value="2" /> Blond<br />
            <input class="triggerChange" type="checkbox" name="hair" value="3" /> Brown<br />
            <input class="triggerChange" type="checkbox" name="hair" value="4" /> Ginger<br />
            <input class="triggerChange" type="checkbox" name="hair" value="5" /> Salt &amp; Pepper<br />
        </div>
        
        <div class="clear"></div>
    </div>
</div>
<div class="searchStatusShell">
    <span class="searchResults hide"></span>
    <span class="searchStatus "><img src="{'ajax-loader.gif'|ezimage('no', 'full')}" /> Searching...</span>    
</div>   

<div id="searchResult" class="relative"></div>
<div class="clear"></div>
