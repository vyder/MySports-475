var boxNumber = "";
var nextBoxNumber = 2;
var mainUser = "Varun";
var mainPassword = "test";

function displayData(box, data, dataCategory, t) {
		switch (dataCategory) {
			case "player":
				console.log("ASDASDASD");
				$(box + ' .sportsWrapper').css("backgroundImage", "url('assets/images/logos/"+t.toLowerCase()+".png')");
				var statsHTML = setBoxHTML(data);
				var modalHTML = setModalHTML(data);
				$(box + ' .sportsContent').html(statsHTML);
				$('.modal-trigger-area').css("display", "block");
				$(box + ' > .modal').html(modalHTML);
				break;
			case "team":
				$(box + ' .sportsWrapper').css("backgroundImage", "url('assets/images/logos/"+t.toLowerCase()+".png')");
				var boxNum = box.charAt(box.length -1);
				$(box + ' .sportsContent').html("<b>"+displayTeamName(t)+" &nbsp;" +"</b><br /><hr><b>Offense</b><br/> Third Down Efficiency: &nbsp;" + roundToTwo(data.third_down_efficiency.pct)+"%<br />Red Zone Efficiency: &nbsp;" + roundToTwo(data.redzone_efficiency.pct)+"%<br /><br/><b>Defense</b><br/> Forced fumbles: &nbsp;"+data.defense.force_fum+"<br />Interceptions: &nbsp;"+data.defense.int+"<br/>Punts: &nbsp;"+data.punting.punts + "<br/><a href='#modal" + boxNum + "' class='modal-trigger'>See More</a>");
				$(box + ' > .modal').html("here it is");
				setModals();
				break;
			case "stats":
				break;
			case "standings":
				setNFLStandingsHTML(data, function(tableString, modalString) {
					var displayModalText = "<a href="
					$(box + ' .sportsContent').html("<b><u> Standings for " + data.name + "</u></b><br />" + tableString);
					$(box + ' > .modal').html("<b><u> Standings for " + data.name + "</u></b><br />" + modalString);
				});
					break;
			case "nhlStandings":
				var str = "<table class='standings-table'><thead><th>Team</th><th>Wins</th><th>Losses</th><th>OTL</th><th>Points</th></thead><tbody>";
				for(var i = 0; i < data.teams.length; i++) {
					str += "<tr><td>" + data.teams[i]['name'] + "</td>";
					str += "<td>" + data.teams[i]['wins'] + "</td>";
					str += "<td>" + data.teams[i]['losses'] + "</td>";
					str += "<td>" + data.teams[i]['overtime_losses'] + "</td>";
					str += "<td>" + data.teams[i]['points'] + "</td></tr>"
				}
				str += "</tbody></table>";
				$(box + ' .sportsContent').html("<b><u> Standings for " + data.name + " conference</u></b><br />" + str);
				$(box + ' > .modal').html("here it is");
				break;
			case "nhlTeam":
				$(box + ' .sportsContent').html("we out here");
				break;
			default:
				break;
		}
	}

function setNFLStandingsHTML(data, callback) {
	var tableStr = "<table class='standings-table'><thead><th>Team</th><th>Wins</th><th>Losses</th><th>Ties</th></thead><tbody>";
	for(var i = 0; i < data.teams.length; i++) {
		tableStr += "<tr><td>" + data.teams[i]['name'] + "</td>";
		tableStr += "<td>" + data.teams[i]['overall']['wins'] + "</td>";
		tableStr += "<td>" + data.teams[i]['overall']['losses'] + "</td>";
		tableStr += "<td>" + data.teams[i]['overall']['ties'] + "</td></tr>";
	}
	tableStr += "</tbody></table>";
	var modalString = "<table class='standings-table'><thead><th>Team</th><th>Wins</th><th>Losses</th><th>Ties</th><th>Last 5</th><th>Streak</th><th>Point Differential</th><th>Scored First</th><th>Leading At Half</th><th>Decided by 7</th></thead><tbody>";
	for(var i = 0; i < data.teams.length; i++) {
		modalString += "<tr><td>" + data.teams[i]['name'] + "</td>";
		modalString += "<td>" + data.teams[i]['overall']['wins'] + "</td>";
		modalString += "<td>" + data.teams[i]['overall']['losses'] + "</td>";
		modalString += "<td>" + data.teams[i]['overall']['ties'] + "</td>";
		modalString += "<td>" + data.teams[i]['last_5']['wins'] + '-' + data.teams[i]['last_5']['losses'] + "-" + data.teams[i]['last_5']['ties'] + "</td>";
		modalString += "<td>" + data.teams[i]['streak']['type'] + " " + data.teams[i]['streak']['length'] + "</td>";
		modalString += "<td>" + data.teams[i]['points']['net'] + "</td>";
		modalString += "<td>" + data.teams[i]['scored_first']['wins'] + '-' + data.teams[i]['scored_first']['losses'] + "-" + data.teams[i]['scored_first']['ties'] + "</td>";
		modalString += "<td>" + data.teams[i]['leading_at_half']['wins'] + '-' + data.teams[i]['leading_at_half']['losses'] + "-" + data.teams[i]['leading_at_half']['ties'] + "</td>";
		modalString += "<td>" + data.teams[i]['decided_by_7_points']['wins'] + '-' + data.teams[i]['decided_by_7_points']['losses'] + "-" + data.teams[i]['decided_by_7_points']['ties'] + "</td></tr>";
	}
	return callback(tableStr, modalString);
}

