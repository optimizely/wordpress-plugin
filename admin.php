<?php

// PHP controller for plugin configuration page. The page itself is rendered in config.php  
function optimizely_nonce_field( $action = -1 ) {
	return wp_nonce_field( $action );
}
$optimizely_nonce = 'optimizely-update-code';

function optimizely_admin_warnings() {
	if ( ! get_option( 'optimizely_project_code' ) && ! isset( $_POST['submit'] ) ) :
		?>
		<div id="optimizely-warning" class="updated fade">
			<p><strong><?php esc_html_e( 'Optimizely is almost ready.', 'optimizely' )</strong> 
			<?php sprintf( __( 'You must <a href="%1$s">authenticate and choose a project</a> to begin using Optimizely on your site.', 'optimizely' ), 'admin.php?page=optimizely-config') ?>
			</p>
		</div>
		<?php
	endif;
}
add_action( 'admin_notices', 'optimizely_admin_warnings' );

function optimizely_admin_menu() {
	add_menu_page( __( 'Optimizely', 'optimizely' ), __( 'Optimizely', 'optimizely' ), 'manage_options', 'optimizely-config', 'optimizely_conf', plugin_dir_url( __FILE__ ) . 'images/optimizely-icon.png' );
}
add_action( 'admin_menu', 'optimizely_admin_menu' );

function optimizely_plugin_action_links( $links, $file ) {
	if ( $file == plugin_basename( dirname(__FILE__) . '/optimizely.php' ) ) {
		$links[] = '<a href="admin.php?page=optimizely-config">' . __( 'Settings', 'optimizely' ) . '</a>';
	}
	
	return $links;
}
add_filter( 'plugin_action_links', 'optimizely_plugin_action_links', 10, 2 );

function optimizely_conf() {
	global $optimizely_nonce, $DEFAULT_VARIATION_TEMPLATE;
	
	if ( isset( $_POST['submit'] ) ) {
		if ( ! current_user_can ('manage_options') ) {
			die( __( 'Cheatin&#8217; uh?', 'optimizely' )  );
		}
		
		check_admin_referer( $optimizely_nonce );

		$token = sanitize_text_field( $_POST['token'] );
		$project_id = sanitize_text_field( $_POST['project_id'] );
		$num_variations = sanitize_text_field( $_POST['num_variations'] );
		$optimizely_post_types = array_map( $_POST['optimizely_post_types'], 'sanitize_text_field' );
		$optimizely_visitor_count = sanitize_text_field( $_POST['optimizely_visitor_count'] );
		$project_name = sanitize_text_field( stripcslashes( $_POST['project_name'] ) );
		$project_code = sanitize_text_field( stripcslashes( $_POST['project_code'] ) );
		$variation_template = sanitize_text_field( stripcslashes( $_POST['variation_template' ] ) );

		if ( empty( $token ) ) {
			delete_option( 'optimizely_token' );
		} else {
			update_option( 'optimizely_token', $token );
		}

		if ( empty( $project_id ) ) {
			delete_option( 'optimizely_project_id' );
		} else {
			update_option( 'optimizely_project_id', $project_id );
		}

		if ( empty( $num_variations ) ) {
			delete_option( 'num_variations' );
		} else {
			update_option( 'num_variations', $num_variations );
		}

		if ( empty( $optimizely_post_types ) ) {
			update_option( 'optimizely_post_types', '' );
		} else {
			$post_type_string = '';
			foreach ( $optimizely_post_types as $post_type ) {
				$post_type_string = $post_type_string . $post_type . ',';
			}
			update_option( 'optimizely_post_types', rtrim( $post_type_string, ',' ) );
		}

		if ( empty( $optimizely_visitor_count ) ) {
			delete_option( 'optimizely_visitor_count');
		} else {
			update_option( 'optimizely_visitor_count', $optimizely_visitor_count );
		}

		if ( empty( $project_name ) ) {
			delete_option( 'optimizely_project_name' );
		} else {
			update_option( 'optimizely_project_name', $project_name );
		}

		if ( empty( $project_code ) ) {
			delete_option( 'optimizely_project_code' );
		} else {
			update_option( 'optimizely_project_code', $project_code );
		}

		if ( empty( $variation_template ) ) {
			update_option( 'optimizely_variation_template', $DEFAULT_VARIATION_TEMPLATE );
		} else {
			update_option( 'optimizely_variation_template', $variation_template );
		}

		?>
		<div id="message" class="updated fade"><p><strong><?php esc_html_e( 'Settings saved', 'optimizely' ) ?>.</strong></p></div>
		<?php
	}

	include( dirname( __FILE__ ) . '/config.php' );
}