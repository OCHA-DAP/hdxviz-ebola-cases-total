var ebolaVizApp = angular.module("ebolaVizApp", [])
	.controller("ebolaVizController", ["$scope", "dataService", function($scope, dataService) {
		
		$scope.indicators = dataService.getIndicators();
		$scope.selectedIndicator = "population";
		
		$scope.caseTypes = dataService.getCaseTypes();
		$scope.selectedCaseType = "all";

		$scope.countries = dataService.getCountries();
		if ($scope.countries.length > 0) {
			$scope.selectedCountry = $scope.countries[0].id;
		};
		
		function refreshHeadlineFigures() {
			dataService.getHeadlineFigures()
			.success(function (data) {
				$scope.headlineFigures = {};
				for (var i = 0; i < data.length; i++) {
					$scope.headlineFigures[data[i].case_definition] = data[i].value;
				}
			})
			.error(function (error) {
				$scope.headlineFigures = {};
				alert("Failed to get headline figures");
			});
		};
		refreshHeadlineFigures();
		
		function generateCountryCasesChart(bindElement, isCases) {
			var postfix = (isCases) ? "_cases": "_deaths";
			dataService.getCountryChartData($scope.selectedCountry, $scope.selectedCaseType + postfix)
			.success(function (data) {
				config = {};
				config.bindto = bindElement;
				config.data = {};
				config.data.json = data;
				config.data.keys = {};
				config.data.keys.x = "period";
				config.data.keys.value = ["value"];
				config.data.type = "bar";
				
				config.axis = {};
				config.axis.x = {};
				config.axis.y = {};
				
				config.axis.x.type = "category";
				config.axis.y.type = "timeseries";
						
				config.size = {};
				config.size.height = 240;

				return c3.generate(config);
			})
			.error(function (error) {
				alert("Failed to return chart data from the data service");
			});	
		};
		
	
		function refreshCharts() {
			var casesChart = generateCountryCasesChart("#casesChartArea", isCases=true);
			var deathsChart = generateCountryCasesChart("#deathsChartArea", isCases=false);
		};


		$scope.onChartOptionsChanged = function() {
			refreshCharts();
		};
		
		refreshCharts();

	}]);