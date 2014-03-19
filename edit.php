<?php

$num_variations = 3;

function ab_postbox_render($post) {

	global $num_variations;
	$titles = array();
	$contents = "";

	for ($i = 1; $i <= $num_variations; $i++) {
		$key = "post_title$i";
		$titles[$i] = get_post_meta( $post->ID, $key, true);
		$contents .= "<p>";
		$contents .= "<label for='$key'>Variation #$i</label>";
		$contents .= "<input type='text' name='$key' id='$key' placeholder='Title $i' value='$titles[$i]'>";
		$contents .= "</p>";
	}

	if ( can_create_experiments() ) {
		echo $contents;
	} else {
		?>
		<p>Please configure your API credentials in the <a href="<?php menu_page_url('optimizely-config'); ?>">Optimizely settings page</a>.</p>
		<?php
	}
	
}

add_action( 'add_meta_boxes', 'ab_postbox_add' );
function ab_postbox_add()
{
    add_meta_box('optimizely-headlines', 'A/B Test Headlines', ab_postbox_render, 'post', 'side', 'high');
}

add_action( 'save_post', 'ab_postbox_save' );
function ab_postbox_save($post_id)
{
	global $num_variations;

	if( !current_user_can( 'edit_post' ) ) return;
	if( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;

	for ($i = 1; $i <= $num_variations; $i++) {
		
	    $key = "post_title$i";
	    if( isset( $_POST[$key] ) ) {
	        // Save titles
	        $new_title = esc_attr($_POST[$key]);
	        update_post_meta( $post_id, $key, $new_title);
	
		    // Variation code
		    $code = get_option('optimizely_variation_template');
		    $code = str_replace('$NEW_TITLE', $new_title, $code);
		    $code = str_replace('$POST_ID', $post_id, $code);

			// Create or edit variations on Optimizely
			if ( get_post_meta($post_id, 'optimizely_experiment_created', true) ) {

				// Edit variations
				

			} else {

				// Create variations
				
			}




		}



	}
	       
    





}

add_action('publish_post', 'ab_create_experiment');
function ab_create_experiment($post_id) {



}


?>