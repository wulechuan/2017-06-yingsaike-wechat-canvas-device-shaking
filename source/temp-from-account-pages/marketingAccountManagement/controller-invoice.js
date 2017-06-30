App.lazy.controller('marketingAccountInvoice',
    [        '$scope', 'marketingAccountData',
	function ($scope,   dataService) {
        $scope.hasData   = false; // before data loaded, both are false
        $scope.hasNoData = false; // before data loaded, both are false
        $scope.data = null;

        getData();

        function getData() {
            dataService.getInvoiceData(null,
                function (result) {
                    $scope.data = result;
                    $scope.hasData = !!result;
                    $scope.hasNoData = !result;
                }
            );
        }
    }]);