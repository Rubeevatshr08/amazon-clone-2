import { buffer } from "micro";
import * as admin from "firebase-admin";
import Stripe from "stripe";
import { doc, getDoc } from "firebase/firestore/lite";
import { db } from "../../firebase";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

// Initialize Firebase Admin (Only once)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(require({
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
        })),
    });
}
const db = admin.firestore();

// Function to fulfill an order
const fulfillOrder = async (session) => {
    try {
        await db.collection("users")
            .doc(session.metadata.email)
            .collection("orders")
            .doc(session.id)
            .set({
                amount: session.amount_total / 100,
                images: JSON.parse(session.metadata.images),
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });

        console.log(`✅ Order ${session.id} saved successfully!`);
    } catch (error) {
        console.error("❌ Error saving order:", error);
    }
};

// Function to update wallet balance
const updateWalletBalance = async (session) => {
    const email = session.metadata.email;
    const amount = parseFloat(session.metadata.amount); // Convert metadata to number

    const userDocRef = doc(db, `users/${userEmail}`);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists) {
        await userRef.set({ balance: amount });
    } else {
        await userRef.update({
            balance: admin.firestore.FieldValue.increment(amount),
        });


        console.log(`✅ Wallet updated: ${email} +$${amount}`);
    }
};

// Webhook handler
export default async function handler(req, res) {
    console.log("🔹 Incoming Webhook Request:", req.method);

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }


    const sig = req.headers["stripe-signature"];
    const rawBody = await buffer(req);
    const event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_SIGNING_SECRET);
    res.status(200).json({ received: true });

}

// Disable bodyParser for raw request processing
export const config = {
    api: {
        bodyParser: false,
    },
};
