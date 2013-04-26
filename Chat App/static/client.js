var chat = {
	initSocket: function() {
		chat.socket = io.connect("http://128.237.196.29:8888");
		$('#input').keydown(function() {
	        if (event.keyCode == 13) {
	            chat.sendMessageClick();
	            return false;
	         }
	    });
		$("#chatform").submit(chat.sendMessageClick);
		chat.status();
		chat.newmsg();
		//console.log(input)
	},

	sendMessageClick: function() {
	// send the msg event, with some data
	    var input = $("#input").val();
	    if (input === "") return; 
	    $("#input").val("");
	    var date = new Date();
	    var data = {body: input, date: date.toString()};
	    chat.socket.emit('msg', data);
	    //console.log("data.date", data.date);
		//console.log("new date", new Date());
	    chat.writeMessage(input, date);
	    return false;
	},

	repeat: function(input, currentTime, msgAlign)	{
		var stamp = "AM";
		if (currentTime.getHours() >= 12) stamp = "PM";
		var hour = 12;
		if (currentTime.getHours() !== 12) hour = currentTime.getHours() % 12;
		var minute = currentTime.getMinutes();
		if (minute < 10) minute = "0" + minute;
		var time = hour + ":" + minute + stamp;

	    var li = $("<li>");
	    var innerDiv = $("<div>");
	    innerDiv.addClass("entry");
	    var timeDiv = $("<div>");
	    timeDiv.html(time);
	    timeDiv.css("text-align", "center");
	    timeDiv.css("padding", "2px");
	    timeDiv.css("font-size", "11px");
	    timeDiv.css("color", "gray");
	    var innerP = $("<p>");
	    innerP.css("padding", "10px");
	    innerP.css("text-align", msgAlign);
	    innerP.html(input);
	    innerDiv.append(timeDiv);
	    innerDiv.append(innerP);
	    if (msgAlign === "right")
	    	innerDiv.css("background-color", "rgba(175,238,238,.2)");
	    li.append(innerDiv);
	    $("#messages").append(li);
	    var bigDiv = $("#messagesContainer");
	    bigDiv[0].scrollTop = bigDiv[0].scrollHeight;
	},

	status: function() {
		chat.socket.on("status", function(data) {
		    if (data.success) {
		      console.log("Message successfully sent");
		    } else {
		      console.log("Message failed to send");
		    }
		});
	},

	writeMessage: function(input, date)	{
		var currentTime = date;
		chat.repeat(input, currentTime, "right");
	},


	newmsg: function() {
		chat.socket.on("newmsg", function(data) {
			var currentTime = new Date(data.date);
			chat.repeat(data.body, currentTime, "left");
		});
	}
}

$(document).ready(function() {
	chat.initSocket();
});

