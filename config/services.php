<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'brevo' => [
        'api_key' => env('BREVO_API_KEY'),
        'sender' => [
            'email' => env('BREVO_SENDER_EMAIL', 'noreply@example.com'),
            'name' => env('BREVO_SENDER_NAME', 'Brisa'),
        ],
        'templates' => [
            'new_inquiry' => env('BREVO_TEMPLATE_NEW_INQUIRY', 10),
            'inquiry_confirmation' => env('BREVO_TEMPLATE_INQUIRY_CONFIRMATION', 12),
            'inquiry_response' => env('BREVO_TEMPLATE_INQUIRY_RESPONSE', 23),
        ],
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'ai_ml' => [
        'api_key' => env('AI_ML_API_KEY'),
        'api_url' => env('AI_ML_API_URL'),
        'model' => env('AI_ML_MODEL', 'gpt-4'),
        'path' => env('AI_ML_API_PATH', '/chat/completions'),
    ],

];
