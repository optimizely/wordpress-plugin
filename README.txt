=== Optimizely Classic ===
Contributors: arthuracs, jonslaught, bradtaylorsf, lswartsenburg
Donate link: N/A
Tags: optimizely, ab testing, split testing, website optimization
Requires at least: 3.0
Tested up to: 4.4
Stable tag: 3.7.8
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

This plugin helps you configure your WordPress website to use Optimizely Classic, a dramatically easier way to improve your website through A/B testing.

== Description ==
This plugin helps you configure your WordPress website to use Optimizely Classic. If you are new to Optimizely or have started using Optimizely X (not Classic), than please use the [Optimizely X plugin](https://wordpress.org/plugins/optimizely-x/).

Optimizely is a dramatically easier way for you to improve your website through A/B testing. Create an experiment in minutes with our easy-to-use visual interface with absolutely no coding or engineering required. Convert your website visitors into customers and earn more revenue today!

If you have an Optimizely Classic project, you simply enter your Optimizely project code in the plugin's configuration page and you're ready to start improving your website using Optimizely. Built for testing headlines, this plugin allows you to, create new experiments, see your experiment results, launch winners and much more all without leaving WordPress.

== Installation ==
Sign up at [Optimizely.com](http://www.optimizely.com).

1. Make sure you are using Optimizely Classic, not Optimizely X. If you are using Optimizely X, please use the Optimizely X plugin.
2. Upload the Optimizely Classic WordPress plugin to your blog
3. Activate the plugin through the Optimizely Classic menu in WordPress
4. Enter your [Optimizely API token](https://app.optimizely.com/tokens) in the plugin's settings page, choose a project to use, then save.

You're ready to start using Optimizely!

== Screenshots ==
1. Create multiple headlines for each post
2. View your results and launch winners directly from the dashboard

== Changelog ==

= 3.7.8 =
* FIXED readme issues

= 3.7.7 =
* FIXED duplicate readme.txt file

= 3.7.6 =
* UPDATED instructions to use the Optimizely X plugin for Optimizely projects that are using Optimizely X (not Classic)

= 3.7.5 =
* FIXED bug on edit post page that displayed unwanted tooltip
* UPDATED default conditional activation code to exclude users coming from other sites

= 3.7.1 =
* FIXED bug on config.js around the conditional activation input

= 3.7.0 =
* NEW - Conditional activation mode. Now you can only run an experiment if the user actually see's the headline
* NEW - Default URL targeting. Now you can have a default URL to run experiments on or across the entire site.
* Updated the links to go to app.optimizely.com

= 3.6.1 =
* fixed bug in edit.php that only happened on servers running lower than PHP 5.4

= 3.6.0 =
* prevented the creation of an experiment until the post is published. This is to prevent goals and URL targeting to be incorrect when a post title changes and URL truncating
* updated the results page to use the new Optimizely statistics engine

= 3.5.2 =
* Fixed issue where the powered testing number will only accept 2 digits
* Fixed issue where pagenow can be undefined. Check to see if its undefined before displaying the page

= 3.5.1 =
* Fixed bug in optimizely.php that was preventing large snippet ids to render correctly

= 3.5.0 =
* Major changes to get the plugin ready for WordPress VIP
* Fixed bug that caused some snippets not to get loaded correctly after performing an upgrade

= 3.2.1 =
* Fixed bug that caused some variations to not get updated or created after experiment creation

= 3.2.0 =
* Fixed bug where the progress bar was still loading when no results are ready


= 3.1.0 =
* Added ability to add custom post types

= 3.0.0 =
* Making repository Open Source
* Added Results Page
* Added Ability to launch winners directly from results page by changing the headline for the post
* Added powered testing
* Added ability to add configure how many variations to test per post

= 2.0.0 =
* Added headline testing

= 1.0.1 =
* Prioritizing the Optimizely code snippet so that it appears above other scripts.

= 1.0.0 =
* Introducing the Optimizely WordPress plugin. Now it's even easier to start improving your website.

== Upgrade Notice ==
There are no upgrade notices
