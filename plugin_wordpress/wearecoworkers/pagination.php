<?php


global $wp_query, $paged;
$current = ($paged > 1) ? $paged : 1;

$pagination = array(
	'base' => get_pagenum_link(1).'%_%',
	'format' => 'page/%#%/',
	'total' => round( $data->usersCount / 3 ),
	'current' => $current,
	'show_all' => true,
	'type' => 'array',
	'next_text' => 'Suivant',
	'prev_text' => '&lt;'
);

/*if( !empty($wp_query->query_vars['s']) )
	$pagination['add_args'] = array( 's' => str_replace( ' ' , '+', get_query_var( 's' ) ) );*/

$pagination = paginate_links( $pagination );
//$total = ($wp_query->max_num_pages > 1) ? $wp_query->max_num_pages : 1;
$total = round( $data->usersCount / 10 );

if ($current == 1) 
	$range = 18;
elseif ($current == 2) 
	$range = 16;
elseif ($current < 4)
	$range=12;
elseif ($current > 99)
	$range = 6; 
else
	$range=8;


?>