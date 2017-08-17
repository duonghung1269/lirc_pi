'use strict';

// Import Admin SDK
const config = require("../../config.json")[process.env.NODE_DEV || 'dev'];
const admin = require("firebase-admin");
const executePython = require('../../executePython');

const serviceAccount = require("./daikin-lirc-pi-firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.database 
});

// Get a database reference to our posts
const db = admin.database();
const ref = db.ref("history_events");

console.log("init firebase...");

function startListenEvent() {
	// Attach an asynchronous callback to read the data at our posts reference
	// ref.on("value", function(snapshot) {
	//   console.log(snapshot.val());
	// }, function (errorObject) {
	//   console.log("The read failed: " + errorObject.code);
	// });

	// Get the data on a post that has changed
	db.ref("lastEvent").on("child_changed", function(snapshot) {
		console.log('============= On remote child_changed==========');
  		var valueChanged = snapshot.val();
		var keyChanged = snapshot.val();
		console.log(`${keyChanged}: ${valueChanged}`)
		db.ref("lastEvent").once("value", function(snapshot1) {
	           	console.log(snapshot1.val());
		   		executePython.execute(snapshot1.val());
	        }, function (errorObject) {
	        	console.log("The read failed: " + errorObject.code);
        	});				
	});

	// TODO: This event will load even just start npm, so need to check by timestamp for new added Event after start only
//	ref.on("child_added", function(snapshot, prevChildKey) {
  //		var newEvent = snapshot.val();
  //		console.log("Fan: " + newEvent.fan);
  		//console.log("Title: " + newPost.title);
  		//console.log("Previous Post ID: " + prevChildKey);
  //		var airConModel = newEvent;

  		// TODO: Validation time stamp here
  		// and validate password if needed
//  		executePython.execute(airConModel);
//	});

}

module.exports = {
  startListenEvent
}
