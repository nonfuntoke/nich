<?php if (!defined('ABSPATH')) exit; ?>

<div class="wrap emn-admin">
    <h1>Email Marketing Niches Discovery</h1>
    
    <div id="emn-wizard" class="emn-wizard">
        <div class="emn-step-indicator"></div>
        
        <div class="emn-step" data-step="1">
            <h2>Select Your Industry</h2>
            <select id="emn-industry" class="emn-input">
                <option value="">Select an industry</option>
                <option value="technology">Technology</option>
                <option value="finance">Finance</option>
                <option value="health">Health & Wellness</option>
                <option value="education">Education</option>
                <option value="ecommerce">E-commerce</option>
            </select>
        </div>

        <div class="emn-step" data-step="2">
            <h2>Audience Demographics</h2>
            <select id="emn-age-range" class="emn-input">
                <option value="">Select age range</option>
                <option value="18-24">18-24</option>
                <option value="25-34">25-34</option>
                <option value="35-44">35-44</option>
                <option value="45-54">45-54</option>
                <option value="55+">55+</option>
            </select>
            
            <input type="text" id="emn-location" class="emn-input" placeholder="Location (Optional)">
            
            <div class="emn-interests">
                <h3>Interests</h3>
                <div class="emn-checkbox-grid">
                    <?php
                    $interests = ['Technology', 'Business', 'Lifestyle', 'Entertainment', 'Sports', 'Education'];
                    foreach ($interests as $interest) {
                        echo '<label><input type="checkbox" name="interests[]" value="' . esc_attr($interest) . '"> ' . esc_html($interest) . '</label>';
                    }
                    ?>
                </div>
            </div>
        </div>

        <div class="emn-step" data-step="3">
            <h2>Campaign Focus & Goals</h2>
            <select id="emn-content-focus" class="emn-input">
                <option value="">Select content focus</option>
                <option value="educational">Educational</option>
                <option value="promotional">Promotional</option>
                <option value="informational">Informational</option>
                <option value="entertainment">Entertainment</option>
            </select>

            <div class="emn-goals">
                <h3>Campaign Goals</h3>
                <div class="emn-checkbox-grid">
                    <?php
                    $goals = ['Lead Generation', 'Brand Awareness', 'Sales', 'Customer Retention'];
                    foreach ($goals as $goal) {
                        echo '<label><input type="checkbox" name="goals[]" value="' . esc_attr($goal) . '"> ' . esc_html($goal) . '</label>';
                    }
                    ?>
                </div>
            </div>
        </div>

        <div class="emn-step" data-step="4">
            <h2>Trending Topics</h2>
            <div class="emn-checkbox-grid">
                <?php
                $trends = ['Remote Work', 'AI & Automation', 'Sustainability', 'Digital Transformation', 'Mental Health', 'Personal Development'];
                foreach ($trends as $trend) {
                    echo '<label><input type="checkbox" name="trends[]" value="' . esc_attr($trend) . '"> ' . esc_html($trend) . '</label>';
                }
                ?>
            </div>
        </div>

        <div class="emn-navigation">
            <button type="button" class="button button-secondary emn-prev" style="display: none;">Previous</button>
            <button type="button" class="button button-primary emn-next">Next</button>
            <button type="button" class="button button-primary emn-submit" style="display: none;">Generate Recommendations</button>
        </div>

        <div id="emn-results" class="emn-results" style="display: none;">
            <div class="emn-loading">
                <span class="spinner is-active"></span>
                <p>Analyzing your inputs and generating recommendations...</p>
            </div>
            <div class="emn-recommendations"></div>
        </div>
    </div>
</div>