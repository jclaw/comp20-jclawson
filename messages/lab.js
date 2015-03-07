function parse() {
	xhr = new XMLHttpRequest();
	xhr.open("get", "data.json", true);
	xhr.onreadystatechange = myCallbackFunction;
	xhr.send();



}

function myCallbackFunction() {
	if (xhr.readyState == 4 && xhr.status == 200) {
		data = JSON.parse("data.json");
		document.getElementById("messages").innerHTML = xhr.responseText;
	}
}