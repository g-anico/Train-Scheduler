// add firebase config
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBJX6q-UKG440aphT3jFl7Q4E_voeimm-s",
    authDomain: "train-scheduler-a9c80.firebaseapp.com",
    databaseURL: "https://train-scheduler-a9c80.firebaseio.com",
    projectId: "train-scheduler-a9c80",
    storageBucket: "train-scheduler-a9c80.appspot.com",
    messagingSenderId: "1061531359968"
  };
// connect to firebase
firebase.initializeApp(config);
// get a reference to the database via firebase
var database = firebase.database();

$('#add-train').on('click', function() {
  event.preventDefault();
  // collect the data from the html form, create variables to hold the data
  // train name, .... etc
  var trainName = $("#train-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTraintime = $("#firstTrain-input").val().trim();
  var frequency = $("#frequency-input").val().trim();

//when retrieving the "first train" data, make sure to parse it into a Unix timestamp- why?

  var convertTime = moment(firstTraintime, "HH:mm").format("hh:mm A");

  //*console logging the input values
  console.log(trainName);
  console.log(destination);
  console.log(firstTraintime);
  console.log(convertTime);
  console.log(frequency);

  debugger

  //code to `push` that data into firebase (assume that the `child_added` listener updates HTML)
  database.ref().push({
    trainName: trainName,
    destination: destination,
    firstTraintime: firstTraintime,
    frequency: frequency,
   });

  // alert that train was added
  alert("Your train was added!");

  // clear out our HTML form for the next input

    $("#train-input").val("");
    $("#destination").val("");
    $("#firstTraintime").val("");
    $("#frequency").val("");
});

database.ref().on('child_added', function(childSnapshot) {
  console.log('the childSnapshot data', childSnapshot.val());

// create local variables to store the data from firebase

  var trainName = childSnapshot.val().trainName;
  var destination = childSnapshot.val().destination;
  var firstTraintime = childSnapshot.val().firstTraintime;
  var frequency = childSnapshot.val().frequency;
  var convertTime = moment(firstTraintime, "HH:mm").format("hh:mm A");
    console.log(firstTraintime);
    console.log(convertTime);

//using moment.js to convert time into chosen format
  var pastTime = moment(firstTraintime,"hh:mm").subtract(24,"hours");
  console.log(pastTime)
  //current date and time using moment.js
  var currentTime = moment();
// THEN DO THIS MATH
// 1. compute the difference in time from 'now' and the first train, store in var
  var elapsedTime = moment().diff(moment(pastTime),"minutes");
  console.log(elapsedTime);
// 2. get the remainder of time after using `mod` with the frequency, store in var
  var remainder = elapsedTime % frequency;
  console.log(remainder);
// 3. subtract the remainder from the frequency, store in var `timeInMinutes`
  var minutesAway = frequency - remainder;
  console.log(minutesAway);
// 4. format `timeInMinutes` ()"make pretty") and store in var `tArrival`
  var nextArrival = moment(moment().add(minutesAway,"minutes")).format("hh:mm A");
// append to our table of trains, inside the `table body`, with a new row of the train data
   $("#train-table").append(
     "<tr><td>" + trainName + "</td>"
     +"<td>" + destination + "</td>"
     +"<td>" + frequency + "</td>"
     +"<td>" + nextArrival + "</td>"
     +"<td>" + minutesAway + "</td></tr>"
   );
  });
