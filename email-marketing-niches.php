<?php
/**
 * Plugin Name: Email Marketing Niches AI
 * Description: AI-powered email marketing niche discovery and campaign planning
 * Version: 1.0.0
 * Author: Your Name
 */

if (!defined('ABSPATH')) {
    exit;
}

// Plugin constants
define('EMN_VERSION', '1.0.0');
define('EMN_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('EMN_PLUGIN_URL', plugin_dir_url(__FILE__));

// Initialize plugin
function emn_init() {
    add_action('admin_menu', 'emn_admin_menu');
    add_action('admin_enqueue_scripts', 'emn_admin_scripts');
    add_action('wp_enqueue_scripts', 'emn_frontend_scripts');
    add_action('wp_ajax_emn_verify_api', 'emn_verify_api');
    add_action('wp_ajax_emn_get_recommendations', 'emn_get_recommendations');
    add_action('wp_ajax_nopriv_emn_get_recommendations', 'emn_get_recommendations');
    add_shortcode('email_marketing_niches', 'emn_frontend_shortcode');
}
add_action('plugins_loaded', 'emn_init');

// Register admin menu
function emn_admin_menu() {
    add_menu_page(
        'Email Marketing Niches',
        'Email Marketing',
        'manage_options',
        'email-marketing-niches',
        'emn_admin_page',
        'dashicons-email-alt'
    );
    
    add_submenu_page(
        'email-marketing-niches',
        'Settings',
        'Settings',
        'manage_options',
        'email-marketing-settings',
        'emn_settings_page'
    );
}

// Enqueue frontend scripts and styles
function emn_frontend_scripts() {
    wp_enqueue_style(
        'emn-frontend-styles',
        EMN_PLUGIN_URL . 'assets/css/frontend.css',
        [],
        EMN_VERSION
    );

    wp_enqueue_script(
        'emn-frontend-script',
        EMN_PLUGIN_URL . 'assets/js/frontend.js',
        ['jquery'],
        EMN_VERSION,
        true
    );

    wp_localize_script('emn-frontend-script', 'emnAjax', [
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('emn_nonce')
    ]);
}

// Enqueue admin scripts and styles
function emn_admin_scripts($hook) {
    if (!in_array($hook, ['toplevel_page_email-marketing-niches', 'email-marketing_page_email-marketing-settings'])) {
        return;
    }

    wp_enqueue_style(
        'emn-admin-styles',
        EMN_PLUGIN_URL . 'assets/css/admin.css',
        [],
        EMN_VERSION
    );

    wp_enqueue_script(
        'emn-admin-script',
        EMN_PLUGIN_URL . 'assets/js/admin.js',
        ['jquery'],
        EMN_VERSION,
        true
    );

    wp_localize_script('emn-admin-script', 'emnAjax', [
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('emn_nonce')
    ]);
}

// Frontend shortcode callback
function emn_frontend_shortcode() {
    $api_key = get_option('emn_gemini_api_key');
    if (!$api_key) {
        return '<div class="emn-error">Service temporarily unavailable. Please try again later.</div>';
    }
    ob_start();
    require_once EMN_PLUGIN_DIR . 'templates/frontend-form.php';
    return ob_get_clean();
}

// Admin page callback
function emn_admin_page() {
    $api_key = get_option('emn_gemini_api_key');
    if (!$api_key) {
        echo '<div class="wrap"><div class="notice notice-error"><p>Please configure your Gemini AI API key in the <a href="' . admin_url('admin.php?page=email-marketing-settings') . '">settings page</a>.</p></div></div>';
        return;
    }
    require_once EMN_PLUGIN_DIR . 'templates/admin-page.php';
}

// Settings page callback
function emn_settings_page() {
    if (isset($_POST['emn_save_settings']) && check_admin_referer('emn_settings_nonce')) {
        update_option('emn_gemini_api_key', sanitize_text_field($_POST['emn_gemini_api_key']));
        echo '<div class="notice notice-success"><p>Settings saved successfully!</p></div>';
    }
    require_once EMN_PLUGIN_DIR . 'templates/settings-page.php';
}

// AJAX handler for API verification
function emn_verify_api() {
    check_ajax_referer('emn_nonce', 'nonce');
    
    if (!current_user_can('manage_options')) {
        wp_send_json_error('Unauthorized access');
    }
    
    $api_key = get_option('emn_gemini_api_key');
    if (!$api_key) {
        wp_send_json_error('API key not configured');
    }

    $response = wp_remote_get("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={$api_key}");

    if (is_wp_error($response)) {
        wp_send_json_error($response->get_error_message());
    }

    $body = json_decode(wp_remote_retrieve_body($response), true);
    wp_send_json_success($body);
}

// AJAX handler for getting AI recommendations
function emn_get_recommendations() {
    check_ajax_referer('emn_nonce', 'nonce');
    
    $api_key = get_option('emn_gemini_api_key');
    if (!$api_key) {
        wp_send_json_error('Service temporarily unavailable');
    }

    $data = json_decode(stripslashes($_POST['data']), true);
    if (!$data) {
        wp_send_json_error('Invalid data format');
    }
    
    // Sanitize inputs
    $sanitized_data = [
        'industry' => sanitize_text_field($data['industry']),
        'demographics' => [
            'ageRange' => sanitize_text_field($data['demographics']['ageRange']),
            'location' => sanitize_text_field($data['demographics']['location']),
            'interests' => array_map('sanitize_text_field', $data['demographics']['interests'])
        ],
        'campaign' => [
            'contentFocus' => sanitize_text_field($data['campaign']['contentFocus']),
            'goals' => array_map('sanitize_text_field', $data['campaign']['goals'])
        ],
        'trends' => array_map('sanitize_text_field', $data['trends'])
    ];

    $prompt = sprintf(
        'Based on the following user profile:
        - Industry: %s
        - Audience Demographics: Age %s, Location %s, Interests %s
        - Content Focus: %s
        - Campaign Goals: %s
        - Trends/Topics of Interest: %s

        Recommend 3-5 trending, high-potential email marketing niches. For each niche, provide:
        1. A brief description and popularity metrics
        2. Recommended audience segmentation
        3. Specific content ideas, email subject lines, and messaging styles
        4. Analysis of competitors and differentiation strategies',
        $sanitized_data['industry'],
        $sanitized_data['demographics']['ageRange'],
        $sanitized_data['demographics']['location'],
        implode(', ', $sanitized_data['demographics']['interests']),
        $sanitized_data['campaign']['contentFocus'],
        implode(', ', $sanitized_data['campaign']['goals']),
        implode(', ', $sanitized_data['trends'])
    );

    $request_body = [
        'contents' => [
            [
                'parts' => [
                    [
                        'text' => $prompt
                    ]
                ]
            ]
        ],
        'generationConfig' => [
            'temperature' => 0.7,
            'topK' => 40,
            'topP' => 0.95,
            'maxOutputTokens' => 1024,
        ]
    ];

    $response = wp_remote_post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={$api_key}",
        [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'body' => json_encode($request_body),
            'timeout' => 30,
        ]
    );

    if (is_wp_error($response)) {
        wp_send_json_error('Failed to connect to the API: ' . $response->get_error_message());
    }

    $http_code = wp_remote_retrieve_response_code($response);
    if ($http_code !== 200) {
        wp_send_json_error('API request failed with status code: ' . $http_code);
    }

    $body = json_decode(wp_remote_retrieve_body($response), true);
    
    if (empty($body) || !isset($body['candidates'][0]['content']['parts'][0]['text'])) {
        wp_send_json_error('Invalid response format from API');
    }
    
    wp_send_json_success($body['candidates'][0]['content']['parts'][0]['text']);
}