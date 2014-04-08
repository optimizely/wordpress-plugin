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

    function call($type, $endpoint, $data = null) {
    	$args = array(
    		'headers' => array(
    			'App_Id' => $this->app_id,
    			'App_Key' => $this->app_key,
                'mime_type' => 'application/json',
    		),
    		'body' => json_encode($data),
            'method' => $type,
            'content-type' => 'application/json'
    	);
    	$url = "https://www.optimizelyapis.com/api/".$endpoint;
    	$response = wp_remote_request($url, $args);

        if ($response->response->code != 200) {
            ?>
            <h1>Optimizely API Error :(</h1>
            <p>Response was:</p>
            <pre><?= print_r($response); ?></pre>
            <p>Request was:</p>
            <pre><?= var_dump($args); ?></pre>
            <?php
            die();
        }
        
    	return json_decode($response['body']); //todo: handle errors?
    }

}