/**
 * Cloud Functions for FixForward
 * Deploy: firebase deploy --only functions
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// 1. Lock Submissions (Scheduled: Every hour)
exports.checkDeadlines = functions.pubsub.schedule("every 60 minutes").onRun(async (context) => {
    const settingsDoc = await admin.firestore().collection("settings").doc("public").get();
    if (!settingsDoc.exists) return null;
    
    console.log("Checked deadlines");
    return null;
});

// 2. Secure Admin Promotion (Callable)
// Call from frontend: const addAdmin = httpsCallable(functions, 'addAdminRole');
exports.addAdminRole = functions.https.onCall(async (data, context) => {
    if (context.auth.token.email !== "info.hyrup@gmail.com") {
        return { error: "Unauthorized" };
    }
    const user = await admin.auth().getUserByEmail(data.email);
    await admin.auth().setCustomUserClaims(user.uid, { role: "admin" });
    return { message: `Success! ${data.email} is now an admin.` };
});
