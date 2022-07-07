let siteName = "irottkor";

var slideIndex = 0;
showSlide();

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlide()
{
showSlides(slideIndex += 1);
setTimeout(showSlide, 2000);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1} 
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none"; 
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block"; 
  dots[slideIndex-1].className += " active";
}

function checkpointOpen(id)
{
	document.getElementById("away").style.display = 'none';
	document.getElementById("visited").style.display = 'none';
	var url = "https://irottkor.hu/app/race/1?token=" + getPHPSessId();
	if(id != undefined)
	{
		url = "https://irottkor.hu/app/race/" + id;
	}
	$.get(url).done(function( data ) {
			console.log(data);
			var jason = JSON.parse(data.trim());
			document.getElementById("checkpointTable").innerHTML = "";
			for(var i = 0; i< jason.checkpoints.length; i++)
			{
				document.getElementById("checkpointTable").innerHTML += "<tr><td scope=\"row\" class=\"raceTable\">" + jason.checkpoints[i].name + "</td><td class=\"raceTable\">" + jason.checkpoints[i].distance + " km</td><td class=\"raceTable\">" + jason.checkpoints[i].totalTime + "</td><td class=\"raceTable\">" + jason.checkpoints[i].pace + "</td></tr>";
			}
			document.getElementById("problemCheckInButtonP").innerHTML = jason.totalCheckpoint;
			document.getElementById("totalTime").innerHTML = jason.totalTime;
			document.getElementById("totalPace").innerHTML = jason.pace;
			document.getElementById("nextCheckpointName").innerHTML = jason.nextCheckpoint;
		    document.getElementById("startTimeName").innerHTML = jason.startTime;
			document.getElementById("checkInButton").style.display = 'block';
			document.getElementById("nextCheckpointLabel").style.display = 'block';
			document.getElementById("startTimeLabel").style.display = 'none';
			if(jason.finished > 0)
			{
				document.getElementById("nextCheckpointLabel").style.display = 'none';
				document.getElementById("startTimeLabel").style.display = 'block';
				document.getElementById("checkInButton").style.display = 'none';
			}
			document.getElementById("giveUpButton").style.display = 'none';
			document.getElementById("inProgressLabel").style.display = 'none';
			if(jason.finished == 0)
			{
				document.getElementById("giveUpButton").style.display = 'block';
			}
			if(jason.totalCheckpoint > 0 && jason.finished == 0)
			{
				document.getElementById("startTimeLabel").style.display = 'block';
				document.getElementById("inProgressLabel").style.display = 'block';
			}
			document.getElementById("pay").style.display = 'none';
			if(jason.finished == 3)
			{
				document.getElementById("pay").style.display = 'block';
			}
			if(jason.finished > 0)
			{
				document.getElementById("kerdes0").style.display = 'none';
			}
			document.getElementById("QRCodeID").innerHTML = jason.id;
	});
	$('#checkpoints').modal('show');
}

$('#LoginPassword').on('keydown', function(e) {
    if (e.which == 13) {
        login();
    }
});

function giveUp() {
	if (confirm("Biztos feladod a túrát?")) {
	 	   $.get("https://irottkor.hu/backend/giveup.php")
		  .done(function( data ) {
				if(data.trim() == "Done")
				{
					$('#checkpoints').modal('hide');
					$('#start').modal('show');
				}
		});
	}
}

function logout() {
	$.get("https://irottkor.hu/backend/logout.php")
	  .done(function( data ) {
			document.getElementById("mail").style.display = "none";
			var elements = document.getElementsByName("mobileMail");
			for(var i = 0; i< elements.length; i++)
			{
				elements[i].style.display = "none";
			}
	});
}

