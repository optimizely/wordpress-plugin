<div class="wrap">
  <script>
    jQuery(function() {
      jQuery( "#tabsTesting" ).tabs();
      optimizelyResultsPage("<?= get_option('optimizely_token'); ?>","<?= get_option('optimizely_project_id'); ?>");
    });
    </script>
  <div id="tabsTesting">
    <ul class="tabs-header">
        <li><a href="#tabs-1">Results</a></li>
        <li><a href="#tabs-2">Configuration</a></li>
    </ul>
    <div id="tabs-1">
        <h2>Wordpress Experiement Results</h2>
        <p>This is a list of all of the experiements that are running headline experiments. <p>
        <div class="button" id="launchWinners">Launch Winners</div>
        <div id="exp_123456" data-exp-id="" class="opt_results">
            <div class="header">
                <div class="title"><i class="fa fa-check-circle fa-fw"></i> This is the Experiement Name</div>
                <div class="results_toolbar">
                    <div class="start button">
                        <i class="fa fa-play fa-fw"></i>
                    </div>
                    <div class="edit button">
                        <i class="fa fa-edit fa-fw"></i>
                    </div>
                    <div class="prev button">
                        <i class="fa fa-eye fa-fw"></i>
                    </div>
                    <div class="launch button">
                        <i class="fa fa-rocket fa-fw"></i>
                    </div>
                </div>
            </div>
            <div class="variations">
                <table>
                    <tr class="first">
                        <th class="first">VARIATION</th>
                        <th>VISITORS</th>
                        <th>CONVERSIONS</th>
                        <th>CONVERSION RATE</th>
                        <th>IMPROVEMENT</th>
                        <th>CHANCE TO BEAT BASELINE</th>
                    </tr>
                    <tr class="winner" data-var-id="">
                        <td class="first">Variation 1</td>
                        <td>123456</td>
                        <td>2.34%</td>
                        <td>2.34%</td>
                        <td>2.34%</td>
                        <td>1234</td>
                    </tr>
                    <tr data-var-id="">
                        <td class="first">Variation 2</td>
                        <td>123456</td>
                        <td>2.34%</td>
                        <td>2.34%</td>
                        <td>2.34%</td>
                        <td>1234</td>
                    </tr>
                </table>
            </div>
        </div> 

        <div id="exp_123456" class="opt_results">
            <div class="header"> <i class="fa fa-clock-o fa-fw"></i> This is the Experiement Name </div>
            <div class="variations">
                <table>
                    <tr class="first">
                        <th class="first">VARIATION</th>
                        <th>VISITORS</th>
                        <th>CONVERSIONS</th>
                        <th>CONVERSION RATE</th>
                        <th>IMPROVEMENT</th>
                        <th>CHANCE TO BEAT BASELINE</th>
                        <th class="last"></th>
                    </tr>
                    <tr>
                        <td class="first">Variation 1</td>
                        <td>123456</td>
                        <td>2.34%</td>
                        <td>2.34%</td>
                        <td>2.34%</td>
                        <td>1234</td>
                        <td class="last"></td>
                    </tr>
                    <tr>
                        <td class="first">Variation 2</td>
                        <td>123456</td>
                        <td>2.34%</td>
                        <td>2.34%</td>
                        <td>2.34%</td>
                        <td>1234</td>
                        <td class="last"></td>
                    </tr>
                </table>
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
                <input id="token" name="token" type="text" maxlength="80" value="<?= get_option('optimizely_token'); ?>" class="code" />
              </p>
              
              <button id="connect_optimizely" class="button">Connect Optimizely</button>
              
              <h3>Choose a Project</h3>
              <input type="hidden" id="project_name" name="project_name" value="<?= get_option('optimizely_project_name') ?>" />
              <select id="project_id" name="project_id">
                <?php if (get_option('optimizely_project_id')) { ?>
                  <option value="<?= get_option('optimizely_project_id') ?>" selected><?= get_option('optimizely_project_name') ?></option>
                <?php } ?>
                <option value="">Connect Optimizely to choose a project...</option>
              </select>
              <p>Optimizely will add the following project code to your page automatically:</p>
              <textarea class="code" id="project_code" name="project_code" readonly><?= get_option('optimizely_project_code') ?></textarea>


              <h3>Variation Code</h3>
              <p>Optimizely will use this variation code to change headlines on your site. We've provided code that works with the default theme, but you might want to add or change it to work with your themes and plugins.</p>  
              
              <textarea class="code" rows="5" name="variation_template" id="variation_template"><?= get_option('optimizely_variation_template') ?></textarea>
              
              <p>You can use the variables $POST_ID, $OLD_TITLE, and $NEW_TITLE in your code.</p>

              <p class="submit"><input type="submit" name="submit" value="<?php _e('Submit &raquo;'); ?>" class="button-primary" /></p>


            </form>
            <script type="text/javascript">
            optimizelyConfigPage();
            </script>
        </div>
    </div>
  </div>
</div>