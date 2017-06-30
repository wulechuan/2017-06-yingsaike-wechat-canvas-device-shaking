App.lazy.controller('marketingTradingDetailsQueryControls',
    [        '$scope', 'marketingTradingDetailsData',
	function ($scope,   dataService) {
        var moment = require('moment');

        var QUERY_THESE_MANY_DAYS_AGO_BY_DEFAULT = 7;

        // QUERY_THESE_MANY_DAYS_AGO_BY_DEFAULT = 300; // 默认应为7。
        // if (QUERY_THESE_MANY_DAYS_AGO_BY_DEFAULT !== 7) {
        //     console.error('为方便测试，默认查询至今'+QUERY_THESE_MANY_DAYS_AGO_BY_DEFAULT+'天以内的记录。');
        // }

        var TODAY = moment()
            .format('YYYY-MM-DD');

        var SEVERAL_DAYS_AGO = moment(
            (new Date().getTime()) - 1000*60*60*24* QUERY_THESE_MANY_DAYS_AGO_BY_DEFAULT)
            .format('YYYY-MM-DD');



        var pagination = {
            maxRecordsPerPage: 20,
            currentPageIndex: 0, // it's 1 based
            totalPagesCount: 0
        };

        var queryData = {
            accountType: '',
            approvalStatus: '',
            payStatus: '',
            requestStartDate: SEVERAL_DAYS_AGO,
            requestEndDate:   TODAY,
        };


        $scope.currentRecordSetStartIndex = 1;

        $scope.queryData = queryData;
        $scope.pagination = pagination;

        $scope.submitQuery = submitQuery;
        $scope.getRecordsOfPage = getRecordsOfPage;


        getRecordsOfPage(1);


        function getRecordsOfPage(pageIndex) {
            var queryDataCopy = angular.copy(queryData);
            
            // The "pageIndex" is 1 based, instead of zero base,
            // because the <page-nav> is defined that way.
            // While the "page" in the query data is zero base,
            // the backend decides this.
            queryDataCopy.page = parseInt(pageIndex)-1 || 0;
            queryDataCopy.size = pagination.maxRecordsPerPage;

            dataService.getRecords(queryDataCopy,
                function (result) {
                    $scope.records = result.records;

                    var newCurrentPageIndexZeroBased = result.paginationCurrentIndex;

                    pagination.currentPageIndex = newCurrentPageIndexZeroBased + 1;
                    pagination.totalPagesCount  = result.paginationTotalPagesCount;

                    $scope.currentRecordSetStartIndex =
                        (pagination.maxRecordsPerPage * newCurrentPageIndexZeroBased) + 1;
                }
            );
        }

        function submitQuery() {
            getRecordsOfPage(1);
        }
    }]);