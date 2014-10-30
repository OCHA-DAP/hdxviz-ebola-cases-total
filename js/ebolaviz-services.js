ebolaVizApp.service("dataService", ["$http", function($http) {
	
	var urlBase = "https://ds-ec2.scraperwiki.com/hkiw9sb/ky9zjrxscneu7mg";
	
	this.getCountries = function() {
		return [
			{id: "Liberia", name:"Liberia"},
			{id: "Guinea", name:"Guinea"},
			{id: "Mali", name:"Mali"},
			{id: "Sierra Leone", name:"Sierra Leone"},
			{id: "Nigeria", name:"Nigeria"},
			{id: "Spain", name:"Spain"},
			{id: "United States of America", name:"United States of America"},
			{id: "Senegal", name:"Senegal"}
		];
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
			all_deaths: 4922,
			confirmed_deaths: 0,
			probable_deaths: 0,
			suspected_deaths: 0
		};
		//return $http.get("https://ds-ec2.scraperwiki.com/hkiw9sb/ky9zjrxscneu7mg/sql?q=SELECT * from VW_HEADLINE_FIGURES");
    }
}]);