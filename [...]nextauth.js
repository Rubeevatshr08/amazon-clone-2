export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET, // ✅ Ensure this is set
  useSecureCookies: true, // ✅ Forces secure cookies
  session: {
    strategy: "jwt", // ✅ Uses JWT instead of database sessions
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        secure: true, // ✅ Ensures cookies are only sent over HTTPS
        sameSite: "lax",
        path: "/",
      },
    },
  },
});
