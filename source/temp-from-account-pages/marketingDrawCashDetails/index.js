var util = require('angularUtils');


// 以下两行不可置入controller内部。
require('angularDatepicker')(App);
require('../marketingAccountManagement/directive-tabular-records-list');

App.lazy.controller('MarketingDrawCashDetailsController', [function () {
	util.setDocTitle('案件详情');

	require('./data-service');
	require('./controller-query-controls');
}]);
