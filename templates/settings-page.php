<?php if (!defined('ABSPATH')) exit; ?>

<div class="wrap">
    <h1>Email Marketing Niches Settings</h1>
    
    <form method="post" action="">
        <?php wp_nonce_field('emn_settings_nonce'); ?>
        
        <table class="form-table">
            <tr>
                <th scope="row">
                    <label for="emn_gemini_api_key">Gemini AI API Key</label>
                </th>
                <td>
                    <input type="password" 
                           id="emn_gemini_api_key" 
                           name="emn_gemini_api_key" 
                           value="<?php echo esc_attr(get_option('emn_gemini_api_key')); ?>" 
                           class="regular-text">
                    <p class="description">
                        Enter your Gemini AI API key. You can get one from the 
                        <a href="https://makersuite.google.com/app/apikey" target="_blank">Google AI Studio</a>.
                    </p>
                </td>
            </tr>
        </table>
        
        <p class="submit">
            <input type="submit" 
                   name="emn_save_settings" 
                   class="button button-primary" 
                   value="Save Settings">
            <button type="button" 
                    id="emn_verify_api" 
                    class="button button-secondary">
                Verify API Key
            </button>
        </p>
    </form>
</div>