function checkIn() {
	  if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(sendGeoData, error);
	  }
}
function error()
{
 alert("Nincs engedélyezve a GPS használat!Kérlek engedélyezd az oldal számára!");
}
function sendGeoData(position)
{
	 	$.post("https://irottkor.hu/backend/checkIn.php", { lat: position.coords.latitude, lng: position.coords.longitude })
		  .done(function( data ) {
				if(data.trim() == "true")
				{
					$('#checkpoints').modal('hide');
					checkpointOpen();
					document.getElementById("visited").style.display = 'block';
					document.getElementById("away").style.display = 'none';
				}
				else
				{
					if(document.getElementById("away").style.display == 'block' && document.getElementById("problemCheckInButtonP").innerHTML > 1)
					{
						document.getElementById("problemCheckInButton").style.display = 'block';
						document.getElementById("problemCheckInButtonHR").style.display = 'block';
					}

					document.getElementById("away").style.display = 'block';
					document.getElementById("visited").style.display = 'none';
				}
		});
}

function RemoveAccents(s) {
  var i = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖŐòóôõöőÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜŰùúûüűÑñŠšŸÿýŽž'.split('');
  var o = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUUuuuuuNnSsYyyZz'.split('');
  var map = {};
  i.forEach((i, idx) => map[i] = o[idx]);
  return s.replace(/[^A-Za-z0-9]/g, function(ch) { return map[ch] || ch; })
}

function monthConverter(month)
{
	switch(RemoveAccents(month.toLowerCase()))
	{
		case "januar":
			return 1;
		case "februar":
			return 2;
		case "marcius":
			return 3;
		case "aprilis":
			return 4;
		case "majus":
			return 5;
		case "junius":
			return 6;
		case "julius":
			return 7;
		case "augusztus":
			return 8;
		case "szeptember":
			return 9;
		case "oktober":
			return 10;
		case "november":
			return 11;
		case "december":
			return 12;
	}
}

function statusConverter(status)
{
	switch (status)
	{
		case '1':
		 return "<span style='color: red;'>Feladva</span>";
		case '2':
		 return "<span style='color: red;'>Időn túli</span>";
		case '3':
		 return "<span style='color: #ffd800;'>Fizetésre vár</span>";
		case '4':
		 return "<span style='color: green;'>Sikeres</span>";
	}
}

function myResults()
{	
	   $.get("https://irottkor.hu/backend/results.php?uid=1")
	   .done(function( data ) {
			var jason = JSON.parse(data.trim());
			document.getElementById("myresultsTable").innerHTML = "";
			for(var i = 0; i< jason.results.length; i++)
			{
				document.getElementById("myresultsTable").innerHTML += "<tr><td class='resultTable'>" + (i+1) + "</td><td class='resultTable'>" + jason.results[i].firstCheckpointTime + "</td><td class='resultTable'>" + jason.results[i].Time + "</td><td scope=\"row\" class='resultTable hide-mobile'>" + statusConverter(jason.results[i].finishes) + "</td><td class='resultTable'><a href=# onclick=\"checkpointOpen('"+ jason.results[i].id +"')\">Részletek...</a></td></tr>";
			}
			
			$('#myresults').modal('show');
		});
}

function results(page)
{
	   var url = "https://irottkor.hu/backend/results.php";
	   if(page != undefined)
	   {
			url += "?page=" + page;
			pageCount = page;
	   }
	   else
	   {
			pageCount = 0;
	   }	
	   $.get(url).done(function( data ) {
			var jason = JSON.parse(data.trim());
			console.log(jason);
			document.getElementById("resultsTable").innerHTML = "";
			for(var i = 0; i< jason.results.length; i++)
			{
				document.getElementById("resultsTable").innerHTML += "<tr><td class='resultTable'>" + (pageCount+i+1) + "</td><td scope=\"row\" class='resultTable'>" + jason.results[i].name + "</td><td class='resultTable hide-mobile'>" + jason.results[i].firstCheckpointTime + "</td><td class='resultTable'>" + jason.results[i].Time + "</td><td class='resultTable'><a href=# onclick=\"checkpointOpen('"+ jason.results[i].id +"')\">Részletek...</a></td></tr>";
			}
			
			if(jason.count <= 15)
			{
				document.getElementById("resultPagination").style.display =  "none";
			}
			else
			{
				document.getElementById("resultPagination").style.display =  "flex";
			}
			var active = page == undefined || page == 0 ? " active" : "";
			var pages = '<li class="page-item' + active + '"><a class="page-link" href="#" onclick="results(0)">1</a></li>';
			for(var i = 15; i< jason.count; i+=15)
			{
				active = page == i ? " active" : "";
				pages += '<li class="page-item' + active + '"><a class="page-link" href="#" onclick="results('+ i +')">'+ ((i+15)/15) +'</a></li>';
			}
			document.getElementById("resultPagination").innerHTML = pages;
			
			if(page == undefined)
			{
				$('#results').modal('show');
			}
		});
}

