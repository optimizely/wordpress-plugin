<div class="wrap">
  <script>
    jQuery(function() {
      jQuery( "#optimizely-tabs" ).tabs();
      jQuery( document ).tooltip({
          track: true
        });
        <?php 
          if(get_option('optimizely_token') && get_option('optimizely_project_id')){
            echo 'optimizelyResultsPage("'.get_option('optimizely_token').'","'.get_option('optimizely_project_id').'",'.get_option('optimizely_visitor_count').');';
          }
        ?>

      
    });
    </script>
  <div id="optimizely-tabs">
    <ul class="tabs-header" id="tabs-header">
        <li><a href="#tabs-1">Results</a></li>
        <li><a href="#tabs-2">Configuration</a></li>
    </ul>
    <div id="tabs-1">
        <h2>Wordpress Headline Results</h2>
        <p>This is a list of all of the experiments that are running headline tests.<p>
        <div id="successMessage">

        </div>
        <!-- <div class="button" id="launchWinners">Launch Winners</div> -->
        <div id="results_list">
            <div id="ready">
                <h2>Ready</h2>


            </div>
            <div id="stillwaiting">
                <h2>Almost There!</h2>

            </div>
            <div class="loading" id="loading">
                Loading Results.....<br>
                <img src="<?php echo plugin_dir_url( __FILE__ ).'images/ajax-loader.gif' ?>" />
                
            </div>

            <div id="noresults">
              <h3>No Results Ready!</h3>
              <p>When you create headline experiments in wordpress you will see those results here</p>
            </div>
        </div>  

    </div>
    <div id="tabs-2">
        <h2><?php _e('Optimizely Configuration'); ?></h2>
        <div class="narrow">
            <form action="" method="post" id="optimizely-conf">
              <?php optimizely_nonce_field($optimizely_nonce) ?>
              <h3>About Optimizely</h3>
              <p>Simple, fast, and powerful. <a href="http://www.optimizely.com" target="_blank">Optimizely</a> is a dramatically easier way for you to improve your website through A/B testing. Create an experiment in minutes with absolutely no coding or engineering required. Convert your website visitors into customers and earn more revenue: create an account at <a href="http://www.optimizely.com" target="_blank">optimizely.com</a> and start A/B testing today!</p>
              <h3>Optimizely API tokens</h3>
              <p>Once you create an account, you can find your API Token on your account page at <a href="https://www.optimizely.com/account">optimizely.com/account</a>.
              <p>
                <label for="token"><strong>API Token</strong></label>
                <br />
                <input id="token" name="token" type="text" maxlength="80" value="<?php echo get_option('optimizely_token') ?>" class="code" />
              </p>
              
              <button id="connect_optimizely" class="button">Connect Optimizely</button>
              
              <h3>Choose a Project</h3>
              <input type="hidden" id="project_name" name="project_name" value="<?php echo get_option('optimizely_project_name') ?>" />
              <select id="project_id" name="project_id">
                <?php if (get_option('optimizely_project_id')) { ?>
                  <option value="<?php echo get_option('optimizely_project_name') ?>" selected><?php echo get_option('optimizely_project_name') ?></option>
                <?php } ?>
                <option value="">Connect Optimizely to choose a project...</option>
              </select>
              <p>Optimizely will add the following project code to your page automatically:</p>
              <textarea class="code" id="project_code" name="project_code" readonly><?php echo get_option('optimizely_project_code') ?></textarea>


              <h3>Variation Code</h3>
              <p>Optimizely will use this variation code to change headlines on your site. We've provided code that works with the default theme, but you might want to add or change it to work with your themes and plugins.</p>  
              
              <textarea class="code" rows="5" name="variation_template" id="variation_template"><?php echo get_option('optimizely_variation_template') ?></textarea>
              
              <p>You can use the variables $POST_ID, $OLD_TITLE, and $NEW_TITLE in your code.</p>
              
              <h3>Number of Variations to test</h3>
              <p>Place a number in the text box below. This will be the additional number of variations a user can test per post.</p>  
              
              <input id="num_variations" name="num_variations" type="number" maxlength="1" value="<?php echo get_option('num_variations',2) ?>" class="code" />

              <h3>Powered Testing</h3>
              <p>By default we use a sample size of 10,316 per variation to be considered powered. This is based on a baseline conversion rate of 3%, a minimum relative change of 20%, 80% statistical power, 95% statistical significance and 1-tailed test. If you need to change this number use the <a href="https://www.optimizely.com/resources/sample-size-calculator">Sample Size Calculator</a> to adjust to your needs</p>
                Visitors Per Variation
                <br />
                <input id="powered_number" name="optimizely_visitor_count" type="text" maxlength="80" value="<?php echo get_option('optimizely_visitor_count') ?>" class="code" />

              <p class="submit"><input type="submit" name="submit" value="<?php _e('Submit &raquo;'); ?>" class="button-primary" /></p>


            </form>
            <script type="text/javascript">
                optimizelyConfigPage();
            </script>
        </div>
    </div>
  </div>
</div>
