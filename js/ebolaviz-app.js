var ebolaVizApp = angular.module("ebolaVizApp", [])
	.controller("ebolaVizController", ["$scope", "dataService", function($scope, dataService) {
		
		$scope.indicators = dataService.getIndicators();
		$scope.selectedIndicator = "population";
		
		$scope.caseTypes = dataService.getCaseTypes();
		$scope.selectedCaseType = "all";
		
		$scope.getCountries = function() {
			dataService.getCountries()
			.success(function (countries) {
				$scope.countries = countries;
			}).failure(function (error) {
				$scope.countries = [];
			}).then(function(data) {
				var allCountries = {id: "all", name: "All Affected Countries"};
				$scope.countries.unshift(allCountries);
			});
		};
		
		$scope.getHeadlineFigures = function() {
			$scope.headlineFigures = dataService.getHeadlineFigures();
			//.success(function (data) {
			//	$scope.headlineFigures = data;
			//}).failure(function (error) {
			//	$scope.headlineFigures = {};
			//});
		};
		$scope.getHeadlineFigures();
		
		
		$scope.showCharts = function(bindToElement) {
			config = {
			};
			return c3.generate(config);
		};
		//$scope.showCharts();
		
	}]);