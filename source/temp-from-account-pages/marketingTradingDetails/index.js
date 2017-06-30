var util = require('angularUtils');


// 以下两行不可置入controller内部。
require('angularDatepicker')(App);
require('../marketingAccountManagement/directive-tabular-records-list');

App.lazy.controller('MarketingTradingDetailsController', [function () {
	util.setDocTitle('交易记录明细');

	require('./data-service');
	require('./controller-query-controls');
}]);
