import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google"; // Correct import

export default NextAuth({ // Correct default export
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID, // Correct environment variable names
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        // ... other providers if needed (e.g., GitHubProvider, CredentialsProvider)
    ],
    // ... other NextAuth options (e.g., session, callbacks)
});
