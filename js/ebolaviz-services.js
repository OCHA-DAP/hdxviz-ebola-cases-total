ebolaVizApp.service("dataService", ["$http", function($http) {
	
	var urlBase = "https://ds-ec2.scraperwiki.com/hkiw9sb/ky9zjrxscneu7mg";
	
	this.getCountries = function() {
		return [
			{id: "lbr", name:"Liberia"},
			{id: "gin", name:"Guinea"},
			{id: "lbr", name:"Liberia"},
			{id: "mli", name:"Mali"},
			{id: "sle", name:"Sierra Leone"},
			{id: "nga", name:"Nigeria"},
			{id: "esp", name:"Spain"},
			{id: "usa", name:"United States of America"},
			{id: "sen", name:"Senegal"}
		];
		return $http.get(urlBase + "/sql?q=SELECT * from VW_COUNTRIES");
	};
	
    this.getCaseTypes = function() {
		return [
			{id: "all", name: "All case definitions"},
			{id: "confirmed", name: "Confirmed cases"},
			{id: "probable", name: "Probable cases"},
			{id: "suspected", name: "Suspected cases"}
		]
	};
	
	this.getIndicators = function() {
		return [
			{id: "population", name: "Entire population"},
			{id: "workers", name: "Health workers"}
		]
	};
	
    this.getHeadlineFigures = function() {
		return {all_cases: 13703,
			confirmed_cases: 0,
			probable_cases: 0,
			suspected_cases: 0,
			all_deaths: 4920,
			confirmed_deaths: 0,
			probable_deaths: 0,
			suspected_deaths: 0
		};
		return $http.get(urlBase + "/sql?q=SELECT * from VW_HEADLINE_FIGURES")
    }
}]);