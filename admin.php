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


  if ( isset($_POST['submit']) ) {
    if ( function_exists('current_user_can') && !current_user_can('manage_options') )
      die(__('Cheatin&#8217; uh?'));

    check_admin_referer( $optimizely_nonce );
    $project_code = htmlentities(stripslashes($_POST['project_code']));

    if ( empty($project_code) ) {
      $ms = 'new_code_empty';
      delete_option('optimizely_project_code');
    } else {
      update_option('optimizely_project_code', $project_code);
      $ms = 'new_code_saved';
    }

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

    $messages = array(
      'new_code_empty' => 'Your project code has been cleared. Please enter a new project code to use Optimizely on this site.',
      'new_code_saved' => 'Your project code has been saved. Enjoy using Optimizely!',
      'credentials_saved' => 'Your API credentials have been saved. Now you can set up experiments from the edit post page!',
      'code_empty' => 'Please enter your project code.'
    );

    echo "<div id='message' class='updated fade'><p><strong>Configuration saved.</strong><br \>$messages[$ms]</p></div>";

  }

  include(dirname( __FILE__ ) . '/config.php');

}

function optimizely_admin_warnings() {
  if ( !get_option('optimizely_project_code') && !isset($_POST['submit']) ) {
    function optimizely_warning() {
      echo "
      <div id='optimizely-warning' class='updated fade'><p><strong>".__('Optimizely is almost ready.')."</strong> ".sprintf(__('You must <a href="%1$s">enter your Optimizely project code</a> to begin using Optimizely on your site.'), "admin.php?page=optimizely-config")."</p></div>";
    }
    add_action('admin_notices', 'optimizely_warning');
    return;
  } 
}

function optimizely_admin_menu() {
  add_submenu_page('plugins.php', __('Optimizely Configuration'), __('Optimizely Configuration'), 'manage_options', 'optimizely-config', 'optimizely_conf');
}
