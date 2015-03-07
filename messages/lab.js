function parse() {
	console.log("In parse function");
	xhr = new XMLHttpRequest();
	xhr.open("get", "data.json", true);
	xhr.onreadystatechange = myCallbackFunction;
	xhr.send();



}

function myCallbackFunction() {
	console.log("In my callback function " + xhr.readyState);
	if (xhr.readyState == 4 && xhr.status == 200) {
		data = JSON.parse(xhr.responseText);
		console.log(data);
		var result = "";
		for (i = 0; i < data.length; i++) {
			result += "<p>" + data[i].content + " - " + data[i].username + "</p>";
		}
		document.getElementById("messages").innerHTML = result;
	}
}