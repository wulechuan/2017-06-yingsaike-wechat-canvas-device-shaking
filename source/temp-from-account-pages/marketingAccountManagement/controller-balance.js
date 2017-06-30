require('./controller-dialog-draw-cash');

App.lazy.controller('marketingAccountBalance',
    [        '$scope', 'marketingAccountData', 'ngDialog',
	function ($scope,   dataService,            ngDialog) {
        var dialogControllerName = 'marketingAccountDialogDrawCash';
        var dialogTemplate = '/v2/views/marketingAccountManagement/dialog-draw-cash.html';
        var dialogCSSClassName = 'marketing-account-dialog-draw-cash';


        $scope.hasRecords = false; // before data loaded, both are false
        $scope.hasNoRecords = false; // before data loaded, both are false
        $scope.bankDataAreReady = false;
        $scope.allDataAreReady = false;

        $scope.records = [];
        $scope.balanceRecordToDrawCashFrom = null;
        $scope.drawCashFromBalanceOf = drawCashFromBalanceOf;

        getRecords();
        getBankData();

        function updateAllDataAreReadyStatus() {
            $scope.allDataAreReady = $scope.hasRecords && $scope.bankDataAreReady;
        }

        function getRecords() {
            dataService.getBalanceRecords(null,
                function (result) {
                    $scope.records = result;
                    $scope.hasRecords = result.length > 0;
                    $scope.hasNoRecords = result.length < 1;

                    updateAllDataAreReadyStatus();
                }
            );
        }

        function getBankData() {
            dataService.getBankData(null,
                function (result) {
                    $scope.openingBanks = result.openingBanks;
                    $scope.bankAccounts = result.bankAccounts;
                    $scope.bankDataAreReady = true;

                    updateAllDataAreReadyStatus();
                }
            );
        }

        function drawCashFromBalanceOf(record) {
            $scope.balanceRecordToDrawCashFrom = record;

            ngDialog.open({
                closeByNavigation: true,
                closeByDocument: true,

                template: dialogTemplate,
                className: dialogCSSClassName+' ngdialog-theme-default',
                controller: dialogControllerName,
                scope: $scope
            });
        }
    }]);