'use strict';

// Import Admin SDK
const admin = require("firebase-admin");
const executePython = require('../../executePython');

const serviceAccount = require("./daikin-lirc-pi-firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL
});

// Get a database reference to our posts
const db = admin.database();
const ref = db.ref("history_events");

console.log("init firebase...");

function startListenEvent() {
	// Attach an asynchronous callback to read the data at our posts reference
	ref.on("value", function(snapshot) {
	  console.log(snapshot.val());
	}, function (errorObject) {
	  console.log("The read failed: " + errorObject.code);
	});

	// Retrieve new posts as they are added to our database
	ref.on("child_added", function(snapshot, prevChildKey) {
  		var newEvent = snapshot.val();
  		console.log("Fan: " + newEvent.fan);
  		//console.log("Title: " + newPost.title);
  		//console.log("Previous Post ID: " + prevChildKey);
  		var airConModel = newEvent;
  		executePython.execute(airConModel);
	});
}

module.exports = {
  startListenEvent
}
