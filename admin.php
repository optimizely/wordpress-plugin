<?php

// PHP controller for plugin configuration page. The page itself is rendered in config.php

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
  global $optimizely_nonce, $DEFAULT_VARIATION_TEMPLATE;


  if ( isset($_POST['submit']) ) {
    if ( function_exists('current_user_can') && !current_user_can('manage_options') )
      die(__('Cheatin&#8217; uh?'));

    check_admin_referer( $optimizely_nonce );

    $token = $_POST['token'];
    $project_id = $_POST['project_id'];
    $num_variations = $_POST['num_variations'];
    $optimizely_post_types = $_POST['optimizely_post_types'];
    $optimizely_visitor_count = $_POST['optimizely_visitor_count'];
    $project_name = stripcslashes($_POST['project_name']);
    $project_code = stripcslashes($_POST['project_code']);
    $variation_template = stripcslashes($_POST['variation_template']);

    if ( empty($token) ) {
      delete_option('optimizely_token');
    } else {
      update_option('optimizely_token', $token);
    }

    // if ( empty($optimizely_launch_auto) ) {
//       delete_option('optimizely_launch_auto');
//     } else {
//       update_option('optimizely_launch_auto', $optimizely_launch_auto);
//     }

    if ( empty($project_id) ) {
      delete_option('optimizely_project_id');
    } else {
      update_option('optimizely_project_id', $project_id);
    }
    
    if ( empty($num_variations) ) {
      delete_option('num_variations');
    } else {
      update_option('num_variations', $num_variations);
    }

    $optimizely_post_types = $_POST['optimizely_post_types'];
    if(empty($optimizely_post_types)){
      update_option('optimizely_post_types', '');
    }else{
      $post_type_string = '';
      // die(var_dump($optimizely_post_types));
      foreach($optimizely_post_types as $post_type){
        $post_type_string = $post_type_string.$post_type.',';
      }
      update_option('optimizely_post_types', rtrim($post_type_string, ","));
    }

    if ( empty($optimizely_visitor_count) ) {
      delete_option('optimizely_visitor_count');
    } else {
      update_option('optimizely_visitor_count', $optimizely_visitor_count);
    }

    if ( empty($project_name) ) {
      delete_option('optimizely_project_name');
    } else {
      update_option('optimizely_project_name', $project_name);
    }

    if ( empty($project_code) ) {
      delete_option('optimizely_project_code');
    } else {
      update_option('optimizely_project_code', $project_code);
    }

    if ( empty($variation_template) ) {
      update_option('optimizely_variation_template', $DEFAULT_VARIATION_TEMPLATE);
    } else {
      update_option('optimizely_variation_template', $variation_template);
    }

    echo "<div id='message' class='updated fade'><p><strong>Settings saved.</strong></p></div>";

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
  add_menu_page( __('Optimizely'), __('Optimizely'), 'manage_options', 'optimizely-config', 'optimizely_conf',plugin_dir_url( __FILE__ ).'images/optimizely-icon.png');
}
