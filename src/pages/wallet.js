import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { collection, getDoc, getDocs, setDoc, doc } from 'firebase/firestore/lite'
import { db } from "../../firebase";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.stripe_public_key);

export async function getServerSideProps(context) {
    const session = await getSession(context);
    if (!session) {
        return { redirect: { destination: "/api/auth/signin", permanent: false } };
    }

    const userEmail = session.user.email;
    let balance = 0;

    const userDocRef = doc(db, "users", userEmail);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists() && userDoc.data().balance !== undefined) {
        balance = userDoc.data().balance;
    }

    return {
        props: {
            initialBalance: balance,
            userEmail,
        },
    };
}

export default function WalletPage({ initialBalance, userEmail }) {
    const [balance, setBalance] = useState(initialBalance);
    const [amount, setAmount] = useState("");




    const addFundsAndPay = async () => {

        if (!amount || isNaN(amount) || amount <= 0) {
            alert("Enter a valid amount");
            return;
        }

        try {
            const response = await fetch("/api/create-wallet-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, amount }),
            });

            const data = await response.json();

            // Redirect to Stripe Checkout
            const stripe = await stripePromise;
            const result = await stripe.redirectToCheckout({
                sessionId: data.id,
            });

            if (result.error) alert(result.error.message);
        } catch (error) {
            console.error("Payment Error:", error);
            alert("Something went wrong!");
        }
    };

    return (
        <div className="p-4 border rounded-md shadow-md max-w-sm mx-auto text-center">
            <h2 className="text-xl font-semibold">Wallet Balance</h2>
            <p className="text-lg font-bold">${balance.toFixed(2)}</p>


            <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border p-2 m-2 w-full"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2" onClick={addFundsAndPay}>
                Add Funds & Pay
            </button>
        </div>
    );
}
