<?php

add_filter('the_title', 'tagged_title', 10, 2);
function tagged_title($title, $id) {
    if (!is_admin()) {
    	return "<span data-title-for-post=$id>$title</span>";
    } else {
    	return $title;
    }
    
}

function variation_code($post_id, $new_title)
{
	return "$('[data-title-for-post=$post_id]').text($new_title);";
}

?>