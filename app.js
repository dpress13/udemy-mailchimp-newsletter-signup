const express = require("express");
const app = express();
const mailchimp = require("@mailchimp/mailchimp_marketing");
const path = require('path');  // Native Node Module that comes with Node
const port = 3333;
// Go here to get custom CSS
app.use('/assets', express.static(path.join(__dirname, 'assets'))); 
// Allows you to GET / pull info from the body of the post request and fetch the data based on the input - which here is cityName.
app.use(express.urlencoded({extended: true})); 
// Send the signup.html file from server to browser when home / root is requested / called
app.get("/", function (req, res) {
	res.sendFile(__dirname + "/signup.html");
});
mailchimp.setConfig({
	apiKey: "c7619b1c86ed36462ec6ae4ef6e113fd-us6",
	server: "us6"
});
// As soon as the Signup button is pressed, parse this data from browser and post to local server
app.post("/", function (req,res) {
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const email = req.body.email;
	const listId = "f848367ac9";

// Create a data object with the user's data
	const subscriber = {
		firstName: firstName,
		lastName: lastName,
		email: email
	};
// Upload data to MailChimp server
	async function run() {
	const response = await mailchimp.lists.addListMember(listId, {
		email_address: subscriber.email,
		status: "subscribed",
		merge_fields: {
			FNAME: subscriber.firstName,
			LNAME: subscriber.lastName
		}
	});
	
	res.sendFile(__dirname + "/success.html");
 // console.log(`Successfully added contact as an audience member. The contact's id is ${ response.id }.`);
	};
// Running the function to catch any errors
// Catch statement is executed when there is an error so if anything goes wrong the code in the catch code is executed. Here we're sending back the failure page.
	run().catch(e => res.sendFile(__dirname + "/failure.html"));
});

app.post('/success', function(req, res){
	res.redirect('/');
});

app.post('/failure', function(req, res){
	res.redirect('/');
});

app.listen(process.env.PORT || port, () => { // Use Heroku chosen port or use 'port' locally
  console.log(`Server is running on port ${port}.`)
});

