<?php
	/**
	 * Plugin Name: Exit Intent Popup
	 * Description: Exit intent popup will display when user is about to leave the page. Add this shortcode <strong>[exit_intent_popup_shortcode]</strong> in footer.
	 * Version: 1.0.0
	 * Author: Syrah Mae Arguilles
	 */

// Exit if accessed directly.
if (!defined('ABSPATH')) exit;

// Define plugin constants.
define('YOUR_SECURE_PLUGIN_VERSION', '1.0.0');
define('YOUR_SECURE_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('YOUR_SECURE_PLUGIN_URL', plugin_dir_url(__FILE__));

function exit_intent_popup_shortcode_function($atts) {
	/*
	 * Invoke CSS/JS when shortcode is called
	 * */
	// Enqueue your JS and CSS files
	wp_enqueue_style('exit-intent-popup-plugin-style', YOUR_SECURE_PLUGIN_URL . 'assets/css/style.css', array(), YOUR_SECURE_PLUGIN_VERSION, 'all');
	
	// Enqueue scripts.
	wp_enqueue_script('exit-intent-popup-plugin-script', YOUR_SECURE_PLUGIN_URL . 'assets/js/script.js', array('jquery'), YOUR_SECURE_PLUGIN_VERSION, true);
	
	// Your shortcode logic here
	include_once( 'template/popup.php' );
}

add_shortcode('exit_intent_popup_shortcode', 'exit_intent_popup_shortcode_function');
