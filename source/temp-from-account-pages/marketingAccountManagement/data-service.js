// var mockData = require('./data-mock');
// var mockDataDelay = 678; // in milliseconds

App.lazy.factory('marketingAccountData',
    [        '$_post',
	function ($_post) {
        var apiBalanceRecords = '/dealer/feeaccount';
        var apiAllOtherData = '/dealer/feetrade';
        var apiDrawCashData = '/dealer/marketingwithdrawlist';
 
 
        var keyOfActivities = 'TOP5_MKT_FEE';
        var keyOfCashingRecords = 'TOP5_CASH_REQUEST';
        var keyOfTradingRecords = 'TOP5_TRANS_LOG';
 
        var usedBalanceRecordForInvoiceData = 0;
        var keyOfInvoiceRecipient = 'saicInvoiceRecipient';
        var keyOfInvoiceRecipientTelephone = 'saicInvoiceRecipientTelephone';

        var keyOfOpeningBanks = 'OPENING_BANK';
        var keyOfBankAccounts = 'bankAccount';









        var isFetchingBalanceRecords = false;
        var balanceRecordsPromisedActions = [];
        var balanceRecordsCache = null;

        var isFetchingAllOtherData = false;
        var allOtherDataPromisedActions = [];
        var allOtherDataCache = null;

        return {
            getBalanceRecords: getBalanceRecords,
            getInvoiceData: getInvoiceData,

            getDrawCashData: getDrawCashData,
            getBankData: getBankData,

            getCashingRecords: getCashingRecords,
            getTradingRecords: getTradingRecords,
            getActivitiesRecords: getActivitiesRecords,
        };







        function getBalanceData(dataToSend, onFetched, shouldIgnoreCache) {
            if (balanceRecordsCache && !shouldIgnoreCache) {
                // console.warn('Cached balnce data used.');
                onFetched(balanceRecordsCache);
            } else {
                // setTimeout(function () {
                //     console.error(ReferenceError('正在使用本地伪造数据！'));
                //     onSuccess(mockData.balanceRecords);
                // }, mockDataDelay);

                balanceRecordsPromisedActions.push(onFetched);

                if (!isFetchingBalanceRecords) {
                    isFetchingBalanceRecords = true;

                    $_post(apiBalanceRecords, null,
                        onBalanceRecordsFetchedSuccessfully,
                        function (error) {
                            isFetchingBalanceRecords = false;
                        }
                    );
                }
            }
        }

        function onBalanceRecordsFetchedSuccessfully(result) {
            for (var i = 0; i < balanceRecordsPromisedActions.length; i++) {
                var promisedAction = balanceRecordsPromisedActions[i];
                if (typeof promisedAction === 'function') promisedAction(result);
            }

            balanceRecordsCache = result;

            isFetchingBalanceRecords = false;
            balanceRecordsPromisedActions.length = 0;
        }

        function getAllOtherData(dataToSend, onFetched, shouldIgnoreCache) {
            if (!!allOtherDataCache && !shouldIgnoreCache) {
                // console.warn('Cached other data used.');
                onFetched(allOtherDataCache);
            } else {
                // setTimeout(function () {
                //     console.error(ReferenceError('正在使用本地伪造数据！'));
                //     onSuccess(mockData.allOtherData);
                // }, mockDataDelay);

                allOtherDataPromisedActions.push(onFetched);

                if (!isFetchingAllOtherData) {
                    isFetchingAllOtherData = true;

                    $_post(apiAllOtherData, dataToSend,
                        onAllOtherDataFetchedSuccessfully,
                        function (error) {
                            isFetchingAllOtherData = false;
                        }
                    );
                }
            }
        }

        function onAllOtherDataFetchedSuccessfully(result) {
            for (var i = 0; i < allOtherDataPromisedActions.length; i++) {
                var promisedAction = allOtherDataPromisedActions[i];
                if (typeof promisedAction === 'function') promisedAction(result);
            }

            allOtherDataCache = result;

            isFetchingAllOtherData = false;
            allOtherDataPromisedActions.length = 0;
        }



        function getBalanceRecords(dataToSend, onFetched, shouldIgnoreCache) {
            getBalanceData(dataToSend, function(result) {
                if (typeof onFetched !== 'function') return;

                var evaluatedRecords = result;
                onFetched(evaluatedRecords);
            }, shouldIgnoreCache);
        }

        function getInvoiceData(dataToSend, onFetched, shouldIgnoreCache) {
            getBalanceData(dataToSend, function(result) {
                if (typeof onFetched !== 'function') return;

                var usedRecord = result[usedBalanceRecordForInvoiceData];
                if (!usedRecord) {
                    // deal with the absence.
                } else {
                    var evaluatedData = {
                        recipient: usedRecord[keyOfInvoiceRecipient],
                        telephone: usedRecord[keyOfInvoiceRecipientTelephone]
                    };
                    onFetched(evaluatedData);
                }
            }, shouldIgnoreCache);
        }

        function getDrawCashData(dataToSend, onFetched) {
            $_post(apiDrawCashData, dataToSend, onFetched);
        }

        function getBankData(dataToSend, onFetched, shouldIgnoreCache) {
            getAllOtherData(dataToSend, function(result) {
                if (typeof onFetched !== 'function') return;

                var evaluatedData = {
                    openingBanks: result[keyOfOpeningBanks][0],
                    bankAccounts: result[keyOfBankAccounts]
                };

                onFetched(evaluatedData);
            }, shouldIgnoreCache);          
        }

        function getCashingRecords(dataToSend, onFetched, shouldIgnoreCache) {
            getAllOtherData(dataToSend, function(result) {
                if (typeof onFetched !== 'function') return;

                var evaluatedRecords = result[keyOfCashingRecords];
                onFetched(evaluatedRecords);
            }, shouldIgnoreCache);
        }

        function getTradingRecords(dataToSend, onFetched, shouldIgnoreCache) {
            getAllOtherData(dataToSend, function(result) {
                if (typeof onFetched !== 'function') return;

                var evaluatedRecords = result[keyOfTradingRecords];
                onFetched(evaluatedRecords);
            }, shouldIgnoreCache);
        }

        function getActivitiesRecords(dataToSend, onFetched, shouldIgnoreCache) {
            getAllOtherData(dataToSend, function(result) {
                if (typeof onFetched !== 'function') return;

                var evaluatedRecords = result[keyOfActivities];
                onFetched(evaluatedRecords);
            }, shouldIgnoreCache);
        }
    }]);
