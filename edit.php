<?php

$num_variations = 2;

function title_variations_render($post) {

	global $num_variations;
	$titles = array();
	$contents = "";

	for ($i = 1; $i <= $num_variations; $i++) {
		$variation_id_key = "optimizely_variation$i_id";
		$variation_id = get_post_meta($post->id, "optimizely_variation$i_id", true);

		$key = "post_title$i";
		$titles[$i] = get_post_meta( $post->ID, $key, true);
		$contents .= "<p>";
		$contents .= "<label for='$key'>Variation #$i</label>";
		$contents .= "<input type='text' name='$key' id='$key' class='optimizely_variation' data-variation-id='$variation_id' placeholder='Title $i' value='$titles[$i]'>";
		$contents .= "</p>";
	}

	

	if ( can_create_experiments() ) {
		echo $contents;

		?>
		<div class="not_created">
			<button class="optimizely_create button-primary">Create Experiment</button>
		</div>
		<div class="created">
			<a class="optimizely_toggle_running button button-primary">Start Experiment</a>	
			<p></p>
			<a class="optimizely_view button" target="_blank">View on Optimizely</a>
			<p>Status: <b class="optimizely_experiment_status_text"><?= get_post_meta($post->ID, 'optimizely_experiment_status', true); ?></b>
			<br />
			Results: <a class="optimizely_results" target="_blank">View Results</a></p>
		</div>
		<input type="hidden" id="optimizely_app_id" value="<?= get_option('optimizely_app_id'); ?>" />
		<input type="hidden" id="optimizely_app_key" value="<?= get_option('optimizely_app_key'); ?>" />
		<input type="hidden" id="optimizely_project_id" value="<?= get_option('optimizely_project_id'); ?>" />
		<input type="hidden" id="optimizely_experiment_id" name="optimizely_experiment_id" value="<?= get_post_meta($post->ID, 'optimizely_experiment_id', true); ?>" />
		<input type="hidden" id="optimizely_experiment_status" name="optimizely_experiment_status" value="<?= get_post_meta($post->ID, 'optimizely_experiment_status', true); ?>" />
		<textarea id="optimizely_variation_template" style="display: none"><?= get_option('optimizely_variation_template') ?></textarea>

		<script type="text/javascript">
		editPage();
		</script>
		<?php

	} else {
		?>
		<p>Please configure your API credentials in the <a href="<?php menu_page_url('optimizely-config'); ?>">Optimizely settings page</a>.</p>
		<?php
	}
	/*
	?>
	<script>
		$ = jQuery;
		$('.optimizely_start').click(function() {



		})

	</script>
	<?php
	*/


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
	//if( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;

	for ($i = 1; $i <= $num_variations; $i++) {

	    $key = "post_title$i";
	    if( isset( $_POST[$key] ) ) {
	        // Save titles
	        $new_title = esc_attr($_POST[$key]);
	        update_post_meta( $post_id, $key, $new_title);
	    }
	}

	if( isset( $_POST["optimizely_experiment_id"] ) ) {	
		update_post_meta( $post_id, "optimizely_experiment_id", $_POST["optimizely_experiment_id"]);
		update_post_meta( $post_id, "optimizely_experiment_status", $_POST["optimizely_experiment_status"]);
	}

}

?>