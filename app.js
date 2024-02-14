require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// LinkedIn OAuth URLs
const linkedInAuthUrl = 'https://www.linkedin.com/oauth/v2/authorization';
const linkedInTokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';

// Environment variables
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;

// Redirect users to LinkedIn for authentication
app.get('/auth/linkedin', (req, res) => {
    const authUrl = `${linkedInAuthUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=r_liteprofile%20r_emailaddress`;
    res.redirect(authUrl);
});

// Handle the callback from LinkedIn
app.get('/auth/linkedin/callback', async (req, res) => {
    const { code } = req.query;

    try {
        const response = await axios.post(linkedInTokenUrl, null, {
            params: {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
                client_id: clientId,
                client_secret: clientSecret,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const accessToken = response.data.access_token;
        // Here, you could use the access token to fetch the user's profile from LinkedIn
        // For now, just return the access token to the client (for demonstration purposes only; don't do this in production)
        res.json({ accessToken });
    } catch (error) {
        console.error('Error exchanging code for access token:', error.response || error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

