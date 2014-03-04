<?php


function ab_postbox_render($post) {
	$titleB = get_post_meta( $post->ID, 'post_titleB', true);
	$titleC = get_post_meta( $post->ID, 'post_titleC', true);

	if ( can_create_experiments() ) {
		?>
		<p>
		<label for='titleB'>Variation #1</label>
		<input type="text" name="post_titleB" placeholder="Title B" value="<?= $titleB ?>" id="titleB" autocomplete="off">
		</p>
		<p>
		<label for='titleB'>Variation #2</label>
		<input type="text" name="post_titleC" placeholder="Title C" value="<?= $titleC ?>" id="titleC" autocomplete="off">
		</p>
		<?php
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
	if( !current_user_can( 'edit_post' ) ) return;
	if( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;


	// Make sure your data is set before trying to save it
    if( isset( $_POST['post_titleB'] ) )
        update_post_meta( $post_id, 'post_titleB', esc_attr( $_POST['post_titleB'] ) );
         
    if( isset( $_POST['post_titleC'] ) )
        update_post_meta( $post_id, 'post_titleC', esc_attr( $_POST['post_titleC'] ) );
         
    // Do campaign API magic here

}

?>