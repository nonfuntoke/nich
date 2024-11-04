<?php
/**
 * Plugin Name: Email Marketing Niches AI
 * Description: AI-powered email marketing niche discovery and campaign planning
 * Version: 1.0.2
 * Author: Samid
 */

if (!defined('ABSPATH')) {
    exit;
}

// Plugin constants
define('EMN_VERSION', time()); // Use timestamp for development
define('EMN_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('EMN_PLUGIN_URL', plugin_dir_url(__FILE__));

// Initialize plugin
function emn_init() {
    add_action('admin_menu', 'emn_admin_menu');
    add_action('wp_enqueue_scripts', 'emn_frontend_scripts');
    add_action('admin_enqueue_scripts', 'emn_admin_scripts');
    add_action('wp_ajax_emn_verify_api', 'emn_verify_api');
    add_action('wp_ajax_emn_get_recommendations', 'emn_get_recommendations');
    add_action('wp_ajax_nopriv_emn_get_recommendations', 'emn_get_recommendations');
    add_shortcode('email_marketing_niches', 'emn_shortcode');
}
add_action('plugins_loaded', 'emn_init');

// Add admin menu
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

// Frontend scripts and styles
function emn_frontend_scripts() {
    global $post;
    if (!is_a($post, 'WP_Post') || !has_shortcode($post->post_content, 'email_marketing_niches')) {
        return;
    }

    // Deregister WordPress's jQuery to avoid conflicts
    wp_deregister_script('jquery');
    wp_deregister_script('wp-embed');

    // Enqueue React and ReactDOM from CDN
    wp_enqueue_script(
        'react',
        'https://unpkg.com/react@18/umd/react.production.min.js',
        [],
        '18.0.0',
        true
    );

    wp_enqueue_script(
        'react-dom',
        'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
        ['react'],
        '18.0.0',
        true
    );

    // Enqueue our app's assets
    wp_enqueue_style(
        'emn-frontend-styles',
        EMN_PLUGIN_URL . 'dist/assets/index-CjLnF1dk.css',
        [],
        EMN_VERSION
    );

    wp_enqueue_script(
        'emn-frontend-script',
        EMN_PLUGIN_URL . 'dist/assets/index-D5YLffpQ.js',
        ['react', 'react-dom'],
        EMN_VERSION,
        true
    );

    wp_localize_script('emn-frontend-script', 'emnConfig', array(
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('emn_nonce')
    ));
}

// Admin scripts and styles
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

    wp_localize_script('emn-admin-script', 'emnAjax', array(
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('emn_nonce')
    ));
}

// Shortcode to embed the React app
function emn_shortcode() {
    ob_start();
    ?>
    <div id="email-marketing-niches-root" class="emn-root"></div>
    <?php
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
    
    $api_key = get_option('emn_gemini_api_key');
    if (!$api_key) {
        wp_send_json_error('API key not configured');
    }

    $response = wp_remote_get('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro', [
        'headers' => [
            'Authorization' => 'Bearer ' . $api_key
        ]
    ]);

    if (is_wp_error($response)) {
        wp_send_json_error($response->get_error_message());
    }

    $body = json_decode(wp_remote_retrieve_body($response), true);
    if (isset($body['error'])) {
        wp_send_json_error($body['error']['message']);
    }

    wp_send_json_success('API key verified successfully');
}

// AJAX handler for getting AI recommendations
function emn_get_recommendations() {
    check_ajax_referer('emn_nonce', 'nonce');
    
    if (!isset($_POST['data'])) {
        wp_send_json_error('No data provided');
    }

    $api_key = get_option('emn_gemini_api_key');
    if (!$api_key) {
        wp_send_json_error('API key not configured');
    }

    $data = json_decode(stripslashes($_POST['data']), true);
    
    if (!$data) {
        wp_send_json_error('Invalid data format');
    }

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
        sanitize_text_field($data['industry']),
        sanitize_text_field($data['demographics']['ageRange']),
        sanitize_text_field($data['demographics']['location']),
        implode(', ', array_map('sanitize_text_field', $data['demographics']['interests'])),
        sanitize_text_field($data['campaign']['contentFocus']),
        implode(', ', array_map('sanitize_text_field', $data['campaign']['goals'])),
        implode(', ', array_map('sanitize_text_field', $data['trends']))
    );

    $response = wp_remote_post('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro/generateText', [
        'headers' => [
            'Authorization' => 'Bearer ' . $api_key,
            'Content-Type' => 'application/json'
        ],
        'body' => json_encode([
            'prompt' => ['text' => $prompt],
            'temperature' => 0.7,
            'candidate_count' => 1
        ])
    ]);

    if (is_wp_error($response)) {
        wp_send_json_error($response->get_error_message());
    }

    $body = json_decode(wp_remote_retrieve_body($response), true);
    if (isset($body['error'])) {
        wp_send_json_error($body['error']['message']);
    }

    $recommendations = isset($body['candidates'][0]['output']) ? $body['candidates'][0]['output'] : '';
    wp_send_json_success(nl2br(esc_html($recommendations)));
}