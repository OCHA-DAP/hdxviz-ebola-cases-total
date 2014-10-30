var ebolaVizApp = angular.module("ebolaVizApp", [])
	.controller("ebolaVizController", ["$scope", "dataService", function($scope, dataService) {
		
		$scope.indicators = dataService.getIndicators();
		$scope.selectedIndicator = "population";
		
		$scope.caseTypes = dataService.getCaseTypes();
		$scope.selectedCaseType = "all";
		
		$scope.getCountries = function() {
			$scope.countries = dataService.getCountries();
			$scope.selectedCountry = "Guinea";
			//$scope.countries.unshift({id: "all affected countries", name: "All Affected Countries"});
			//$scope.selectedCountry = "all affected countries";
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
		

		function getCountryChartData(country,caseDefinition) {
			chartData = [];
			dataService.getCountryChartData(country,caseDefinition)
			.success(function (data) {
				for (var i = 0; i < data.length; i++) {
					chartData.push([data[i].case_definition, data[i].location, data[i].period, data[i].value]);
				};
			})
			.error(function (error) {
				alert("Failed to return chart data from the data service");
			});
			return chartData;
		};


		function createCountryCasesChart() {
			chartData = getCountryChartData($scope.selectedCountry, $scope.selectedCaseType + "_cases");
			console.log("Priting data now");
			console.log(chartData.length);
			config = {
				bindto: "#casesChartArea",
				data: {
					rows: chartData,
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
			};
			var casesChart = c3.generate(config);
		};

		function refreshCharts() {
			createCountryCasesChart();
		};


		$scope.onChartOptionsChanged = function() {
			refreshCharts();
		};

	}]);