
var markerArray = [];
var map;
var marker;

	//creates initial map location and controls
	var asheville = new google.maps.LatLng(35.559139, -82.567327);
	var map = new google.maps.Map($('#map')[0], {
		  center: asheville,
		  zoom: 12
	}); 
	
	//listener for resize function	
	google.maps.event.addDomListener(window, 'resize',
		 resize);
	//makes map responsive keeping focus at map center  
	function resize() {
		map.setCenter(asheville);
	}
	  
	 //set variable for google maps info window popup
	  infowindow = new google.maps.InfoWindow();
	
	//create Restaurant Object, set variable to ko.observables  
	var Restaurant = function(name, lat, lng, address, website, yelpId) {
		this.name = ko.observable(name);
		this.lat = ko.observable(location.lat);
		this.lng = ko.observable(location.lng);
		this.address = ko.observable(address);
		this.website = ko.observable(website);	
		this.yelpId = ko.observable(yelpId);

		
	//creates a marker for each Restaurant location	
	this.marker = new google.maps.Marker({
		position: new google.maps.LatLng(lat, lng),
		map: map,
		optimized: false //stops marker from flashing
	});

	  //this is the array to hold all of the map markers	
	  markerArray.push(marker);
	  //create animation effect on marker
	  this.marker.setAnimation(google.maps.Animation.DROP);

	  //event listener to open google infoWindow when marker is clicked.  Displays values for each of the variables
	  google.maps.event.addListener(this.marker, 'click', function() {
		  
		  	//call yelp request function in yelpApi.js
			yelpRequest(yelpId, function(data) {}); 
			//opens window for selected marker - populated with yelp data
			infowindow.open(map, this);
	  });

	

	  //function is used to hide or show markers on the map
	  this.isVisible = ko.observable(true);
 
	  this.isVisible.subscribe(function(currentState) {	  
	    if (currentState) {  
	      this.marker.setMap(map);
	    } else { 
	      this.marker.setMap(null);
	    }
	  }.bind(this)); 
	};
	

	


		
	var viewModel = function() {

		 //make location observable
		  this.locations = ko.observableArray([]);
		  //push each restaurant object from restaurants array into this.locations
		  restaurants.forEach(function(restaurant){		  
		    this.locations.push(new Restaurant(restaurant.name, restaurant.location.lat, restaurant.location.lng, restaurant.address, restaurant.website, restaurant.yelpId));	
		  }, this); 

		  //Search query, bound to #searchBox input field
		  this.filter = ko.observable('');	 
		  //search query filter
		  this.filteredItems = ko.dependentObservable(function() {

		    var filter = this.filter().toLowerCase();	
		    //If there is no search query, keep all markers and locations visible 
		    if(!filter) {
		      ko.utils.arrayFilter(this.locations(), function(location) {
		    	  location.isVisible(true);
		      });	      
		      return this.locations();
		    } else {  	   	
		        return ko.utils.arrayFilter(this.locations(), function(location) {
		          //Match search query to location names
		          var doesMatch = location.name().toLowerCase().indexOf(filter) >= 0;
		          //Display only markers that match search query  
		          	location.isVisible(doesMatch);
		          //Display only locations that match in the list
		          return doesMatch;
		        });
		    }	
		  }, this);	

		  
		//click event listener for marker of selected restaurant
		this.listSelect = function(clickedRestaurant) {
		    lat = clickedRestaurant.marker.position.lat;
		    lng = clickedRestaurant.marker.position.lng;
		    
		    //sets up infoWindow
		    infowindow.setContent('<div>' + clickedRestaurant.name() + '</div>' + '<div>' + clickedRestaurant.address() + '</div>' + 
		    		'<div>' + lat() + " , " + lng() + '</div>' + '<div><a href=http://' + clickedRestaurant.website() + ' target=_"blank">' + 
		    		clickedRestaurant.website() + '</a></div>');

			//sets the position for each marker selected and create and time limited animation effect
		    clickedRestaurant.marker.setPosition(new google.maps.LatLng(lat(),lng()));
			clickedRestaurant.marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){ clickedRestaurant.marker.setAnimation(null); }, 1200);
			infowindow.open(map, clickedRestaurant.marker);
		}

	};
	ko.applyBindings(new viewModel());