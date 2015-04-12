1. A POST /sendLocation API

Submits check-in from any domain. The mandatory fields and exact field names for submission to this API are login, lat, and lng. Successful submission of these three pieces of data results in one entry into the collection locations in Mongo. If a submission is missing any one of the data fields, the following JSON is sent as the response: {"error":"Whoops, something is wrong with your data!"}. 

2. A GET /location.json API

Returns a JSON string, one object, of the last known location for a specified login. The mandatory parameter for this API is login. If login is empty or no results found, return empty JSON object {}

3. / - Home, the root, the index in HTML

Accessing this on a web browser displays a list of the check-ins for all logins sorted in descending order by timestamp --the last person who checked-in is displayed first. 



Worked with:	Michael Seltzer, Dan Callahan
Time: 			5 hours