function login()	{
	var formElements=document.getElementById("loginForm").elements;  
	for(var i = 0; i < formElements.length; i++)
	{
		emptyValidation(formElements[i], i);
	}
	
	var send = true;
	for(var i = 0; i < formElements.length; i++)
	{
		if(formElements[i].className.includes("is-invalid") && formElements[i].name != "")
		{
			send=false;
		}
	}
	
	if(send)
	{
	   $.post("https://irottkor.hu/backend/login.php", $( "#loginForm" ).serialize())
		  .done(function( data ) {
				if(data.trim() == "error")
				{
					document.getElementById("incorrectPassword").style.display = 'block';
				}
				else
				{
					$('#login').modal('hide');
					start();
					loginCheck(false);
				}
		});
	}
}
function loginCheck(popup = true)
{
	document.getElementById("atveteliPont").style.display = "none";
		$.get("https://irottkor.hu/backend/isLoggedIn.php")
		  .done(function( data ) {
			var trimmedData = data.trim();
			if(trimmedData !== "false")
			{
				var elements = document.getElementsByName("mobileMail");
				for(var i = 0; i< elements.length; i++)
				{
					elements[i].style.display = "block";
				}
				document.getElementById("mail").style.display = "block";
				var input = trimmedData.replace("run|", "").split("|");
				document.getElementById("mail").innerHTML = input[0];
				document.getElementById("medalMobile").innerHTML = input[1];
				document.getElementById("medalDesktop").innerHTML = input[1];
				document.getElementById("atveteliPont").style.display = input[2] > 0 ? "block" : "none";
				if(trimmedData.startsWith("run|") && popup)
				{
					checkpointOpen();
				}
			}
		});
}

function run()
{
		$.get("https://irottkor.hu/backend/start.php")
		  .done(function( data ) {
			if(data.trim() == "Done")
			{
				$('#start').modal('hide');
				checkpointOpen();
				checkIn();
			}
		});
}

function start()
{
		$.get("https://irottkor.hu/backend/isLoggedIn.php")
		  .done(function( data ) {
			if(data.trim() == "false")
			{
				$('#login').modal('show');
			}
			else if(data.trim().startsWith("run|"))
			{
				checkpointOpen();
			}
			else 
			{
				$('#start').modal('show');
			}
		});
}