function setBoxHTML(data) {
	var position = data.position;
	var summary = render("summary_header", data);
	switch(position) {
		case "QB":
			summary += render("summary_quarterback", data);
			break;
		case "WR":
			summary += render("summary_wide_receiver", data);
			break;
		case "RB":
			summary += render("summary_running_back", data);
			break;
		default:
			summary += "Working on it"
			break;
	}
	return summary;
}

// MODAL
function setModalHTML(data) {
	var position = data.position;
	// QUARTERBACK
	if(position === "QB") {
		return render("basicInfo", data) + render("passing", data) + render("rushing", data) + render("fumbles", data);
	} else if(position === "WR") { // WIDE RECEIVER
		var modalString = render("basicInfo", data) + render("receiving", data);

		if(parseInt(data.penalty.num) != 0) {
			console.log("IM HERE");
			modalString += render("penalties", data);
		}
		if(parseInt(data.kick_return.returns) != 0) {
			modalString += render("kick_returns", data);
		}
		if(parseInt(data.punt_return.returns) != 0) {
			modalString += render("punt_returns", data);
		}
		return modalString;

	} else if(position === "RB") { // RUNNING BACK
		var modalString = render("basicInfo", data) + render("rushing", data) + render("receiving", data);

		if(parseInt(data.penalty.num) != 0) {
			modalString += render("penalties", data);
		}
		if(parseInt(data.kick_return.returns) != 0) {
			modalString += render("kick_returns", data);
		}
		if(parseInt(data.punt_return.returns) != 0) {
			modalString += render("punt_returns", data);
		}
		return modalString;

	} else {
		return "We're working on it";
	}
}

function popup(box) {
	$("#teamRadio").prop("checked", true);
	box2 = box.substr(1);
	console.log(box2);
	var p = getElementTopLeft(box2);
	console.log(p.top);
	document.getElementById("players").style.display = "none";
	document.getElementById("standingsDropdowns").style.display = "none";
	document.getElementById("nhlStandingsDropdowns").style.display = "none";
	document.getElementById("dialog-form").style.left = p.left +"px";
	document.getElementById("dialog-form").style.top = p.top + "px";
	document.getElementById("dialog-form").style.display = "block";
	document.getElementById("submit").style.display = "block";
	document.getElementById("nhlTeamDropdown").style.display = "none";
	boxNumber = "";
	boxNumber = box;
}

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

function populatePlayerList(t){
	console.log('populatePlayerList');
    var select = document.getElementById("playerList");
		select.className += select.className ? ' chosen-select' : 'chosen-select';

    select.options.length = 0;
    $.ajax({
		type: "POST",
		dataType: "json",
	  url: "/getTeamRoster",
	  data: {teamName: t}
	}).done(function(data) {
	  //alert("done");
	  console.log("done");
	  console.log(data);
	   for (var i = 0; i < data.length - 1; i++) {
        var opt = data[i].player.name_last + ", " + data[i].player.name_first;
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = data[i].player.name_full;
        select.appendChild(el);
      }
			setChosen();
			console.log("here");
			$(".chosen-select").trigger("chosen:updated");
	}).fail(function(xhr, status, error){
		//alert("fail");
		console.log(xhr);
		console.log(status);
		console.log(error);
	});

}

function getData (box, urlText, dataCategory, d, t) {
		if(t) {
			t = t.toUpperCase();
		}

		$.ajax({

		type: "POST",
		dataType: "json",
	  	url: urlText,
	  	data: d
		}).done(function(data) {

		  console.log("done");
		  console.log(data);
		  displayData(box, data, dataCategory, t);
		}).fail(function(xhr, status, error){
			console.log(xhr);
			console.log(status);
			console.log(error);
		});
		return true;
}

