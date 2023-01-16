function getMeteo(){
	fetch('/api', {headers: {'Content-Type': 'application/json', 'Accept-Encoding' : 'application/json'}})
		.then((response) => response.json())
		.then((data) => updateMeteo(data));
}

function updateMeteo(newData){
	if(newData.length > 0){
		console.table(newData[0]);
		const container = document.getElementById("features_elements").getElementsByTagName("div");
		for(let i = 0; i < container.length; ++i){
			let meteoElem = container[i];
			let elemVisibility = "visible";
			if(i < newData.length){
				meteoElem.getElementsByTagName("h4")[0].innerHTML = newData[i].city;
				meteoElem.getElementsByTagName("p")[0].innerHTML = "Temperature : " + newData[i].degree + "°C";
			}else{
				elemVisibility = "hidden";
			}
			meteoElem.style.visibility = elemVisibility;
		}
	}else{
		console.log("Empty Response");
		console.log(newData);
	}
}

setInterval(getMeteo, 6000);