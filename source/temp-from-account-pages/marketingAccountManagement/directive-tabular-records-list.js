App.lazy.directive('marketingRecordsList', function () {
    return {
        restrict: 'AE',
        scope: {
            records: '=',
            firstIndex: '=?',
            emptyRecordsHint: '=?'
        },
        templateUrl: function (thisElement, elementAttributes) {
            return '/v2/views/marketingAccountManagement/'
                +'tabular-marketing-'+elementAttributes.templateKeyword+'-records-list'
                +'.html';
        },
        link: function ($scope, thisElement, elementAttributes) {
            $scope.firstIndex = 1;

            $scope.$watch('records', function () {
                if ($scope.records) {
                    var recordsCount = $scope.records.length;
                    $scope.hasRecords   = recordsCount > 0;
                    $scope.hasNoRecords = recordsCount < 1;
                }
            });

            $scope.$watch(elementAttributes.shouldShowIndexColumn, function () {
                $scope.shouldShowIndexColumn = elementAttributes.shouldShowIndexColumn;
            });
        }
    };
});