/**
 * Wild Pixels_kmv — Guest Photo Submission handler
 *
 * Receives a JSON POST from submit.html (js/submit.js), saves the
 * photo into the Drive folder below, and logs the entry as a row in
 * the linked Sheet. Nothing is ever published automatically — Mugil
 * reviews the Sheet and picks what goes on the live Guests Gallery.
 *
 * SETUP (one-time):
 * 1. Go to script.google.com -> New project.
 * 2. Delete the placeholder code, paste this whole file in.
 * 3. Confirm FOLDER_ID / SHEET_ID / NOTIFY_EMAIL below are correct.
 * 4. Deploy -> New deployment -> type "Web app".
 *      Execute as: Me
 *      Who has access: Anyone
 * 5. Authorize when prompted (it's your own script, so click through
 *    the "unverified app" warning: Advanced -> Go to project (unsafe) -> Allow).
 * 6. Copy the deployment URL (ends in /exec) into js/submit.js's
 *    SUBMIT_ENDPOINT constant, then commit + push the site.
 * 7. Re-deploy (Deploy -> Manage deployments -> edit -> New version)
 *    any time you edit this file, otherwise the live endpoint won't
 *    see the changes.
 */

const FOLDER_ID = "1xt0tKhdU3U0m7IPz8_Lywn9ru5KZTUgr"; // Drive folder for uploaded photos
const SHEET_ID = "1bQnBjKPnPMt_J89JQ9DQvu56bpIlLUwD2pzZzfTr0Xs"; // Review log spreadsheet
const NOTIFY_EMAIL = "pradhuphotography@gmail.com"; // who gets pinged on a new submission

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (!data.name || !data.tour || !data.category || !data.fileData || !data.consent) {
      throw new Error("Missing required field.");
    }

    // Save the photo to Drive
    let folder;
    try {
      folder = DriveApp.getFolderById(FOLDER_ID);
    } catch (folderErr) {
      throw new Error("DRIVE FOLDER not accessible (check FOLDER_ID and that this account has access): " + folderErr);
    }
    const bytes = Utilities.base64Decode(data.fileData);
    const blob = Utilities.newBlob(bytes, data.mimeType || "image/jpeg", data.filename || "guest-photo.jpg");
    const file = folder.createFile(blob);
    file.setDescription(
      "Submitted by " + data.name + " (" + data.tour + ") via Wild Pixels submission form."
    );

    // Log the entry in the Sheet
    let ss;
    try {
      ss = SpreadsheetApp.openById(SHEET_ID);
    } catch (sheetErr) {
      throw new Error("SHEET not accessible (check SHEET_ID and that this account has access): " + sheetErr);
    }
    const sheet = ss.getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp", "Name", "Tour", "Category", "Caption",
        "Public Consent", "Photo Link", "Status",
      ]);
    }
    sheet.appendRow([
      new Date(),
      data.name,
      data.tour,
      data.category,
      data.caption || "",
      data.consent,
      file.getUrl(),
      "Pending Review",
    ]);

    // Notify Mugil
    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(
        NOTIFY_EMAIL,
        "New Wild Pixels guest photo submission",
        data.name + " submitted a photo from " + data.tour + " (" + data.category + ").\n\n" +
          "Caption: " + (data.caption || "(none)") + "\n" +
          "Public consent: " + data.consent + "\n" +
          "View photo: " + file.getUrl() + "\n" +
          "Review log: https://docs.google.com/spreadsheets/d/" + SHEET_ID + "/edit"
      );
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
