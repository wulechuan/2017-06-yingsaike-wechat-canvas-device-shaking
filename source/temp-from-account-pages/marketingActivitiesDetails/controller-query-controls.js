App.lazy.controller('marketingActivitiesDetailsQueryControls',
    [        '$scope', 'marketingActivitiesDetailsData',
	function ($scope,   dataService) {
        var pagination = {
            maxRecordsPerPage: 20,
            currentPageIndex: 0, // it's 1 based
            totalPagesCount: 0
        };


        $scope.currentRecordSetStartIndex = 1;

        $scope.pagination = pagination;
        $scope.getRecordsOfPage = getRecordsOfPage;


        getRecordsOfPage(1);


        function getRecordsOfPage(pageIndex) {
            var queryDataCopy = {};
            
            // The "pageIndex" is 1 based, instead of zero base,
            // because the <page-nav> is defined that way.
            // While the "page" in the query data is zero base,
            // the backend decides this.
            queryDataCopy.page = parseInt(pageIndex)-1 || 0;
            queryDataCopy.pageSize = pagination.maxRecordsPerPage;

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