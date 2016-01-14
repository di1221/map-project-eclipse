var yelpRequest = function(yelpId, callback) {
	
	var auth = {
		
		// authorization tokens.
		consumerKey : "Zq7xesfXgVkNiOHtTK7Blg",
		consumerSecret : "W0YwThiw1nrBiHw3IbKyBMMoYWY",
		accessToken : "XvSWwwt6Z3Ab6aDrzydgAWErZ-40BSG6",
		accessTokenSecret : "QwE0CG1mdl2Y9q3m5A9H_6tq2qY",
		serviceProvider : {
			signatureMethod : "HMAC-SHA1"
		}
	};
	
	var accessor = {
		consumerSecret : auth.consumerSecret,
		tokenSecret : auth.accessTokenSecret
	};
	parameters = [];

	//populate array of yelp search parameters
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
	
			infowindow.setContent("<div>" + data.name + "</div>" + "<div>" + "<div>" + data.location.display_address + "</div>" + 
					"<div>" + "<a href='" + output + "' target=_'blank'>Open in Yelp </a>" + "</div>" + "<div>" + data.review_count + " reviews </div>" +  
					 "<div>" + "<a href='" + output + 
					"' target=_'blank'><img src='images/yelp_powered_btn_red.png' width='129px' height='30px' /></a>" + "</div>");

		}
	  }).fail(function(e){
		   // $('#yelpWindow').text("Error: Yelp data could not be loaded");  //Error handling - Display error message
		  });                                                               //in infowindow if the ajax request does not succeed.
	};