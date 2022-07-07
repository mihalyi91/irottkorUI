function GPSTest() {
	if (navigator.geolocation) {
	  navigator.geolocation.getCurrentPosition(GPSTestSuccess, error);
	}
}

function GPSTestSuccess(){
	alert("A beállítások rendben vannak.");
}

function checkInWithoutGPSCheck()
{
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(sendGeoDataWithoutCheck, error);
	  }
}

function getRecords(trail)
{
	$.get("https://irottkor.hu/app/records?trail=" + trail)
	.done(function( data ) {
		var jason = JSON.parse(data.trim());
		document.getElementById("recordWomanName").innerHTML = jason.FastestWoman.name;
		document.getElementById("recordWomanTime").innerHTML = jason.FastestWoman.time;
		document.getElementById("recordManName").innerHTML = jason.FastestMan.name;
		document.getElementById("recordManTime").innerHTML = jason.FastestMan.time;
		document.getElementById("recordMostWomanName").innerHTML = jason.MostWoman.map(x => x.name);
		document.getElementById("recordMostWomanTime").innerHTML = jason.MostWoman[0].times + ' db';
		document.getElementById("recordMostManName").innerHTML = jason.MostMan.map(x => x.name);
		document.getElementById("recordMostManTime").innerHTML = jason.MostMan[0].times + ' db';
		document.getElementById("recordMostRaceADayName").innerHTML = jason.MostRaceOnADay.name;
		document.getElementById("recordMostRaceADayCount").innerHTML = jason.MostRaceOnADay.count + ' db';
		document.getElementById("recordMostRaceADaySumTime").innerHTML = jason.MostRaceSum.timeSum;
		document.getElementById("recordMostRaceADaySumTimeUserName").innerHTML = jason.MostRaceSum.name;
		
	});
}

function sectionRecords(trail, gender)
{
	$.get(`https://irottkor.hu/app/sectionRecords?trail=${trail}`)
	  .done(function( data ) {
		var jason = JSON.parse(data.trim());
		var gender = ["", "Male", "Female"]
		for(var k = 0; k < 3; k++)
		{
			document.getElementById("sectionRecordsTable"+gender[k]).innerHTML = "";
			for(var i = 0; i< jason.fastestsections.length; i++)
			{
				document.getElementById("sectionRecordsTable"+gender[k]).innerHTML += "<tr><td scope=\"row\" class='resultTable'>" + jason["fastestsections"+gender[k]][i].Section + "</td><td class='resultTable'>" + jason["fastestsections"+gender[k]][i].Fastest + "</td><td class='resultTable'>" + jason["fastestsections"+gender[k]][i].FastestTime + "</td><td class='resultTable'></td></tr>";
			}
		}
		$('#sectionRecords').modal('show');
	});
}

function getOnWay(trail)
{
	$.get(`https://irottkor.hu/app/onway?trail=${trail}`)
		.done(function( data ) {
			var jason = JSON.parse(data.trim());
			if(jason.walkers.length > 0)
			{
				for(var i = 0; i< jason.walkers.length; i++)
				{
					document.getElementById("onwayTable").innerHTML += "<tr><td scope=\"row\">" + jason.walkers[i].name + "</td><td>" + jason.walkers[i].startTime + "</td><td class='hide-mobile'>" + jason.walkers[i].checkpoints + " db</td><td>" + jason.walkers[i].finishes + "</td></tr>";
				}
			}
			else
			{
				document.getElementById("onwayFullTable").style.display = 'none';
				document.getElementById("onwayEmpty").style.display = 'block';
			}
		});
}

function pickupPoint()
{
	$('#pickupPointModal').modal('show');
}

function forgotMailSend()
{
	//password
	var pass = document.getElementById("passwordNewInput").value;
	var pass2 = document.getElementById("passwordNewInput2").value;
	showError(pass !== pass2 || pass.length < 8, document.getElementById("passwordNewInput"));
	showError(pass !== pass2 || pass.length < 8, document.getElementById("passwordNewInput2"));

	if(!document.getElementById("passwordNewInput").className.includes("is-invalid"))
	{
		$.post("https://irottkor.hu/backend/emailPass.php", { hash: getUrlParameter('jelszo'), password: pass })
		  .done(function( data ) {
				if(data.trim() == "true")
				{
					document.getElementById("successfullForgottNewMail").style.display = "block";
				}
		});
	}
}

function forgotMail() {
	 	$.get(`https://irottkor.hu/app/mailPassword?mail=${document.getElementById("InputForgotEmail").value}`)
		  .done(function( data ) {
			document.getElementById("successfullForgottMail").style.display = "block";
		});
}

function getPHPSessId(){
    var jsId = document.cookie.match(/TIRuserID=[^;]+/);
    if(jsId != null) {
        if (jsId instanceof Array)
            jsId = jsId[0].substring(10);
        else
            jsId = jsId.substring(10);
    }
    return jsId;
}

console.log(getPHPSessId());