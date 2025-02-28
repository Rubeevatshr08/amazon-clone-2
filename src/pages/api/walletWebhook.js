import { buffer } from "micro";
import * as admin from "firebase-admin";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

// Initialize Firebase Admin (Only once)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            "type": process.env.FIREBASE_ACCOUNT_TYPE,
            "project_id": process.env.FIREBASE_PROJECTID,
            "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
            "private_key": process.env.FIREBASE_PRIVATE_KEY,
            "client_email": process.env.FIREBASE_CLIENT_EMAIL,
            "client_id": process.env.FIREBASE_CLIENT_ID,
            "auth_uri": process.env.FIREBASE_AUTH_URI,
            "token_uri": process.env.FIREBASE_TOKEN_URI,
            "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
            "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL,
            "universe_domain": process.env.FIREBASE_UNIVERSE_DOMAIN
        })
    });
}
const firestore = admin.firestore();

// Function to update wallet balance
const updateWalletBalance = async (session) => {
    try {
        console.log("🔹 Processing Wallet Update...");

        const email = session.metadata?.email;
        const amount = parseFloat(session.metadata?.amount);

        if (!email || isNaN(amount)) {
            console.error("❌ Missing email or invalid amount:", session.metadata);
            return;
        }

        console.log(`🔹 Updating Wallet for ${email}: +$${amount}`);

        const userRef = firestore.collection("users").doc(email);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            console.log("🔹 User does not exist. Creating new document...");
            await userRef.set({ balance: amount });
        } else {
            console.log("🔹 User exists. Updating balance...");
            await userRef.update({
                balance: admin.firestore.FieldValue.increment(amount),
            });
        }

        console.log(`✅ Wallet updated for ${email}: +$${amount}`);
    } catch (error) {
        console.error("❌ Error updating wallet:", error);
    }
};

// Webhook handler
export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

    const sig = req.headers["stripe-signature"];
    let event;

    try {
        const rawBody = await buffer(req);
        event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
        console.log("✅ Webhook received:", event.type);
    } catch (error) {
        console.error("⚠️ Webhook Error:", error);
        return res.status(400).json({ error: "Webhook signature verification failed" });
    }

    if (event.type === "checkout.session.completed") {
        console.log("🔹 Checkout session completed. Updating wallet...");
        const session = event.data.object;
        await updateWalletBalance(session);
    }

    res.status(200).json({ received: true });
}

export const config = {
    api: {
        bodyParser: false,
    },
};

