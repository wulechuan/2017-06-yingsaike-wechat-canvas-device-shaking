var util = require('angularUtils');


// 该行不可置入controller内部。
require('./directive-tabular-records-list');


App.lazy.controller('MarketingAccountManagementController', [function () {
	util.setDocTitle('费用账户管理');

	require('./data-service');
	require('./controller-balance');
	require('./controller-tabular-lists');
	require('./controller-invoice');
}]);
