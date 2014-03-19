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
        <input id="app_id" name="app_id" type="text" maxlength="80" value="<?= get_option('optimizely_app_id'); ?>" class="code" />
      </p>
      <p>
        <label for="app_key" style="font-weight:bold;">Application Key</label>
        <br />
        <input id="app_key" name="app_key" type="text" maxlength="80" value="<?= get_option('optimizely_app_key'); ?>" class="code" />
      </p>
      <!--
      <p class="submit"><input type="submit" name="submit_credentials" value="<?php _e('Connect Optimizely &raquo;'); ?>" /></p>
      -->
      
      <button id="connect_optimizely">Connect Optimizely</button>
      
      <h3>Choose a Project</h3>
      <p>We'll include this project code on your site automatically.</p>
      <select id="project_id" name="project_id">
        <?php if (get_option('optimizely_project_id')) { ?>
        <option>Choose your project...</option>
        <option value="<?= get_option('optimizely_project_id') ?>"><?= get_option('optimizely_project_name') ?></option>
        <?php } else { ?>
        <option>Connect Optimizely to choose a project...</option>
        <?php } ?>

      </select>


      <h3>Variation Code</h3>
      <p>Optimizely will use this variation code to change headlines on your site. We've provided code that works with the default theme, but you might want to add or change it to work with your themes and plugins.</p>  
      
      <textarea class="code" rows="5">$('.post-$POST_ID .entry-title a').text("$NEW_TITLE");</textarea>
      
      <p>You can use the variables $POST_ID, $OLD_TITLE, and $NEW_TITLE in your code.</p>


      <script>
        $j = jQuery;
        //$j(document).ready(function() {
        $j("button#connect_optimizely").click(function(event) {
          event.preventDefault();
          $j("select#project_id").html("<option>Loading projects...</option>");
          
          var optly = new OptimizelyAPI($j("#app_id").val(), $j("#app_key").val());
          optly.get('projects', function(response){
            console.log(response);
          
            $j.each(response, function(key, val) {
              $j("select#project_id").append("<option value='" + key + "'>" + val + "</option>");  
            });
          });

        });
      </script>


      <p class="submit"><input type="submit" name="submit_project" value="<?php _e('Select Project &raquo;'); ?>" /></p>


      


    </form>




  </div>
</div>