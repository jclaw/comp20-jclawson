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
		data = JSON.parse("data.json");
		console.log(data);
		console.log(xhr.responseText);
		document.getElementById("messages").innerHTML = xhr.responseText;
	}
}