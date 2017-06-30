App.lazy.factory('marketingTradingDetailsData',
    [        '$_post',
	function ($_post) {
        var apiCashingRecords = '/dealer/feetrade/info';
        var keyOfCashingRecords = 'tradeDetail';

        var isFetchingData = false;
        var dataFetchingPromisedActions = [];

        return {
            getRecords: getRecords
        };

        function getData(queryData, onFetched) {
            dataFetchingPromisedActions.push(onFetched);

            if (!isFetchingData) {
                isFetchingData = true;

                var dataToSendDefault = {
                    accountType: '',
                    approvalStatus: '',
                    payStatus: '',
                    requestStartDate: '',
                    requestEndDate:   '',

                    page: 0,
                    size: 20 // max records per page
                };

                var dataToSend = angular.extend({}, dataToSendDefault, queryData);

                $_post(apiCashingRecords, dataToSend,
                    onDataFetchedSuccessfully,
                    function (error) {
                        isFetchingData = false;
                    }
                );
            }
        }

        function onDataFetchedSuccessfully(result) {
            for (var i = 0; i < dataFetchingPromisedActions.length; i++) {
                var promisedAction = dataFetchingPromisedActions[i];
                if (typeof promisedAction === 'function') promisedAction(result);
            }

            isFetchingData = false;
            dataFetchingPromisedActions.length = 0;
        }

        function getRecords(queryData, onFetched) {
            getData(queryData, function(result) {
                if (typeof onFetched !== 'function') return;

                var records = result[keyOfCashingRecords];
                var evaluatedData = {
                    records: records,
                    totalRecordsCount: result.totalSize,
                    paginationCurrentIndex: result.page,
                    paginationTotalPagesCount: result.totalPage
                };

                onFetched(evaluatedData);
            });
        }
    }]);
