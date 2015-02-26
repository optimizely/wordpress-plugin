<?php
/**
 * @package Optimizely
 * @version 3.2.0
 */
/*
Plugin Name: Optimizely
Plugin URI: http://wordpress.org/extend/plugins/optimizely/
Description: Simple, fast, and powerful.  <a href="http://www.optimizely.com">Optimizely</a> is a dramatically easier way for you to improve your website through A/B testing. Create an experiment in minutes with our easy-to-use visual interface with absolutely no coding or engineering required. Convert your website visitors into customers and earn more revenue today! To get started: 1 ) Click the "Activate" link to the left of this description, 2 ) Sign up for an <a href="http://www.optimizely.com">Optimizely account</a>, and 3 ) Go to the <a href="admin.php?page=optimizely-config">settings page</a>, and enter your Optimizely project code.
Author: Arthur Suermondt, Jon Noronha, Brad Taylor
Version: 3.0.0
Author URI: http://www.optimizely.com/
License: GPL2
*/

/*  Copyright 2015 Optimizely Inc (email: support@optimizely.com)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as 
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

// Constants for default settings
define( 'OPTIMIZELY_DEFAULT_VARIATION_TEMPLATE', '$( ".post-$POST_ID .entry-title a" ).text( "$NEW_TITLE" );' );
define( 'OPTIMIZELY_DEFAULT_VISITOR_COUNT', 10316 );
define( 'OPTIMIZELY_NUM_VARIATIONS', 2 );
define( 'OPTIMIZELY_NONCE', 'optimizely-update-code' );

// Include files are only required on the admin dashboard
if ( is_admin() ) {
	require_once( dirname( __FILE__ ) . '/admin.php' );
	require_once( dirname( __FILE__ ) . '/edit.php' );
}

/**
 * Enqueues Optimizely scripts required by the admin dashboard.
 */
function optimizely_enqueue_scripts() {
	// Core scripts
	wp_enqueue_script( 'jquery' );
	wp_enqueue_script( 'underscore' );
	wp_enqueue_script( 'jquery-ui-core' );
	wp_enqueue_script( 'jquery-ui-tabs' );
	wp_enqueue_script( 'jquery-ui-progressbar' );
	wp_enqueue_script( 'jquery-ui-tooltip' );
	
	wp_enqueue_script( 'optimizely_api', plugins_url( 'optimizely.js', __FILE__ ), array( 'jquery' ) );
	wp_enqueue_script( 'optimizely_editor', plugins_url( 'edit.js', __FILE__ ), array( 'jquery' ) );
	wp_localize_script( 'optimizely_editor', 'wpAjaxUrl', admin_url( 'admin-ajax.php' ) );
	wp_enqueue_script( 'optimizely_config', plugins_url( 'config.js', __FILE__ ), array( 'jquery' ) );
	wp_enqueue_script( 'optimizely_results', plugins_url( 'results.js', __FILE__ ), array( 'jquery', 'jquery-ui-core', 'jquery-ui-tabs','jquery-ui-progressbar','jquery-ui-tooltip', 'underscore' ) );
	wp_localize_script( 'optimizely_editor', 'optimizelySettings', array(
		'token' => get_option( 'optimizely_token' ),
		'projectId' => get_option( 'optimizely_project_id' ),
		'visitorCount' => get_option( 'optimizely_visitor_count', 0 ),
	) );
	
	wp_enqueue_style( 'jquery_ui_styles', plugins_url( 'jquery-ui.css', __FILE__ ) );
	wp_enqueue_style( 'font_awesome_styles', plugins_url( 'font-awesome.min.css', __FILE__ ) );
	wp_enqueue_style( 'optimizely_styles', plugins_url( 'style.css', __FILE__ ) );
}
add_action( 'admin_enqueue_scripts', 'optimizely_enqueue_scripts' );

/**
 * Force Optimizely to load first in the head tag.
 */
function optimizely_add_script() {
	$project_code = get_option( 'optimizely_project_code' );
	if ( ! empty( $project_code ) ) {
		// This cannot be escaped since optimizely_generate_script returns a script tag.
		// The output of this script is fully escaped within the function below.
		echo optimizely_generate_script( $project_code );
	}
}
add_action( 'wp_head', 'optimizely_add_script', -1000 );

/**
 * Generates the Optimizely script tag.
 * @param int $project_code
 * @return string
 */
function optimizely_generate_script( $project_code ) {
	return '<script src="//cdn.optimizely.com/js/' . absint( $project_code ) . '.js"></script>';
}

/**
 * Check capabilites for creating experiments.
 */
function optimizely_can_create_experiments() {
	return get_option( 'optimizely_token', false );
}

?>