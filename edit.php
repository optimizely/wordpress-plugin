<?php

$num_variations = 3;

function title_variations_render($post) {

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

add_action( 'add_meta_boxes', 'title_variations_add' );
function title_variations_add()
{
    add_meta_box('optimizely-headlines', 'A/B Test Headlines', title_variations_render, 'post', 'side', 'high');
}

add_action( 'save_post', 'title_variations_save' );
function title_variations_save($post_id)
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
	    }
	}

}


add_action( 'publish_post', 'title_variations_publish' );
function title_variations_publish($post_id)
{
	// Note: this will trigger only when you publish or edit a published post

	global $num_variations;

	if( !current_user_can( 'edit_post' ) ) return;
	if( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;

	// Skip all this if they don't set the first title
	if ( !$_POST['post_title1'] ) return;

	$old_title = $_POST['post_title'];
	$article_url = get_permalink( $post_id );
	$project_id = get_option('optimizely_project_id');
	$experiment_id = get_post_meta($post_id, 'optimizely_experiment_id', true);
	$experiment_data = array(
		'description' => "Wordpress Experiment for $old_title",
		'edit_url' => $article_url
	);

	// API connection	
	$optly = new OptimizelyAPI();

	/*
	 * Create/edit Optimizely experiment
	 */
	if ( !$experiment_id ) {
		// Create experiment
		$experiment_meta = $optly->call('POST','projects/758824777/experiments', $experiment_data);
		$experiment_id = $experiment_meta->id;
	} else {
		// Edit Experiment
		$old_data = $optly->call('GET',"experiments/$experiment_id");
		$new_data = $experiment_data + $old_data;
		$new_data->status = "Paused"; // pause it if it's not already so we can edit
		$experiment_meta = $optly->call('PUT',"experiments/$experiment_id", $new_data);
	}

	// For each variation...
	// TODO: create original variation
	$variation_weight = floor(10000 / $num_variations);
	$leftover_weight = 10000 - $num_variations * $variation_weight;

	for ($i = 1; $i <= $num_variations; $i++) {
		
	    $title_key = "post_title$i";
	    if( isset( $_POST[$titleKey] ) ) {
	        // Save titles
	        $new_title = esc_attr($_POST[$title_key]);
	        update_post_meta( $post_id, $title_key, $new_title);
	
		    // Generate variation code
		    $code = get_option('optimizely_variation_template');
		    $code = str_replace('$NEW_TITLE', $new_title, $code);
		    $code = str_replace('$POST_ID', $post_id, $code);

			/*
			 * Create/edit Optimizely variations
			 */
			$variation_id_key = "optimizely_variation$i_id";
			$variation_id = get_post_meta($post_id, $variation_id_key, true);
			$variation_data = array(
				'description' => "Variation #$i: $new_title",
				'js_component' => $code,
				'weight' => $variation_weight + ($i == 1 ? $leftover_weight : 0) // round up on first variation
			);
			if ( !$variation_id ) {
				// Create variation
				$variation_meta = $optly->call('POST',"experiments/$experiment_id/variations", $variation_data);
				$variation_id = $variation_meta->id;
				update_post_meta( $post_id, $variation_id_key, $variation_id);
			} else {
				// Edit variation
				$old_data = $optly->call('GET',"variations/$variation_id");
				$new_data = $variation_data + $old_data;
				$variation_meta = $optly->call('PUT',"variations/$variation_id", $new_data);
			}
		}
	}
	       
    /*
	 * Start the experiment
	 */
    $experiment_meta->status = "Running";
	$experiment_meta = $optly->call('PUT',"experiments/$experiment_id", $experiment_meta);
}

?>