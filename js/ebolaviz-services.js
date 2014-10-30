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
		url = urlBase + "/sql?q=SELECT * from VW_HEADLINE_FIGURES";
		return $http.get(url);
    }

    this.getCasesChartData = function(location,caseDef) {
    	var command = "Select * From VW_LATEST_FIGURES ";
    	var whereClause = "";
    	if (location && caseDef) {
    		whereClause = " WHERE location='" + location + "' AND case_definition='" + caseDef + "' ";
    	} else if (location) {
    		whereClause = " WHERE location='" + location + "'";
    	} else if (caseDef) {
    		whereClause = " WHERE case_definition='" + caseDef + "'";
    	}
    	command += whereClause + " Order By value DESC";
    	return $http.get(urlBase + "/sql?q="+command);
    }
}]);