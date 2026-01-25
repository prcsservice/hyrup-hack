/**
 * Cloud Functions for FixForward
 * Deploy: firebase deploy --only functions
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// 1. Welcome Email (Trigger: Auth Create)
exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
    // Integration with SendGrid/Resend would go here
    console.log(`Sending welcome email to ${user.email}`);
    return admin.firestore().collection("mail").add({
        to: user.email,
        template: "welcome_template"
    });
});

// 2. Lock Submissions (Scheduled: Every hour)
exports.checkDeadlines = functions.pubsub.schedule("every 60 minutes").onRun(async (context) => {
    // Fetch global settings
    const settingsDoc = await admin.firestore().collection("settings").doc("public").get();
    const config = settingsDoc.data();
    
    // Logic to auto-close phases based on date
    const now = new Date();
    // Implementation details...
    console.log("Checked deadlines");
    return null;
});

// 3. Secure Admin Promotion (Callable)
// Call from frontend: const addAdmin = httpsCallable(functions, 'addAdminRole');
exports.addAdminRole = functions.https.onCall(async (data, context) => {
    // Only allow master admin to call this
    if (context.auth.token.email !== "info.hyrup@gmail.com") {
        return { error: "Unauthorized" };
    }
    const user = await admin.auth().getUserByEmail(data.email);
    await admin.auth().setCustomUserClaims(user.uid, { role: "admin" });
    return { message: `Success! ${data.email} is now an admin.` };
});
