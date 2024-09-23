/* eslint-disable max-len */
/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const {DateTime} = require("luxon");

admin.initializeApp();

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "testing.01012000ind@gmail.com",
    pass: "pbzwqmlqcughsgkh",
  },
});
// exports.testEmail = functions.https.onRequest(async (req, res) => {
//   // const email = "testing.01012000ind@gmail.com";
//   // Replace with your email for testing
//   // const emailContent = 'This is a test email to
//   // check if email-sending logic works.';

//   const mailOptions = {
//     from: "testing.01012000ind@gmail.com",
//     to: "mitunra@gmail.com",
//     subject: "Test Reminder Email",
//     text: "hi hello how are you",
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).send("Test email sent successfully");
//   } catch (error) {
//     console.error("Error sending test email:", error);
//     res.status(500).send("Failed to send test email");
//   }
// });

// Firebase Scheduled Function to run every minute (for demo purposes)
exports.sendDailyReminder = functions.pubsub.schedule("every 1 minutes") // This would be 'every 1 minutes' for testing purposes, change later to user set time
    .timeZone("Asia/Kolkata")
    .onRun(async (context) => {
      console.log("inside function!!!!");
      const preferencesDoc = await admin.firestore().collection("preferences").doc("user1").get();

      if (!preferencesDoc.exists) {
        console.log("No preferences found");
        return null;
      }

      const {email, reminderTime} = preferencesDoc.data();
      console.log("email and reminder", email, reminderTime);
      const currentTime = DateTime.now().setZone("Asia/Kolkata").toFormat("HH:mm");
      console.log("currentTime:", currentTime);
      // Check if it's time to send the email
      if (currentTime === reminderTime) {
      // Get tomorrow's date
        const tomorrow = DateTime.now().setZone("Asia/Kolkata").plus({days: 1}).toISODate();

        // Fetch notes for the next day
        const notesSnapshot = await admin.firestore().collection("notes").where("date", "==", tomorrow).get();

        let emailContent = `Here are your notes for ${tomorrow}:\n\n`;

        if (notesSnapshot.empty) {
          emailContent += "No notes found for tomorrow.";
        } else {
          notesSnapshot.forEach((doc) => {
            const data = doc.data();
            emailContent += `- ${data.note}\n`;
          });
        }

        const mailOptions = {
          from: "testing.01012000ind@gmail.com",
          to: email,
          subject: `Reminder: Notes for ${tomorrow}`,
          text: emailContent,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log("Reminder email sent successfully");
        } catch (error) {
          console.error("Error sending email:", error);
        }
      }

      return null;
    });
