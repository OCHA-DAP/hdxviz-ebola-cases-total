ebolaVizApp.service("dataService", ["$http", function($http) {
	
	var urlBase = "https://ds-ec2.scraperwiki.com/hkiw9sb/ky9zjrxscneu7mg";
	var sqlEndpointUrlBase = "https://ds-ec2.scraperwiki.com/hkiw9sb/ky9zjrxscneu7mg/sql?q=";
	
	this.getCountries = function() {
		return [
			{id: "All affected countries", name: "All affected countries"},
			{id: "Liberia", name: "Liberia"},
			{id: "Guinea", name: "Guinea"},
			{id: "Sierra Leone", name: "Sierra Leone"},
			{id: "Mali", name: "Mali"},
			{id: "Spain", name: "Spain"},
			{id: "United States of America", name: "United States of America"},
			{id: "Nigeria", name: "Nigeria"},
			{id: "Senegal", name: "Senegal"}
		];
	};
	
    this.getCaseTypes = function() {
		return [
			{id: "all", name: "All definitions"},
			{id: "confirmed", name: "Confirmed"},
			{id: "probable", name: "Probable"},
			{id: "suspected", name: "Suspected"}
		];
	};
	
	this.getIndicators = function() {
		return [
			{id: "population", name: "Entire population"},
			{id: "workers", name: "Health workers"}
		];
	};
	
    this.getHeadlineFigures = function() {
		var url = urlBase + "/sql?q=SELECT * from VW_HEADLINE_FIGURES";
		return $http.get(url);
    };

    this.getCountryChartData = function(location,caseDefinition) {
		var sql = "Select * From VW_RAW_DATA " + buildLocationCaseDefinitionWhereClause(location, caseDefinition) + " Order By value ASC";
		return $http.get(sqlEndpointUrlBase + sql);
    };

    this.getLatestFiguresPromise = function(location, caseDefinition) {
    	var sql = "SELECT * from VW_LATEST_FIGURES" + buildLocationCaseDefinitionWhereClause(location, caseDefinition) + " Order By value ASC";
    	console.log(sql);
		return $http.get(sqlEndpointUrlBase + sql);
    };

    this.getRawDataPromise = function(location, caseDefinition) {
    	var sql = "Select * From VW_RAW_DATA " + buildLocationCaseDefinitionWhereClause(location, caseDefinition) + " Order By value ASC";
		return $http.get(sqlEndpointUrlBase + sql);
    };

    this.getCountriesPromise = function() {
    	var sql = "Select DISTINCT location from Observations Order By location";
    	return $http.get(sqlEndpointUrlBase + sql);
    };

    this.getPeriodsPromise = function() {
    	var sql = "Select DISTINCT perion from Observations Order By period";
    	return $http.get(sqlEndpointUrlBase + sql);
    };

    function buildLocationCaseDefinitionWhereClause(location, caseDefinition) {
		var whereClause = "";
		if (location && caseDefinition) {
			whereClause = " WHERE location='" + location + "' AND case_definition='" + caseDefinition + "' ";
		} else if (location) {
			whereClause = " WHERE location='" + location + "'";
		} else if (caseDefinition) {
			whereClause = " WHERE case_definition='" + caseDefinition + "'";
		};
		return whereClause;
    };

}]);