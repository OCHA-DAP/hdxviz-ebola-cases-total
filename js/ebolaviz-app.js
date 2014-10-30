var ebolaVizApp = angular.module("ebolaVizApp", [])
	.controller("ebolaVizController", ["$scope", "dataService", function($scope, dataService) {
		
		$scope.indicators = dataService.getIndicators();
		$scope.selectedIndicator = "population";
		
		$scope.caseTypes = dataService.getCaseTypes();
		$scope.selectedCaseType = "all";
		
		$scope.getCountries = function() {
			$scope.countries = dataService.getCountries();
			$scope.countries.unshift({id: "all affected countries", name: "All Affected Countries"});
			$scope.selectedCountry = "all affected countries";
			//.success(function (countries) {
			//	$scope.countries = countries;
			//}).failure(function (error) {
			//	$scope.countries = [];
			//}).then(function(data) {
			//	var allCountries = {id: "all", name: "All Affected Countries"};
			//	$scope.countries.unshift(allCountries);
			//});
		};
		$scope.getCountries();
		
		$scope.getHeadlineFigures = function() {
			dataService.getHeadlineFigures()
			.success(function (data) {
				$scope.headlineFigures = data;
			})
			.error(function (error) {
				$scope.headlineFigures = {};
				log.print(error.toString());
			});
		};
		$scope.getHeadlineFigures();
		
		
		$scope.showCasesChart = function() {
			config = {
				bindto: "#casesChartArea",
				data: {
					columns: [
						['data1', 30, 200, 100, 400, 150, 250],
						['data2', 130, 100, 140, 200, 150, 50]
					],
					type: 'bar'
				},
				bar: {
					width: {
						ratio: 0.5 
					}
				},
				size: {
					height: 300
				},
				padding: {
					right: 20
				}		
			};
			return c3.generate(config);
		};
		
		$scope.showCasesChart("#casesChartArea");
		
	}]);