function register()	{
	var formElements=document.getElementById("register").elements;  
	for(var i = 0; i < formElements.length; i++)
	{
		emptyValidation(formElements[i], i);
	}
	
	//password
	var pass = document.getElementById("passwordInput").value;
	var pass2 = document.getElementById("passwordInput2").value;
	showError(pass !== pass2 || pass.length < 8, document.getElementById("passwordInput"));
	showError(pass !== pass2 || pass.length < 8, document.getElementById("passwordInput2"));
	
	//name
	var name = document.getElementById("nameInput").value;
	showError(name.indexOf(' ') == -1, document.getElementById("nameInput"));

	//zipCode
	var zipCode = document.getElementById("ZipCodeInput").value;
	showError(zipCode.length == -1, document.getElementById("ZipCodeInput"));

	//city
	var city = document.getElementById("CityInput").value;
	showError(city.length == -1, document.getElementById("CityInput"));

	//street
	var street = document.getElementById("StreetInput").value;
	showError(street.indexOf(' ') == -1, document.getElementById("StreetInput"));	
			
	//mail
	var mail = document.getElementById("emailInput").value;
	showError(!validateEmail(mail), document.getElementById("emailInput"));
	
	
	//phone
	var phone = document.getElementById("PhoneInput").value;
	showError(!validatePhone(phone), document.getElementById("PhoneInput"));
	
	//year
	var year= document.getElementById("BirthYearInput").value;
	var value = parseInt(year);
	showError(isNaN(value) || value > new Date().getFullYear() || value < 1900, document.getElementById("BirthYearInput"));

	//month
	var month= document.getElementById("BirthMonthInput").value;
	if(!isNaN(month))
	{
		var value = parseInt(month);
		showError(isNaN(value) || value > 12 || value < 1, document.getElementById("BirthMonthInput"));
	}
	else
	{
		showError(isNaN(monthConverter(month)), document.getElementById("BirthMonthInput"));
	}
	//day
	var day= document.getElementById("BirthDayInput").value;
	var value = parseInt(day);
	showError(isNaN(value) || value > 31 || value < 1, document.getElementById("BirthDayInput"));
	
	var send = true;
	for(var i = 0; i < formElements.length; i++)
	{
		if(formElements[i].className.includes("is-invalid") && formElements[i].name != "")
		{
			send=false;
		}
	}
	
	if(send)
	{
		$.post("https://irottkor.hu/backend/register.php", $( "#register" ).serialize())
		  .done(function( data ) {
			if(data.trim() == "Done")
			{
				document.getElementById("successfullRegistration").style.display = 'block';
				$('#registration').modal('hide');
				$('#login').modal('show');
			}
			else
			{
				document.getElementById("incorrectMail").style.display = 'block';
				showError(true, document.getElementById("emailInput"));
			}
		});
	}
}

	function emptyValidation(item, index) {
		showError(item.value == "", item);
	}
	
	function showError(condition, item)
	{
	  if(condition)
	  {
		item.className += ' is-invalid';
	  }
	  else
	  {
		item.className = item.className.replace(/ is-invalid/g,'');
	  }
	}
	
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

	
function validatePhone(phone) {
  var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return re.test(phone);
}


function pageLoad()
{
	emailCheck();
	loginCheck();
	getOnWay(siteName);
	getRecords(siteName);
}

function emailCheck() {
	var hash = getUrlParameter("jelszo");
	if(hash !== undefined)
	{
		$.get("https://irottkor.hu/backend/emailPass.php?hash="+ hash)
		  .done(function( data ) {
			if(data.trim() != 'false')
			{
				$('#forgottPass').modal('show');
				document.getElementById("InputForgotEmailNew").value = data.trim();
			}
		});

	}
}
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

function changeData()
{
	if(document.getElementById("password-tab").className.includes("active"))
	{
		//password
		var oldPass = document.getElementById("InputCurrentPassword").value;
		var pass = document.getElementById("InputNewPassword").value;
		var pass2 = document.getElementById("InputNewPassword2").value;
		showError(pass !== pass2 || pass.length < 8, document.getElementById("InputNewPassword"));
		showError(pass !== pass2 || pass.length < 8, document.getElementById("InputNewPassword2"));
		showError(oldPass.length < 8, document.getElementById("InputCurrentPassword"));
		
		if(!document.getElementById("InputNewPassword").className.includes("is-invalid") 
			&& !document.getElementById("InputCurrentPassword").className.includes("is-invalid"))
		{
			$.post("https://irottkor.hu/backend/emailChange.php", { newPassword: pass, password: oldPass })
				.done(function( data ) {
					if(data.trim() == "true")
					{
						document.getElementById("successfullNewMail").style.display = "block";
					}
					else
					{
						showError(true, document.getElementById("InputCurrentPassword"));
					}
			});
		}
	}
	else if(document.getElementById("address-tab").className.includes("active"))
	{
		//zip
		var zipCode = document.getElementById("InputPostalCode").value;
		showError(zipCode.length == 0, document.getElementById("InputPostalCode"));
		
		//city
		var city = document.getElementById("InputCity").value;
		showError(city.length == 0, document.getElementById("InputCity"));
		
		//address
		var address = document.getElementById("InputAddress").value;
		showError(address.length == 0, document.getElementById("InputAddress"));
		
		if(!document.getElementById("InputPostalCode").className.includes("is-invalid") 
		&& !document.getElementById("InputCity").className.includes("is-invalid") 
		&& !document.getElementById("InputAddress").className.includes("is-invalid"))
		{
			$.post("https://irottkor.hu/backend/addressChange.php", { zipCode: zipCode, location: city, address: address })
				.done(function( data ) {
					document.getElementById("successfullNewAddress").style.display = "block";
			});
		}
	}
	else
	{
		//phone
		var phone = document.getElementById("InputCurrentPhone").value;
		showError(!validatePhone(phone), document.getElementById("InputCurrentPhone"));
		
		if(!document.getElementById("InputCurrentPhone").className.includes("is-invalid"))
		{
			$.post("https://irottkor.hu/backend/phoneChange.php", { newPhone: phone })
				.done(function( data ) {
					document.getElementById("successfullNewPhone").style.display = "block";
			});
		}
	}
}

