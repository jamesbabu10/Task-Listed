//this file contains all the utility functions
const { google } = require("googleapis");

//this function will return user profile
async function getuserprofile(auth) {
  try {
    const gmail = google.gmail({ version: "v1", auth });
    const { data } = await gmail.users.getProfile({
      userId: "me",
    });
    return data;
  } catch (err) {
    throw err;
  }
}

// this will check if a email has been replied to or not
// if this returns true that means emails has not been replied  else if it returns false that means email has been replied
const checkifnotreplied = (res, emailaddress) => {
  let notreplyed = true;
  let newobj = {};

  res.data.messages.forEach((item) => {
    item.payload.headers.forEach((item) => {
      if (item.name == "From") {
        if (item.value.includes(emailaddress)) {
          notreplyed = false;
        }
      }
    });
  });

  if (notreplyed) {
    // for an email to be send  must have some details like to whom it needs to be send,message id of email and subject...
    // here i am getting the relevant info

    res.data.messages[0].payload.headers.forEach((item) => {
      if (item.name == "From") newobj = { ...newobj, to: item.value };
      if (item.name == "Message-ID")
        newobj = { ...newobj, messageid: item.value };
      if (item.name == "Subject") newobj = { ...newobj, subject: item.value };
    });
    return { notreplyed, emaildetail: newobj };
  }

  return { notreplyed: false, encodedresponse: null };
};

module.exports = { getuserprofile, checkifnotreplied };
