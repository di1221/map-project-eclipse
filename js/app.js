
var markerArray = [];
var map;
var marker;

	//function initMap() {
		
		var markerArray = [];
		
		var asheville = new google.maps.LatLng(35.559139, -82.567327);
		var map = new google.maps.Map($('#map')[0], {
		  center: asheville,
		  zoom: 12,
		  mapTypeControl: false,
		  panControl: false,
		  streetViewControl: false,
		  zoomControl: false
		}); 		
	

	  infowindow = new google.maps.InfoWindow();
	

	var Restaurant = function(name, lat, lng, address, website) {
		this.name = ko.observable(name);
		this.lat = ko.observable(location.lat);
		this.lng = ko.observable(location.lng);
		this.address = ko.observable(address);
		this.website = ko.observable(website);	

	    //};
		
	this.marker = new google.maps.Marker({
		position: new google.maps.LatLng(lat, lng),
		map: map,
		optimized: false //stops marker from flashing
	});

	  markerArray.push(marker);
	  this.marker.setAnimation(google.maps.Animation.DROP);

	  google.maps.event.addListener(this.marker, 'click', function() {
	    infowindow.setContent('<div>' + restaurants.name + '</div>' + '<div>' + restaurants.address + '</div>' + '<div>' + restaurants.location.lat + " , " + restaurants.location.lng + '</div>' + '<div><a href=http://' + restaurants.website + '>' + restaurants.website + '</a></div>');
	    infowindow.open(map, this);
	  });

	
	  this.isVisible = ko.observable(true);
 
	  //Hides or show markers on the map
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
		    this.locations.push(new Restaurant(restaurant.name, restaurant.location.lat, restaurant.location.lng, restaurant.address, restaurant.website));	
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

		  /*Opens infowindow when location on list is clicked*/
		  this.openLocationWindow = function(clickedLocation) {
		    clickedLocation.openInfoWindow();
		  };
		
		
	/*	
		
		var self = this;
		self.restaurants = ko.observableArray([]);
		self.query = ko.observable('');
	
		restaurants.forEach(function (restaurant) {
			self.restaurants.push(new Restaurant(restaurant));
		});

		self.restaurants = ko.dependentObservable(function() {
			var search = self.query().toLowerCase();
	        return ko.utils.arrayFilter(restaurants, function(restaurant) {

	        if(restaurant.name.toLowerCase().indexOf(search) >= 0){

	            return restaurant.name.toLowerCase().indexOf(search) >= 0;
	        };

	 		});
		}, restaurants);


		this.listSelect = function(clickedRestaurant) {

		    infowindow.setContent('<div>' + clickedRestaurant.name + '</div>' + '<div>' + clickedRestaurant.address + '</div>' + '<div>' + clickedRestaurant.location.lat + " , " + clickedRestaurant.location.lng + '</div>' + '<div><a href=http://' + clickedRestaurant.website + '>' + clickedRestaurant.website + '</a></div>');


			//marker.setPosition(new google.maps.LatLng(position));
			//marker.setAnimation(google.maps.Animation.BOUNCE);
			//setTimeout(function(){ marker.setAnimation(null); }, 1200);
			//infowindow.open(map, marker);
		}
*/
	};
	ko.applyBindings(new viewModel());