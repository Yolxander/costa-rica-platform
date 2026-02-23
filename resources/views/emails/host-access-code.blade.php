<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Host Access Code</title>
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #0f766e;">Welcome to Costa Rica Rental Hub</h1>
    <p>Hi {{ $user->name }},</p>
    <p>Thank you for registering as a host. To complete your setup and access your host dashboard, use the access code below when prompted after logging in:</p>
    <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; background: #f0fdfa; padding: 16px; border-radius: 8px; text-align: center;">{{ $accessCode }}</p>
    <p>Steps to get started:</p>
    <ol>
        <li>Go to the login page</li>
        <li>Enter your email and password</li>
        <li>When prompted, enter the access code above</li>
        <li>You'll be redirected to your host dashboard</li>
    </ol>
    <p>If you didn't request this, you can safely ignore this email.</p>
    <p>— The Costa Rica Rental Hub Team</p>
</body>
</html>
