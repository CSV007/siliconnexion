<?php
/*
Plugin Name: We Are CoWorkers
Plugin URI: http://
Description: This is a plugin for the coworkers community
Version: 0.1
Author: Joël Galeran
Author URI: http://www.joelgaleran.me
License: GPL2
*/
?>
<?php
define('WEARECOWORKERS_PLUGIN_URL', plugin_dir_url( __FILE__ ));

wp_register_style( 'style.css', WEARECOWORKERS_PLUGIN_URL . 'style.css', array(), '0.1' );
wp_enqueue_style( 'style.css');

function wearecoworkers_function($atts) {

	$url_api = 'http://siliconnexion.pauletienney.net/api/place/'.$atts['id_coworking'].'/';

	$json_source = @file_get_contents($url_api);

   	$data = json_decode($json_source);

?>

<div id="wearecoworkers">
	<h2>Voici la liste des Coworkers de <?php echo $data->name ?></h2>

	<ul>
	<?php

	   foreach ($data->users as $users) {
	   	
	   	echo '<li>';
	   	echo '<section class="vcard">';

	   		if($users->picture->url)
		   		echo '<img class="photo" src="'.$users->picture->url.'" width="80" height="80" />';
		   	else 
		   		echo '<img class="photo" src="'.WEARECOWORKERS_PLUGIN_URL.'img/photo.jpg" width="100" height="100" />';

		   	if($users->last_name && $users->first_name)
		   		echo '<h1 class="fn">'.$users->first_name.' '.$users->last_name.'</h1>';

		   	if($users->job)
		   		echo'<span class="category">'.$users->job.'</span>';

		   	echo '<ul class="social">';
			   	if($users->twitter)
			   		echo '<li><a class="url" href="'.$users->twitter.'"><img src="'.WEARECOWORKERS_PLUGIN_URL.'img/icons/twitter.png" width="22" height="22" /></a></li>';
			   	if($users->facebook)
			   		echo '<li><a class="url" href="'.$users->facebook.'"><img src="'.WEARECOWORKERS_PLUGIN_URL.'img/icons/facebook.png" width="22" height="22" /></a></li>';
			   	//if($users->viadeo)
			   		//echo '<li><a class="url" href="'.$users->viadeo.'"><img src="'.WEARECOWORKERS_PLUGIN_URL.'img/icons/default.png" width="16" height="16" /></a></li>';
			   	if($users->linkedin)
			   		echo '<li><a class="url" href="'.$users->linkedin.'"><img src="'.WEARECOWORKERS_PLUGIN_URL.'img/icons/linkedin.png" width="22" height="22" /></a></li>';
			   	if($users->behance)
			   		echo '<li><a class="url" href="'.$users->behance.'"><img src="'.WEARECOWORKERS_PLUGIN_URL.'img/icons/behance.png" width="22" height="22" /></a></li>';
			   	//if($users->dribbble)
			   		//echo '<li><a class="url" href="'.$users->dribbble.'"><img src="'.WEARECOWORKERS_PLUGIN_URL.'img/icons/dribble.png" width="16" height="16" /></a></li>';
		   	echo '</ul>';

		   	if($users->site)
		   		echo '<a class="url website" href="'.$users->site.'">Site Web</a>';

		   	echo '</section>';
	   	echo '</li>';

	   }

	 ?>
	</ul>
</div>
<?php
}
add_shortcode('wearecoworkers', 'wearecoworkers_function');