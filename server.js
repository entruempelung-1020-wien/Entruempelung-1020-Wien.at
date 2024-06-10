const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Firebase Admin SDK (replace with your Firebase project credentials)
admin.initializeApp({
    credential: admin.credential.cert({
        type: "service_account",
        project_id: "YOUR_PROJECT_ID",
        private_key_id: "YOUR_PRIVATE_KEY_ID",
        private_key: "YOUR_PRIVATE_KEY",
        client_email: "YOUR_CLIENT_EMAIL",
        client_id: "YOUR_CLIENT_ID",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: "YOUR_CLIENT_X509_CERT_URL"
    }),
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com"
});

// Example protected route
app.get('/protected', (req, res) => {
    const idToken = req.headers.authorization;
    if (!idToken) {
        return res.status(403).send('Unauthorized');
    }

    admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
            const uid = decodedToken.uid;
            res.status(200).send(`Hello, user with UID: ${uid}`);
        })
        .catch((error) => {
            console.error('Error verifying token:', error);
            res.status(403).send('Unauthorized');
        });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
