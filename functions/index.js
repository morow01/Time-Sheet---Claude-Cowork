const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

/**
 * Runs every minute. Checks all users for pending reminders that are due,
 * sends FCM push notifications, and marks them as fired.
 *
 * Also handles the case where a client (open browser tab) already fired the
 * reminder locally — clients can only show local notifications, not push to
 * other devices, so the server still needs to send the FCM push.
 */
exports.checkReminders = onSchedule("* * * * *", async () => {
  const now = Date.now();

  // Get all users
  const usersSnap = await db.collection("users").get();

  for (const userDoc of usersSnap.docs) {
    const uid = userDoc.id;

    // Get this user's reminders doc
    const remindersDoc = await db.doc(`users/${uid}/data/reminders`).get();
    if (!remindersDoc.exists) continue;

    const data = remindersDoc.data();
    if (!Array.isArray(data.reminders)) continue;

    let changed = false;
    const reminders = data.reminders;
    const TWO_MINUTES = 2 * 60 * 1000;

    for (const r of reminders) {
      // Case 1: Unfired reminder that's due — fire it
      // Case 2: Client fired it recently (not server) — still send FCM push
      //         because clients can only notify locally, not push to other devices.
      //         The notification tag prevents duplicates on the device that already showed it.
      const needsFiring = !r.fired && r.remindAt <= now;
      const clientFiredRecently = r.fired && r.firedBy && r.firedBy !== "server"
        && r.firedAt && (now - r.firedAt) < TWO_MINUTES;

      if (needsFiring || clientFiredRecently) {
        if (needsFiring) {
          r.fired = true;
          r.firedBy = "server";
          r.firedAt = Date.now();
          changed = true;
        } else if (clientFiredRecently) {
          // Update firedBy to server so we don't re-send next minute
          r.firedBy = "server";
          changed = true;
        }

        // Get user's FCM tokens
        const tokensDoc = await db.doc(`users/${uid}/data/fcm_tokens`).get();
        if (!tokensDoc.exists) continue;

        const tokens = tokensDoc.data().tokens || [];
        if (tokens.length === 0) continue;

        // Build notification
        const body = r.description + (r.location ? " — " + r.location : "");
        const message = {
          data: {
            type: "reminder",
            title: "Rian Reminder",
            body: body,
            reminderId: r.id || "",
            noteId: r.noteId || "",
          },
          tokens: tokens,
        };

        try {
          const result = await messaging.sendEachForMulticast(message);
          // Remove any invalid tokens
          const invalidTokens = [];
          result.responses.forEach((resp, i) => {
            if (!resp.success && resp.error &&
                (resp.error.code === "messaging/registration-token-not-registered" ||
                 resp.error.code === "messaging/invalid-registration-token")) {
              invalidTokens.push(tokens[i]);
            }
          });
          if (invalidTokens.length > 0) {
            const validTokens = tokens.filter(t => !invalidTokens.includes(t));
            await db.doc(`users/${uid}/data/fcm_tokens`).set(
              { tokens: validTokens, _updatedAt: Date.now() },
              { merge: true }
            );
          }
        } catch (e) {
          console.error(`FCM send failed for user ${uid}:`, e);
        }
      }
    }

    if (changed) {
      await db.doc(`users/${uid}/data/reminders`).update({ reminders, _updatedAt: Date.now() });
    }
  }
});
