import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google"; // Correct import
import { collection, getDoc, getDocs, setDoc, doc } from 'firebase/firestore/lite';
import { db } from "../../../../firebase";


export const authOptions = { // Correct default export
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID, // Correct environment variable names
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        // ... other providers if needed (e.g., GitHubProvider, CredentialsProvider)
    ],
    callbacks: {
        session: async ({ session }) => {
            if (!session) return;

            console.log("session callback called");

            const userDoc = await doc(db, `users/${session.user.email}`);

            let userSnapShot = await getDoc(userDoc)
            if (!userSnapShot.exists()) {
                await setDoc(`users/${session.user.email}`, {
                    balance: 0
                })
                userSnapShot = await getDocs(userCollection);
            }

            session.user.balance = userSnapShot.data().balance;

            return Promise.resolve(session);
        }
    }
    // ... other NextAuth options (e.g., session, callbacks)
}

export default NextAuth(authOptions);
