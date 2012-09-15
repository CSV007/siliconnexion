$(document).ready(function() {
    
    // /////////////////////////
    // ISOTOPE
    // /////////////////////////
    $('#searchResult').isotope({
        itemSelector: '.memberSearchResult',
        masonry : {
            columnWidth : 200,
            gutterWidth : 10
        }
    });
    
    // /////////////////////////
    // SHOW DATA ABOUT USER ON CLICK
    // /////////////////////////
    $('#searchResult').delegate( '.fullCardTrigger', 'click', function(){
        var memberSearchResult = $(this).parents('.memberSearchResult');
        $('.memberSearchResult').addClass('withTransitions');
        if (memberSearchResult.hasClass('fullMemberCard')) {
            // Close the card
            memberSearchResult.removeClass('fullMemberCard');
            memberSearchResult.find('.showOnCard').hide();
        } else {
            // Open the card
            memberSearchResult.addClass('fullMemberCard');
            memberSearchResult.find('.showOnCard').show();
            
        }
        $('#searchResult').isotope('reLayout');
    });
    
    // /////////////////////////
    // TRIGGERS FOR SEARCH
    // /////////////////////////
    launchMemberSearch();
    $('.triggerChange').change(function(){
        launchMemberSearch();
    });
    $('.triggerDelayChange').bind('input keyup', function(){
        var $this = $(this);
        var delay = 800; 
        clearTimeout($this.data('timer'));
        $this.data('timer', setTimeout(function(){
            $this.removeData('timer');
            launchMemberSearch();
        }, delay));
    });
    
    
    // Remplace SELECT input by jQuery Chosen
    $('[name="places"]').chosen({
        allow_single_deselect: true    
    });
    $('[name="skill"]').chosen({
        allow_single_deselect: true    
    });
    
    
    // Set a trigger to display secondary filters shell
    
    var secondaryFilterShellOpen = false;
    
    $('.moreFiltersTrigger').click(function(){
        if (secondaryFilterShellOpen) {
            $('.secondaryFiltersShell').slideUp();
            secondaryFilterShellOpen = false;
        } else {
            $('.secondaryFiltersShell').slideDown();
            secondaryFilterShellOpen = true;
        }
    });
    
    
    
    
  
});

function launchMemberSearch() {
    
    $('.searchStatus').html('Searching ...');
    
    var hairColor = [];
    $('[name="hair"]').filter(':checked').each(function(){
        hairColor.push( $(this).val() );
    });
    
    var gender = [];
    $('[name="gender"]').filter(':checked').each(function(){
        gender.push( $(this).val() );
    });
    
    var name = $('[name="name"]').val();
    var places = $('[name="places"]').val();
    var skill = $('[name="skill"]').val();
    
    $.ez( 'lookfor::members', {
        hairColor: hairColor,
        gender: gender,
        name: name,
        skill: skill,
        places: places
    }, function(view) { 
        $('.searchStatus').html('');
        $('#searchResult').isotope( 'remove', $('.memberSearchResult') );
        $('.memberSearchResult').remove();
        var newItems = $(view.content);
        $('#searchResult').isotope( 'insert', newItems );
    });
        
    
    
}