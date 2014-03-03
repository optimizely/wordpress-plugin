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

  }

  $messages = array(
    'new_code_empty' => 'Your project code has been cleared. Please enter a new project code to use Optimizely on this site.',
    'new_code_saved' => 'Your project code has been saved. Enjoy using Optimizely!',
    'code_empty' => 'Please enter your project code.'
  );
?>
<?php if ( !empty($_POST['submit'] ) ) : ?>
<div id="message" class="updated fade">
  <p>
    <?php _e('<strong>Configuration saved.</strong><br \>'.$messages[$ms]) ?>
  </p>
</div>
<?php endif; ?>
<div class="wrap">
  <h2><?php _e('Optimizely Configuration'); ?></h2>
  <div class="narrow">
    <form action="" method="post" id="optimizely-conf">
      <h3>About Optimizely</h3>
      <p>Simple, fast, and powerful. <a href="http://www.optimizely.com" target="_blank">Optimizely</a> is a dramatically easier way for you to improve your website through A/B testing. Create an experiment in minutes with our easy-to-use visual interface with absolutely no coding or engineering required. Convert your website visitors into customers and earn more revenue today!</p>
      <h3>Register now</h3>
      <p>Create an account at <a href="http://www.optimizely.com" target="_blank">optimizely.com</a> and start A/B testing today! After creating an account you can come back to this configuration page and set up your WordPress website to use Optimizely.</p>
      <h3>Optimizely project code</h3>
      <p>You can find your project code on your project's experiments page. Go to <a href="https://www.optimizely.com/experiments">optimizely.com/experiments</a>, make sure you've selected the right project and click on &lt;Project Code&gt;, then click on 'Copy to Clipboard'. You can then paste the code in the box below. Your project code should start with "&lt;script" and end with "&lt;/script&gt;".</p>
      <label for="project_code" style="font-weight:bold;">Paste your project code</label>
      <input id="project_code" name="project_code" type="text" size="60" maxlength="80" value="<?php echo get_option('optimizely_project_code'); ?>" style="font-family: 'Courier New', Courier, mono; font-size: 1.5em;" />
      <?php optimizely_nonce_field($optimizely_nonce) ?>
      <p class="submit"><input type="submit" name="submit" value="<?php _e('Update configuration &raquo;'); ?>" /></p>
    </form>
  </div>
</div>
<?php
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
  optimizely_load_menu();
}

function optimizely_load_menu() {
  add_submenu_page('plugins.php', __('Optimizely Configuration'), __('Optimizely Configuration'), 'manage_options', 'optimizely-config', 'optimizely_conf');
}
