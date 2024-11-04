jQuery(document).ready(function($) {
    let currentStep = 1;
    const totalSteps = 4;
    const formData = {
        industry: '',
        demographics: {
            ageRange: '',
            location: '',
            interests: []
        },
        campaign: {
            contentFocus: '',
            goals: []
        },
        trends: []
    };

    // Initialize step indicator
    function initStepIndicator() {
        const $indicator = $('.emn-step-indicator');
        for (let i = 1; i <= totalSteps; i++) {
            $indicator.append(`
                <div class="step ${i === 1 ? 'active' : ''}" data-step="${i}">
                    ${i}
                </div>
            `);
        }
    }

    // Show current step
    function showStep(step) {
        $('.emn-step').removeClass('active');
        $(`.emn-step[data-step="${step}"]`).addClass('active');
        
        $('.emn-step-indicator .step').removeClass('active completed');
        $(`.emn-step-indicator .step[data-step="${step}"]`).addClass('active');
        $(`.emn-step-indicator .step[data-step="${step}"]`).prevAll().addClass('completed');

        $('.emn-prev').toggle(step > 1);
        $('.emn-next').toggle(step < totalSteps);
        $('.emn-submit').toggle(step === totalSteps);
    }

    // Validate current step
    function validateStep() {
        switch (currentStep) {
            case 1:
                return $('#emn-industry').val() !== '';
            case 2:
                return $('#emn-age-range').val() !== '' && 
                       $('input[name="interests[]"]:checked').length > 0;
            case 3:
                return $('#emn-content-focus').val() !== '' && 
                       $('input[name="goals[]"]:checked').length > 0;
            case 4:
                return $('input[name="trends[]"]:checked').length > 0;
            default:
                return false;
        }
    }

    // Collect form data
    function collectFormData() {
        formData.industry = $('#emn-industry').val();
        formData.demographics.ageRange = $('#emn-age-range').val();
        formData.demographics.location = $('#emn-location').val();
        formData.demographics.interests = [];
        $('input[name="interests[]"]:checked').each(function() {
            formData.demographics.interests.push($(this).val());
        });
        formData.campaign.contentFocus = $('#emn-content-focus').val();
        formData.campaign.goals = [];
        $('input[name="goals[]"]:checked').each(function() {
            formData.campaign.goals.push($(this).val());
        });
        formData.trends = [];
        $('input[name="trends[]"]:checked').each(function() {
            formData.trends.push($(this).val());
        });
    }

    // Initialize
    initStepIndicator();
    showStep(currentStep);

    // Event handlers
    $('.emn-next').on('click', function() {
        if (validateStep()) {
            collectFormData();
            currentStep++;
            showStep(currentStep);
        } else {
            alert('Please fill in all required fields.');
        }
    });

    $('.emn-prev').on('click', function() {
        currentStep--;
        showStep(currentStep);
    });

    $('.emn-submit').on('click', function() {
        if (validateStep()) {
            collectFormData();
            $('#emn-results').show();
            $('.emn-loading').show();
            $('.emn-recommendations').hide();

            $.ajax({
                url: emnAjax.ajaxurl,
                type: 'POST',
                data: {
                    action: 'emn_get_recommendations',
                    nonce: emnAjax.nonce,
                    data: JSON.stringify(formData)
                },
                success: function(response) {
                    $('.emn-loading').hide();
                    if (response.success) {
                        $('.emn-recommendations').html(response.data).show();
                    } else {
                        $('.emn-recommendations').html(
                            '<div class="notice notice-error"><p>Error: ' + 
                            response.data + '</p></div>'
                        ).show();
                    }
                },
                error: function() {
                    $('.emn-loading').hide();
                    $('.emn-recommendations').html(
                        '<div class="notice notice-error"><p>An error occurred. Please try again.</p></div>'
                    ).show();
                }
            });
        }
    });

    // API verification
    $('#emn_verify_api').on('click', function() {
        const $button = $(this);
        const originalText = $button.text();
        $button.text('Verifying...').prop('disabled', true);

        $.ajax({
            url: emnAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'emn_verify_api',
                nonce: emnAjax.nonce
            },
            success: function(response) {
                if (response.success) {
                    alert('API key verified successfully!');
                } else {
                    alert('API key verification failed: ' + response.data);
                }
            },
            error: function() {
                alert('An error occurred during API verification.');
            },
            complete: function() {
                $button.text(originalText).prop('disabled', false);
            }
        });
    });
});