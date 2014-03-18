<?php
add_action( 'admin_menu', 'optimizely_admin_menu' );
  
optimizely_admin_warnings();

function optimizely_nonce_field($action = -1) { return wp_nonce_field($action); }
$optimizely_nonce = 'optimizely-update-code';

function optimizely_plugin_action_links( $links, $file ) {
  if ( $file == plugin_basename( dirname(__FILE__).'/optimizely.php' ) ) {
    $links[] = '<a href="admin.php?page=optimizely-config">'.__('Settings').'</a>';
  }

  return $links;
}

add_filter( 'plugin_action_links', 'optimizely_plugin_action_links', 10, 2 );

function optimizely_conf() {
  global $optimizely_nonce;


  if ( isset($_POST['submit_credentials']) ) {
    if ( function_exists('current_user_can') && !current_user_can('manage_options') )
      die(__('Cheatin&#8217; uh?'));

    check_admin_referer( $optimizely_nonce );

    $app_id = $_POST['app_id'];
    $app_key = $_POST['app_key'];

    if ( empty($app_id) ) {
      delete_option('optimizely_app_id');
    } else {
      update_option('optimizely_app_id', $app_id);
    }

    if ( empty($app_key) ) {
      delete_option('optimizely_app_key');
    } else {
      update_option('optimizely_app_key', $app_key);
    }

    if ( !empty($app_key) && !empty($app_id) ) {
      $ms = 'credentials_saved';
    }

    echo "<div id='message' class='updated fade'><p><strong>Authentication saved.</strong> Next, choose a project.</p></div>";

  }

  include(dirname( __FILE__ ) . '/config.php');

}

function optimizely_admin_warnings() {
  if ( !get_option('optimizely_project_code') && !isset($_POST['submit']) ) {
    function optimizely_warning() {
      echo "
      <div id='optimizely-warning' class='updated fade'><p><strong>".__('Optimizely is almost ready.')."</strong> ".sprintf(__('You must <a href="%1$s">authenticate and choose a project</a> to begin using Optimizely on your site.'), "admin.php?page=optimizely-config")."</p></div>";
    }
    add_action('admin_notices', 'optimizely_warning');
    return;
  } 
}

function optimizely_admin_menu() {
  add_submenu_page('plugins.php', __('Optimizely Configuration'), __('Optimizely Configuration'), 'manage_options', 'optimizely-config', 'optimizely_conf');
}
