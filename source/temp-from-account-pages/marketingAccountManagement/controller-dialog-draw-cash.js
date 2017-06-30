App.lazy.controller('marketingAccountDialogDrawCash',
    [        '$scope', 'marketingAccountData', '$_post', '$_notify',
	function ($scope,   dataService,            $_post,   $_notify) {
        var apiSubmission = '/dealer/feepayment/apply';

        var sourceScopt = $scope.$parent.$parent;

        var usedRecord = sourceScopt.balanceRecordToDrawCashFrom;
        var openingBanks = sourceScopt.openingBanks;
        var bankAccounts = sourceScopt.bankAccounts;

        var knownBankCodes = {};

        // 须提交的数据格式
        var formData = {
            cashAmount: NaN,
            accountType: '',
            accountNumber: '',
            accountBank: '',
            dealerSettingRequestMO: {
                // codes: {},
                name: '银行卡号',
                settings: 'bankAccount'
            },
            id: '',
            mktCode: '',
            invoiceCode: '', // 发票编号
            trackNumber: '' // 快递单号
        };


        // 状态值
        $scope.currentStageIndex = NaN;
        $scope.hasRecords = false;
        $scope.hasNoRecords = false;
        $scope.recordsAreNotReady = true;
        $scope.recordsAreReady = false;
        $scope.bankAccountCandidatesListIsShowing = false;
        $scope.isWaitingForNetwork = false;


        // 公开数据
        $scope.accountBankName = '';
        $scope.accountBankBrank = '';
        $scope.usedRecord = usedRecord;
        $scope.openingBanks = openingBanks;
        $scope.bankAccounts = bankAccounts;



        // 公开方法
        $scope.closeDialog = closeDialog;
        $scope.showDrawingCashForm = gotoStage2;
        $scope.toggleBankAccountCandidatesList = toggleBankAccountCandidatesList;
        $scope.chooseBankAccountCandidate = chooseBankAccountCandidate;
        $scope.submit = submit;



        // 一些必须延后进行的初始化动作
        setTimeout(function () {
            delayedInitializations();
            gotoStage1();
        }, 0);





        function delayedInitializations() {
            // 以下数据应该使用副本，因为用户可能手工更改它们


            // 开户行；注意：这不是最终须提交的数据。
            $scope.accountBankName = bankAccounts[0].name;

            // 开户支行；注意：这不是最终须提交的数据。
            $scope.accountBankBrank = usedRecord.accountBank;

            formData.cashAmount = usedRecord.cashAmount;
            formData.accountType = usedRecord.accountType;
            formData.accountNumber = usedRecord.accountNumber;

            for (var i=0; i< bankAccounts.length; i++) {
                var bankAccount = bankAccounts[i];
                knownBankCodes[bankAccount.code] = [
                    bankAccount.name,
                    bankAccount.value
                ].join();
            }

            $scope.formData = formData;
        }

        function closeDialog() {
            $scope.$parent.closeThisDialog();            
        }

        function gotoStage1() {
            $scope.currentStageIndex = 1;
            getDrawCashData();
        }

        function gotoStage2() {
            $scope.currentStageIndex = 2;
        }



        function toggleBankAccountCandidatesList() {
            $scope.bankAccountCandidatesListIsShowing = !$scope.bankAccountCandidatesListIsShowing;
        }

        function closeBankAccountCandidatesList() {
            $scope.bankAccountCandidatesListIsShowing = false;
        }

        function chooseBankAccountCandidate(bankAccount) {
            $scope.formData.accountNumber = bankAccount.code;
            $scope.accountBankName = bankAccount.name;
            $scope.accountBankBrank = bankAccount.value;

            closeBankAccountCandidatesList();
        }


        function getDrawCashData() {
            var requestData = {
                accountType: usedRecord.accountType,
                balance: usedRecord.balance
            };

            dataService.getDrawCashData(requestData,
                function (result) {
                    $scope.recordsAreReady = !!result;
                    $scope.recordsAreNotReady = !result;
                    $scope.hasRecords = !!result && result.length > 0;
                    $scope.hasNoRecords = !!result && result.length < 1;
                    $scope.records = result;
                }
            );
        }

        function allInputsAreValid() {
            var allAreValid = true;
            var notificationStringCanNotBeEmpty = '不能为空';
            var validationOfCurrentStage;

            validationOfCurrentStage =
                checkProperty('发票号', notificationStringCanNotBeEmpty,
                    formData.invoiceCode
                );

            if (validationOfCurrentStage) {
                validationOfCurrentStage =
                    checkProperty('发票号', '长度须在5位数（含）与50位数（含）之间',
                        formData.invoiceCode,
                        function (v) {
                            return v.length >= 5 && v.length <= 50;
                        }
                    );
            }


            validationOfCurrentStage =
                checkProperty('快递单号', notificationStringCanNotBeEmpty,
                    formData.trackNumber
                );

            if (validationOfCurrentStage) {
                validationOfCurrentStage =
                    checkProperty('快递单号', '长度须在5位数（含）与32位数（含）之间',
                        formData.trackNumber,
                        function (v) {
                            return v.length >= 5 && v.length <= 32;
                        }
                    );
            }

            return allAreValid;



            function checkProperty(name, messageIfError, value, method) {
                var notifyingPropertyName = '快递单号';
                var isValid = true;
                if (typeof method === 'function') {
                    isValid = method(value);
                } else {
                    isValid = value.length > 0;
                }

                if (!isValid) {
                    allAreValid = false;
                    $_notify(name + messageIfError, true);
                }

                return isValid;
            }
        }

        function submit() {
            if (!allInputsAreValid()) {
                return;
            }

            var allBankCodes = angular.copy(knownBankCodes);

            formData.cashAmount = ''+formData.cashAmount;

            formData.accountBank = [
                $scope.accountBankName,
                $scope.accountBankBrank
            ].join();

            var currentInputBankCodeKey = formData.accountNumber;
            if (!allBankCodes[currentInputBankCodeKey]) {
                allBankCodes[currentInputBankCodeKey] = formData.accountBank;
            }

            formData.dealerSettingRequestMO.codes = allBankCodes;

            if (!$scope.isWaitingForNetwork) {
                $scope.isWaitingForNetwork = true;

                $_post(apiSubmission, $scope.formData,

                    function (result) {
                        $scope.isWaitingForNetwork = false;
                        closeDialog();
                    },

                    function (error) {
                        $scope.isWaitingForNetwork = false;

                        var errorMessage = error.errorMessges[0].message;
                        $_notify(errorMessage, true);

                        // closeDialog();
                    }
                );
            }
        }
    }]);