const { authorize } = require("./src/auth");
const { emailcreation, sendemail } = require("./src/email");
const { modifylabel, getlabelid } = require("./src/labels");
const { threadlist, threadget } = require("./src/threads");
const { getuserprofile, checkifnotreplied } = require("./src/utils");

// this is the main function
const mainfunc = async (labelname, reply) => {
  try {
    let Emaildetected = false;
    console.log("new run initiated");
    // authenticate the user
    const auth = await authorize();
    console.log("user has been authenticated");

    // get label id
    const labelid = await getlabelid(auth, labelname);
    console.log("label id is ", labelid);
    // to get all the email thread of the user
    const thread = await threadlist(auth);
    // to get user profile
    const user = await getuserprofile(auth);
    // to get iterate over each thread and check if a thread has ever been replied to
    for (let i = 0; i < thread.length; i++) {
      const res = await threadget(auth, thread[i].id);

      const { notreplyed, emaildetail } = checkifnotreplied(
        res,
        user.emailAddress
      );

      // if not replyed to true ,then reply to the email
      if (notreplyed) {
        Emaildetected = true;
        console.log("Found a not replied Email");
        const encodedresponse = emailcreation(emaildetail, reply);
        // below function will send an email
        const res = await sendemail(
          auth,
          encodedresponse,
          labelid,
          thread[i].id
        );
        console.log("email has been sent");
        // this will modify the label
        await modifylabel(auth, res.threadId, labelid);
        console.log("email added to new label");
      }
    }
    if (!Emaildetected) {
      console.log("No new emails were detected in this run.");
    }
    console.log(
      "---------------------------------------------------------------------------------------------------------"
    );
  } catch (e) {
    console.log(e);
  }
};

function timeintervalfunc() {
  let min = 10,
    max = 20;
  let rand = Math.floor(Math.random() * (max - min + 1) + min);
  console.log("Wait for " + rand + " seconds");
  mainfunc(
    "Listed Automation",
    "Hi i am out of office .Will Reach back once i am back!"
  );
  setTimeout(timeintervalfunc, rand * 1000);
}

timeintervalfunc();
