<div class="wrap">
  <h2><?php _e('Optimizely Configuration'); ?></h2>
  <div class="narrow">
    <form action="" method="post" id="optimizely-conf">
      <?php optimizely_nonce_field($optimizely_nonce) ?>
      <h3>About Optimizely</h3>
      <p>Simple, fast, and powerful. <a href="http://www.optimizely.com" target="_blank">Optimizely</a> is a dramatically easier way for you to improve your website through A/B testing. Create an experiment in minutes with absolutely no coding or engineering required. Convert your website visitors into customers and earn more revenue: create an account at <a href="http://www.optimizely.com" target="_blank">optimizely.com</a> and start A/B testing today!</p>
      <h3>Optimizely API tokens</h3>
      <p>Once you create an account, you can find your Application ID and API Key on your dashboard at <a href="https://www.optimizely.com/dashboard">optimizely.com/dashboard</a>. Copy the Application ID from the top of the page, then click "Generate Token" to get an API Key.
      <p>
        <label for="app_id" style="font-weight:bold;">Application ID</label>
        <br />
        <input id="app_id" name="app_id" type="text"  maxlength="80" value="<?php echo get_option('optimizely_app_id'); ?>" style="width: 100%; font-family: 'Courier New', Courier, mono; font-size: 1.5em;" />
      </p>
      <p>
        <label for="app_key" style="font-weight:bold;">Application Key</label>
        <br />
        <input id="app_key" name="app_key" type="text" maxlength="80" value="<?php echo get_option('optimizely_app_key'); ?>" style="width: 100%; font-family: 'Courier New', Courier, mono; font-size: 1.5em;" />
      </p>
      
      <p class="submit"><input type="submit" name="submit_credentials" value="<?php _e('Connect Optimizely &raquo;'); ?>" /></p>


      <?php if (get_option('optimizely_app_key')) { ?>
      <h3>Choose a Project</h3>
      <p>We'll create new experiments in this project.</p>
      <select id="project_id" name="project_id">

      </select>
      <script>
        $j = jQuery;
        $j(document).ready(function() {

          //$j("select#project_id").empty();
          $j.getJSON("https://www.optimizelyapis.com/api/v1/projects/", {
            app_id: $j("#app_id").val(),
            app_key: $j("#app_key").val()
          }, function(response) {

            $j.each(response, function(key, val) {
              $j("select#project_id").append("<option value='" + key + "'>" + val + "</option>");  
            });

          });

        });
      </script>


      <p class="submit"><input type="submit" name="submit_project" value="<?php _e('Select Project &raquo;'); ?>" /></p>

      <?php } ?>

      


    </form>




  </div>
</div>