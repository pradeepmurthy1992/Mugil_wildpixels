/**
 * Wild Pixels_kmv — Gear "Sold" status admin toggler
 *
 * Lets Mugil / Pradeep mark a gear item sold or available from
 * admin.html without touching code. Edits gear.html directly via the
 * GitHub API and pushes the commit -- the live site updates on its own
 * within about 30 seconds (same GitHub Pages auto-deploy as any push).
 *
 * This is a SEPARATE Apps Script project from the guest-submission one
 * (Code.gs) on purpose -- it holds a much more sensitive credential (a
 * GitHub token with write access to the repo), so it's kept isolated
 * with its own deployment and its own secret.
 *
 * SETUP (one-time):
 * 1. script.google.com -> New project. Paste this whole file in.
 * 2. Project Settings (gear icon, left sidebar) -> Script Properties
 *    -> Add property, twice:
 *      ADMIN_PASSWORD = <a password you choose, e.g. a passphrase>
 *      GITHUB_TOKEN    = <a GitHub fine-grained PAT -- see below>
 *    Both stay server-side only. Never paste either one into chat,
 *    admin.html, or anywhere else -- only into this Script Properties
 *    screen.
 * 3. Deploy -> New deployment -> gear icon -> Web app.
 *      Execute as: Me
 *      Who has access: Anyone
 *    Deploy, authorize when prompted (click through the "unverified
 *    app" warning -- it's your own script).
 * 4. Copy the deployment URL (ends in /exec) into admin.html's
 *    ADMIN_ENDPOINT constant, then commit + push the site.
 * 5. Any time you edit this file, redeploy: Deploy -> Manage
 *    deployments -> pencil icon -> Version: New version -> Deploy.
 *
 * GITHUB TOKEN -- create a narrowly-scoped one, not a full-access one:
 *   github.com -> Settings -> Developer settings -> Personal access
 *   tokens -> Fine-grained tokens -> Generate new token.
 *   - Resource owner: your account
 *   - Repository access: "Only select repositories" -> Mugil_wildpixels
 *   - Permissions: Contents -> Read and write (leave everything else
 *     as "No access")
 *   Paste the generated token straight into the GITHUB_TOKEN script
 *   property. If it's ever leaked, revoke it from that same GitHub
 *   settings page and generate a fresh one.
 */

const REPO_OWNER = "pradeepmurthy1992";
const REPO_NAME = "Mugil_wildpixels";
const FILE_PATH = "gear.html";
const BRANCH = "main";

/** POST — toggle one item's sold status. Requires the admin password. */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const props = PropertiesService.getScriptProperties();
    const adminPassword = props.getProperty("ADMIN_PASSWORD");
    const githubToken = props.getProperty("GITHUB_TOKEN");

    if (!adminPassword || !githubToken) {
      throw new Error("Server not configured — missing ADMIN_PASSWORD or GITHUB_TOKEN script property.");
    }
    if (data.password !== adminPassword) {
      throw new Error("Incorrect password.");
    }
    if (!data.itemId || (data.sold !== true && data.sold !== false)) {
      throw new Error("Missing itemId or sold flag.");
    }

    const apiBase = "https://api.github.com/repos/" + REPO_OWNER + "/" + REPO_NAME + "/contents/" + FILE_PATH;
    const headers = {
      Authorization: "Bearer " + githubToken,
      Accept: "application/vnd.github+json",
    };

    const getResp = UrlFetchApp.fetch(apiBase + "?ref=" + BRANCH, {
      headers: headers,
      muteHttpExceptions: true,
    });
    if (getResp.getResponseCode() !== 200) {
      throw new Error("Could not read gear.html from GitHub: " + getResp.getContentText());
    }
    const fileData = JSON.parse(getResp.getContentText());
    const currentHtml = Utilities.newBlob(Utilities.base64Decode(fileData.content), "text/html").getDataAsString();

    const pattern = new RegExp('(data-item="' + data.itemId + '"[^>]*data-sold=")(true|false)(")');
    if (!pattern.test(currentHtml)) {
      throw new Error('Could not find an item with data-item="' + data.itemId + '" in gear.html.');
    }
    const newHtml = currentHtml.replace(pattern, "$1" + (data.sold ? "true" : "false") + "$3");

    const newContentBase64 = Utilities.base64Encode(newHtml, Utilities.Charset.UTF_8);
    const putBody = {
      message: (data.sold ? "Mark " : "Unmark ") + data.itemId + " as sold (via admin panel)",
      content: newContentBase64,
      sha: fileData.sha,
      branch: BRANCH,
    };
    const putResp = UrlFetchApp.fetch(apiBase, {
      method: "put",
      headers: headers,
      contentType: "application/json",
      payload: JSON.stringify(putBody),
      muteHttpExceptions: true,
    });
    if (putResp.getResponseCode() >= 300) {
      throw new Error("GitHub commit failed: " + putResp.getContentText());
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/** GET — list current items + sold status. No password needed (this
 *  info is already publicly visible on the live gear.html page). */
function doGet(e) {
  try {
    const apiBase = "https://api.github.com/repos/" + REPO_OWNER + "/" + REPO_NAME + "/contents/" + FILE_PATH + "?ref=" + BRANCH;
    const resp = UrlFetchApp.fetch(apiBase, { muteHttpExceptions: true });
    if (resp.getResponseCode() !== 200) {
      throw new Error("Could not read gear.html from GitHub: " + resp.getContentText());
    }
    const fileData = JSON.parse(resp.getContentText());
    const html = Utilities.newBlob(Utilities.base64Decode(fileData.content), "text/html").getDataAsString();

    const items = [];
    const re = /data-item="([^"]+)"[^>]*data-sold="(true|false)"[\s\S]*?<h3>([^<]+)<\/h3>/g;
    let m;
    while ((m = re.exec(html)) !== null) {
      items.push({ id: m[1], sold: m[2] === "true", title: m[3] });
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true, items: items }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
