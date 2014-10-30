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
				$scope.headlineFigures = {};
				for (var i = 0; i < data.length; i++) {
					$scope.headlineFigures[data[i].case_definition] = data[i].value;
				}
			})
			.error(function (error) {
				$scope.headlineFigures = {};
			});
		};
		$scope.getHeadlineFigures();
		
		$scope.createChartConfigBase = function (binding,data) {
			return {
				bindto: binding,	
				data: {
					rows: data,
					type: "bar",
					x: "location",
				},			
				color: {
					pattern: ['#dd1c77', '#756bb1', '#e41a1c']
				},
				size: {
					height: 260
				},
				padding: {
					right: 20
				}
			}
		};

		$scope.getCasesChartData = function () {
			country = $scope.selectedCountry
			if ($scope.selectedCountry == "all affected countries") {
				country = "";
			};
			dataService.getCasesChartData(country,$scope.selectedCaseType + "_cases")
			.success(function (data) {
				$scope.casesChartData = [];
				for (var i = 0; i < data.length; i++) {
					$scope.casesChartData[$scope.casesChartData.length] = [data[i].case_definition, data[i].location, data[i].period, data[i].value];
				};
			})
			.error(function (error) {
				$scope.casesChartData = [];
			});
		};
		
		$scope.showCharts = function() {

			//$scope.deathsChart = c3.generate($scope.createChartConfigBase("#deathsChartArea", $scope.getDeathsChartData()));
			
			$scope.getCasesChartData();
			$scope.casesChart = c3.generate($scope.createChartConfigBase("#casesChartArea", $scope.casesChartData));
			console.log($scope.casesChartData);
		};
	}]);