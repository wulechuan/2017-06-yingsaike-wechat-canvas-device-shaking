var util = require('angularUtils');


// 以下两行不可置入controller内部。
require('../marketingAccountManagement/directive-tabular-records-list');

App.lazy.controller('MarketingActivitiesDetailsController', [function () {
	util.setDocTitle('活动明细');

	require('./data-service');
	require('./controller-query-controls');
}]);
