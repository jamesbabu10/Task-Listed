// this function contains all the email thread related functions
const { google } = require("googleapis");

// this function will return the thread list ie all the thread of the said user
async function threadlist(auth) {
  try {
    const gmail = google.gmail({ version: "v1", auth });
    const res = await gmail.users.threads.list({
      userId: "me",
    });
    return res.data.threads;
  } catch (err) {
    throw err;
  }
}

// this function will help in iterating over the thread list on thread at a time
async function threadget(auth, threadid) {
  try {
    const gmail = google.gmail({ version: "v1", auth });
    const res = await gmail.users.threads.get({
      userId: "me",
      id: threadid,
    });

    return res;
  } catch (err) {
    throw err;
  }
}

module.exports = { threadlist, threadget };
