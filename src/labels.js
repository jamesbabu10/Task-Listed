// this file contains all the label related functions
const { google } = require("googleapis");

// get label id func
// this function will check if the given label exists if it does it will return its label id
// in case the said label does not exist it will create a label with the passed label name and will return its label id
async function getlabelid(auth, labelname) {
  try {
    const gmail = google.gmail({ version: "v1", auth });
    const res = await gmail.users.labels.list({
      userId: "me",
    });
    const labels = res.data.labels;
    if (!labels || labels.length === 0) {
      console.log("No labels found.");
      return;
    }

    for (let i = 0; i < labels.length; i++) {
      let label = labels[i];
      if (label.name == labelname) {
        return label.id;
      }
    }

    data = await createlabels(auth, labelname);

    return data.id;
  } catch (err) {
    throw err;
  }
}

// this function takes auth and label name
// will create a label with the given name and return its label id
async function createlabels(auth, labelname) {
  const gmail = google.gmail({ version: "v1", auth });
  return gmail.users.labels
    .create({
      userId: "me",
      resource: {
        name: labelname,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
}

// this function will modify the label of an email
async function modifylabel(auth, threadId, labelid) {
  try {
    const gmail = google.gmail({ version: "v1", auth });
    const res = await gmail.users.threads.modify({
      userId: "me",
      id: threadId,
      resource: {
        addLabelIds: [labelid],
      },
    });
    return res;
  } catch (err) {
    throw err;
  }
}
module.exports = { getlabelid, modifylabel };