// Main Function
$(function() {
	$.ajax({
			type: "GET",
			dataType: "json",
		  	url: "/users",
			}).done(function(data) {
			  console.log("USERS MAN");
			  console.log(data);
			  
			}).fail(function(xhr, status, error){
				console.log("NOOOOOO");
				console.log(xhr);
				console.log(status);
				console.log(error);
		});
	// Login button
	$('#login').on('click', function (e) {
		e.preventDefault();
		var username = $('#username').val()
		var password = $('#password').val()
		$.ajax({
			type: "POST",
			dataType: "json",
		  	url: "/login",
		  	data: {username: username, password: password}
			}).done(function(data) {
			  console.log("done");
			  console.log(data);
			  
			}).fail(function(xhr, status, error){
				console.log("NOOOOOO");
				console.log(xhr);
				console.log(status);
				console.log(error);
		});
	});


	$( "#sortable" ).sortable();
	$( "#sortable" ).disableSelection();


	$('.form').on('submit', function (e) {
		e.preventDefault();
		document.getElementById("dialog-form").style.display = "none";

  	var category = $(this).find("input[name='category']:checked").val()
  	console.log(category);
  	var t = $(this).find('select[name="team"]').val();
  	var p = $(this).find('select[name="player"]').val();
		var c = $(this).find('select[name="conference"]').val();
		var d = c + "_" + $(this).find('select[name="division"]').val();
		var nhlConference = $(this).find('select[name="nhlConference"]').val();
		var nhlTeam = $(this).find('select[name="nhlTeam"]').val();

		createTile(category, t, p, c, d, nhlConference, nhlTeam);
	    // deferred = $.post("http://somewhere.com", { val: val });

	    // deferred.success(function () {
	    //     Do your stuff.
	    // });

	    // deferred.error(function () {
     //    Handle any errors here.});
	});

	$('.teamList').on('change', function () {
		if ($("input[name='category']:checked").val() == "player") {
		    //player is checked so populate team list
		    var e = document.getElementById("teams");
				var strUser = e.options[e.selectedIndex].value;
				populatePlayerList(strUser);
		}
		return true
	});
});

function createTile(category, t, p, c, d, nhlConference, nhlTeam) {
	switch(category) {
	    	case "team":
	    		console.log("IN CASE STATEMENT TEAM");
	    		data = {team: t}
	    		getData(boxNumber, "/getTeamInfo", category, data, t);
	    		break;
	    	case "player":
		    	console.log("IN CASE STATEMENT PLAYER");
		    	data = { player: p, team: t};
		    	getData(boxNumber, "/getPlayerInfo", category, data, t);
	    		break;
			case "standings":
				console.log("IN CASE STATEMENT standings");
				data = { conference: c, division: d };
				console.log(data);
				getData(boxNumber, "/getNFLStandings", category, data);
				break;
			case "nhlStandings":
				console.log("IN CASE STATEMENT NHL STANDINGS");
				data = { conference: nhlConference };
				getData(boxNumber, "/getNHLStandings", category, data);
				break;
			case "nhlTeam":
				console.log("IN CASE STATEMENT NHL TEAM");
				data = { team: nhlTeam };
				getData(boxNumber, "/getNHLTeamInfo", category, data, nhlTeam);
				break;
	    	default:
		    	console.log("IN CASE STATEMENT DEFAULT");
	    		break;

	    }

	    nextBoxID = "box" + nextBoxNumber;
	   	$('#sortable').append('<li class="ui-state-default" id="' + nextBoxID + '"><div class="sportsWrapper"><div id="logo">&nbsp;</div><div class="sportsContent"><a id = "' + nextBoxID + '" onclick="popup(\'#' + nextBoxID + '\')" class="button addNew">Add Sports Data</a></div><div class="modal-trigger-area"><a href="#modal' + nextBoxNumber + '" class="modal-trigger">More Details</a></div></div><div id="modal' + nextBoxNumber + '" class="modal"></div></li>');
	    nextBoxNumber += 1;
			setModals();
}


function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

function getElementTopLeft(id) {
    var ele = document.getElementById(id);
    var top = 0;
    var left = 0;
    while(ele.tagName != "BODY") {
        top += ele.offsetTop;
        left += ele.offsetLeft;
        ele = ele.offsetParent;
    }
    return { top: top, left: left };
}