<?php
/**
 * @package Optimizely
 * @version 1.0.1
 */
/*
Plugin Name: Optimizely
Plugin URI: http://wordpress.org/extend/plugins/optimizely/
Description: Simple, fast, and powerful.  <a href="http://www.optimizely.com">Optimizely</a> is a dramatically easier way for you to improve your website through A/B testing. Create an experiment in minutes with our easy-to-use visual interface with absolutely no coding or engineering required. Convert your website visitors into customers and earn more revenue today! To get started: 1) Click the "Activate" link to the left of this description, 2) Sign up for an <a href="http://www.optimizely.com">Optimizely account</a>, and 3) Go to the <a href="admin.php?page=optimizely-config">settings page</a>, and enter your Optimizely project code.
Author: Arthur Suermondt
Version: 1.0.1
Author URI: http://www.optimizely.com/
License: GPL2
*/

/*  Copyright 2012 Arthur Suermondt (email: support@optimizely.com)

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
if ( is_admin() )
  require_once dirname( __FILE__ ) . '/admin.php';

// forcing Optimizely to load first in the head tag
add_action('wp_head', 'add_optimizely_script', -1000);

function add_optimizely_script() {
  if ( empty( $project_code) ) {
	  $project_code = get_option('optimizely_project_code');
	  if ( !empty($project_code)) {
  	  
  	  $project_code_html = html_entity_decode($project_code);
  	  $patterns = array('/\<script src="/','/"\>\<\/script\>/');
      $projectScript = preg_replace($patterns, '', $project_code_html);

      if (!$_SERVER['HTTPS']) {
        $script = "http:".$projectScript;
      } else {
        $script = "https:".$projectScript;
      }
      
	  echo '<script type="text/javascript" src="'.$script.'"></script>';

	  }
	}

}

?>