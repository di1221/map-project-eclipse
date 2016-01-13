var yelpRequest = function(yelpId, callback) {
	
	var auth = {
		//
		// Update with your auth tokens.
		//
		consumerKey : "Zq7xesfXgVkNiOHtTK7Blg",
		consumerSecret : "W0YwThiw1nrBiHw3IbKyBMMoYWY",
		accessToken : "XvSWwwt6Z3Ab6aDrzydgAWErZ-40BSG6",
		accessTokenSecret : "QwE0CG1mdl2Y9q3m5A9H_6tq2qY",
		serviceProvider : {
			signatureMethod : "HMAC-SHA1"
		}
	};
	
	//var near = 'Asheville';
	//var reviews = 'reviews';
	
	var accessor = {
		consumerSecret : auth.consumerSecret,
		tokenSecret : auth.accessTokenSecret
	};
	parameters = [];
	
	console.log(window.restaurants);
	
	parameters.push(['callback', 'cb']);
	parameters.push(['yelpId', 'yelpId']);
	parameters.push(['oauth_consumer_key', auth.consumerKey]);
	parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
	parameters.push(['oauth_token', auth.accessToken]);
	parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
	
	var message = {
		'action' : 'http://api.yelp.com/v2/business/' + yelpId,
		'method' : 'GET',
		'parameters' : parameters
	};
	
	
	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign(message, accessor);
	var parameterMap = OAuth.getParameterMap(message.parameters);
	parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)

	$.ajax({
		'url' : message.action,
		'data' : parameterMap,
		'cache' : true,
		'dataType' : 'jsonp',
		'jsonp' : 'callback',
		'success' : function(data, textStats, XMLHttpRequest) {
			callback(data.business);
			var output = data.mobile_url;
	console.log(data);	
			infowindow.setContent("<div>" + data.name + "</div>" + "<div>" + "<div>" + data.location.display_address + "</div>" + "<div>" + "<a href='" + output + "'>Open on Yelp </a>" + "</div>" + "<div>" + "<img src='" + data.image_url +  "'/>"  + "</div>" + "<div>" + "<a href='" + output + "'><img src='images/yelp_powered_btn_red.png' width='129px' height='30px' /></a>" + "</div>");

			//infowindow.setContent("<div>" + "<a href='" + output + "'>View on Yelp </a>" + "</div>" + "<div>" + "<img src='" + data.image_url +  "'/>"  + "</div>" + "<div>" + "<a href='" + output + "'><img src='images/yelp_powered_btn_red.png' width='129px' height='30px' /></a>" + "</div>");
			
			//infowindow.open(map, this);


			$('infowindow').append(output);
		}
	  }).fail(function(e){
		   // $('#yelpWindow').text("Error: Yelp data could not be loaded");  //Error handling - Display error message
		  });                                                               //in infowindow if the ajax request does not succeed.
	};