function openSettings()
{
	$.get("https://irottkor.hu/backend/settings.php")
	  .done(function( data ) {
		var jason = JSON.parse(data.trim());
		document.getElementById("InputCurrentPhone").value = jason.phone;
		document.getElementById("InputPostalCode").value = jason.zipcode;
		document.getElementById("InputCity").value = jason.city;
		document.getElementById("InputAddress").value = jason.address;
		$('#settings').modal('show');
	});
}

function gpxUpload()
{
	$('#start').modal('hide');
	$('#trackUpload').modal('show');
}

function sendGPXUploadRequest()
{
	var fd = new FormData();
	var files = document.getElementById('trackFile').files;
	


	// Check file selected or not
	if(files.length > 0 ){
		document.getElementById("upload-button").style.display = "none";
		document.getElementById("upload-spinner").style.visibility = "visible";
	   fd.append('track',files[0]);
	   fd.append('mail', document.getElementById("mail").innerHTML);
	   
	   $.ajax({
		  url: 'https://irottkor.hu/app/upload',
		  type: 'post',
		  data: fd,
		  contentType: false,
		  processData: false,
		  success: function(response){
				document.getElementById("file-upload-error").innerHTML = "";
				document.getElementById('file-name').innerHTML = "";
				document.getElementById("upload-button").style.display = "block";
				document.getElementById("upload-spinner").style.visibility = "hidden";
				$('#trackUpload').modal('hide');
				checkpointOpen(response);
		  },
		  error: function (xhr, ajaxOptions, thrownError) {
			switch(xhr.status)
			{
				case 400:
					document.getElementById("file-upload-error").innerHTML = "Hiányzó fájl.";
					break;
				case 413:
					document.getElementById("file-upload-error").innerHTML = "Túl nagy méret.";
					break;
				case 415:
					document.getElementById("file-upload-error").innerHTML = "Nem megfelelő fájl formátum.";
					break;
				case 417:
					document.getElementById("file-upload-error").innerHTML = "Hiányos fájl.";
					break;
				default:
					document.getElementById("file-upload-error").innerHTML = "Ismeretlen hiba.";
					console.log(xhr);
			}
			document.getElementById("upload-button").style.display = "block";
			document.getElementById("upload-spinner").style.visibility = "hidden";
		  }
	   });
	}
}

document.getElementById("trackFile").addEventListener('change', (event) => {
	document.getElementById('file-name').innerHTML = document.getElementById('trackFile').files[0].name;
  });

function sendGeoDataWithoutCheck(position)
{
	document.getElementById("problemCheckInButton").style.display = 'none';
	document.getElementById("problemCheckInButtonHR").style.display = 'none';
	$.ajax({
        url: "https://irottkor.hu/app/checkin/withoutcheck",
        type: 'POST',
        data: { lat: position.coords.latitude, lng: position.coords.longitude, mail: document.getElementById("mail").innerHTML},
        success: function(data){
				if(data.trim() == "true")
				{
					$('#checkpoints').modal('hide');
					checkpointOpen();
					document.getElementById("visited").style.display = 'block';
					document.getElementById("away").style.display = 'none';
				}
				else
				{
					document.getElementById("away").style.display = 'block';
					document.getElementById("visited").style.display = 'none';
				}
		}});
}


///Delete

