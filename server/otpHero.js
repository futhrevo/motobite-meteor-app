/**
 * Created by Admin on 8/10/2015.
 */

// create emailotp for user
// check if user has already created a OTP
// delete last document if existing
// else create a document with TTL and check counter and send it to user's emails

// create smsotp for user
// check if user has already created a OTP
// delete last document if existing
// else create a document with TTL and check counter send it to user

// verify emailotp for user
// check for userId in the emailotp collection
// check counter value if exceeded ask to create OTP again
// verify the sent code with the document _id
// set the email as verified

// verify smsotp for user
// check for userId in the smsotp collection
// check counter value if exceeded ask to create OTP again
// verify the sent code with the document _id
// set the number as verified