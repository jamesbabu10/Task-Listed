// this file contains all the email related functions

const { google } = require("googleapis");
// email need to follow a set format below is the email format
// for an email to be added to a thread it must have the message id,subect same as recieved email and to
// therefor i have added the above details to the email
const emailcreation = (obj, reply) => {
  const { messageid, to, subject } = obj;
  let encodedResponse = btoa(
    'Content-Type: text/plain; charset="UTF-8"\n' +
      "MIME-Version: 1.0\n" +
      "Content-Transfer-Encoding: 7bit\n" +
      `References: ${messageid}\n` +
      `In-Reply-To: ${messageid}\n` +
      `Subject: Re:${subject}\n` +
      `To: ${to}\n\n` +
      `${reply}`
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return encodedResponse;
};

// this function will send email
async function sendemail(auth, encodedemail, labelid, threadid) {
  try {
    const gmail = google.gmail({ version: "v1", auth });
    const res = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        threadId: threadid,
        labelIds: [labelid],
        raw: encodedemail,
      },
    });

    return res.data;
  } catch (err) {
    throw err;
  }
}

module.exports = { emailcreation, sendemail };
