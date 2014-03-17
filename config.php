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
      
      <h3>A/B test from WordPress</h3>
      <p>Now you can create A/B tests while writing posts, and Optimizely will automatically create the experiment for you. To set this up, you'll need to register for an API key at the <a href="http://developers.optimizely.com">Optimizely developer portal</a>. Just sign up for a plan, and then copy the following information from your API credentials section.</p>
      <label for="app_id" style="font-weight:bold;">Application ID</label>
      <input id="app_id" name="app_id" type="text" size="60" maxlength="80" value="<?php echo get_option('optimizely_app_id'); ?>" style="font-family: 'Courier New', Courier, mono; font-size: 1.5em;" />
      <label for="app_key" style="font-weight:bold;">Application Key</label>
      <input id="app_key" name="app_key" type="text" size="60" maxlength="80" value="<?php echo get_option('optimizely_app_key'); ?>" style="font-family: 'Courier New', Courier, mono; font-size: 1.5em;" />
      <p class="submit"><input type="submit" name="submit" value="<?php _e('Update configuration &raquo;'); ?>" /></p>

      <?php optimizely_nonce_field($optimizely_nonce) ?>

    </form>
  </div>
</div>