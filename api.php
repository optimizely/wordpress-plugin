<?php


class OptimizelyAPI
{
    function __construct($app_id = null, $app_key = null) {
    	if (!$app_id)
    		$app_id = get_option('optimizely_app_id');
    	if (!$app_key)
			$app_key = get_option('optimizely_app_key');   		

    	$this->app_id = $app_id; 
    	$this->app_key = $app_key;
    }

    function get($endpoint, $data = null) {
    	$args = array(
    		'headers' => array(
    			'App_Id' => $this->app_id,
    			'App_Key' => $this->app_key 
    		),
    		'body' => $data
    	);
    	$url = "https://www.optimizelyapis.com/api/".$endpoint;
    	$response = wp_remote_get($url, $args);
    	return json_decode($response['body']); //todo: handle errors?
    }

}