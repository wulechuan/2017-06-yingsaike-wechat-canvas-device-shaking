App.lazy.controller('marketingAccountCashingRecords',
    [        '$scope', 'marketingAccountData',
	function ($scope,   dataService) {
        $scope.records = [];

        dataService.getCashingRecords(null, function (result) {
            $scope.records = result;
        });
    }]);




App.lazy.controller('marketingAccountTradingRecords',
    [        '$scope', 'marketingAccountData',
	function ($scope,   dataService) {
        $scope.records = [];

        dataService.getTradingRecords(null, function (result) {
            $scope.records = result;
        });
    }]);




App.lazy.controller('marketingAccountActivities',
    [        '$scope', 'marketingAccountData',
	function ($scope,   dataService) {
        $scope.records = [];

        dataService.getActivitiesRecords(null, function (result) {
            $scope.records = result;
        });
    }]);