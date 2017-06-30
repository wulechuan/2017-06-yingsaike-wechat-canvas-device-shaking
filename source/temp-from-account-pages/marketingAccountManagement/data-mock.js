var balanceRecords =
    [
        {
            dealerCode: "BK20006",
            accountType: "CONSULTING",
            accountNumber: "123444",
            balance: 0,
            cashAmount: 0,
            accountHeadOffice: "1",
            accountBank: "afa a",
            saicInvoiceRecipient: "贺振俊",
            saicInvoiceRecipientTelephone: "021-22206825"
        },
        {
            dealerCode: "BK20006",
            accountType: "SERVICE",
            accountNumber: "123444",
            balance: 36650,
            cashAmount: 0,
            accountHeadOffice: "1",
            accountBank: "afa a",
            saicInvoiceRecipient: "贺振俊",
            saicInvoiceRecipientTelephone: "021-22206825"
        }
    ];

var allOtherData = {
    bankAccount: [
        {
            createUser: "BK20006",
            createTime: 1498011013000,
            updateUser: "BK20006",
            updateTime: 1498011013000,
            settingDetailId: 22712,
            code: "123444",
            dealerCode: "BK20006",
            memo: null,
            name: "中国工商银行",
            setting: "bankAccount",
            value: "afa a"
        },
        {
            createUser: "BK20006",
            createTime: 1498011013000,
            updateUser: "BK20006",
            updateTime: 1498011013000,
            settingDetailId: 22714,
            code: "111111111111111111111111111111",
            dealerCode: "BK20006",
            memo: null,
            name: "中国工商银行",
            setting: "bankAccount",
            value: "阿斯顿发发呆分"
        },
        {
            createUser: "BK20006",
            createTime: 1498011013000,
            updateUser: "BK20006",
            updateTime: 1498011013000,
            settingDetailId: 22713,
            code: "131312312321312312",
            dealerCode: "BK20006",
            memo: null,
            name: "中国工商银行",
            setting: "bankAccount",
            value: "11"
        }
    ],
    TOP5_CASH_REQUEST: [
        {
            requestDate: 1498010993000,
            accountType: "SERVICE",
            cashAmount: 26600,
            approvalResult: "INIT",
            approvalAdvice: "",
            payStatus: "INIT",
            paymentDate: null,
            id: 561,
            payeeAcctNo: "123444",
            payeeName: "afafa",
            payeeBankName: "中国工商银行afa a",
            payeeRegionNo: "370000.370100"
        },
        {
            requestDate: 1482199034000,
            accountType: "SERVICE",
            cashAmount: 26600,
            approvalResult: "BACK",
            approvalAdvice: "asdfadsf",
            payStatus: "INIT",
            paymentDate: null,
            id: 546,
            payeeAcctNo: "123444",
            payeeName: "afafa",
            payeeBankName: "中国工商银行afa a",
            payeeRegionNo: "370000.370100"
        },
        {
            requestDate: 1482196411000,
            accountType: "SERVICE",
            cashAmount: 26600,
            approvalResult: "BACK",
            approvalAdvice: "审核不通过",
            payStatus: "INIT",
            paymentDate: null,
            id: 544,
            payeeAcctNo: "111111111111111111111111111111",
            payeeName: "afafa",
            payeeBankName: "中国工商银行阿斯顿发发呆分",
            payeeRegionNo: "370000.370100"
        },
        {
            requestDate: 1476169967000,
            accountType: "SERVICE",
            cashAmount: 9000,
            approvalResult: "PASSED",
            approvalAdvice: "啊啊啊",
            payStatus: "INIT",
            paymentDate: null,
            id: 537,
            payeeAcctNo: "111111111111111111111111111111",
            payeeName: "afafa",
            payeeBankName: "中国工商银行南山支行",
            payeeRegionNo: "370000.370100"
        },
        {
            requestDate: 1476169440000,
            accountType: "SERVICE",
            cashAmount: 9000,
            approvalResult: "PASSED",
            approvalAdvice: "统一",
            payStatus: "INIT",
            paymentDate: null,
            id: 536,
            payeeAcctNo: "111111111111111111111111111111",
            payeeName: "afafa",
            payeeBankName: "中国工商银行南山支行",
            payeeRegionNo: "370000.370100"
        }
    ],
    TOP5_TRANS_LOG: [
        {
            createUser: "zhangshengwen",
            createTime: 1482140214000,
            updateUser: "BK20006",
            updateTime: 1498010995000,
            id: 14149,
            accountId: 100,
            dealerCode: "BK20006",
            postAmount: 36650,
            preAmount: 34950,
            remark: null,
            transAmount: 1700,
            transType: "SAVE_SERVICE",
            marketingCode: "SGM_TEST_0919",
            settlementDealerId: 627,
            cashRequestId: 561,
            withdrawStatus: "DOING",
            nod: null,
            marketingName: "SGM通用测试",
            revision: 5
        },
        {
            createUser: "BATCH",
            createTime: 1479785852000,
            updateUser: "BK20006",
            updateTime: 1498010995000,
            id: 14121,
            accountId: 100,
            dealerCode: "BK20006",
            postAmount: 34950,
            preAmount: 10050,
            remark: null,
            transAmount: 24900,
            transType: "SAVE_SERVICE",
            marketingCode: "test-11",
            settlementDealerId: 6475,
            cashRequestId: 561,
            withdrawStatus: "DOING",
            nod: null,
            marketingName: "测试11",
            revision: 5
        },
        {
            createUser: "furong",
            createTime: 1476170042000,
            updateUser: "furong",
            updateTime: 1476170042000,
            id: 14106,
            accountId: 100,
            dealerCode: "BK20006",
            postAmount: 10050,
            preAmount: 19050,
            remark: null,
            transAmount: -9000,
            transType: "WITHDRAW_SERVICE",
            marketingCode: "SGM_TEST_0919",
            settlementDealerId: null,
            cashRequestId: 537,
            withdrawStatus: "DONE",
            nod: null,
            marketingName: "SGM通用测试",
            revision: 0
        },
        {
            createUser: "system",
            createTime: 1476169939000,
            updateUser: "furong",
            updateTime: 1476170042000,
            id: 14105,
            accountId: 100,
            dealerCode: "BK20006",
            postAmount: 19050,
            preAmount: 15050,
            remark: null,
            transAmount: 4000,
            transType: "SAVE_SERVICE",
            marketingCode: "SGM_TEST_0919",
            settlementDealerId: null,
            cashRequestId: 537,
            withdrawStatus: "DONE",
            nod: null,
            marketingName: "SGM通用测试",
            revision: 3
        },
        {
            createUser: "system",
            createTime: 1476169939000,
            updateUser: "furong",
            updateTime: 1476170042000,
            id: 14104,
            accountId: 100,
            dealerCode: "BK20006",
            postAmount: 15050,
            preAmount: 10050,
            remark: null,
            transAmount: 5000,
            transType: "SAVE_SERVICE",
            marketingCode: "SGM_TEST_0919",
            settlementDealerId: null,
            cashRequestId: 537,
            withdrawStatus: "DONE",
            nod: null,
            marketingName: "SGM通用测试",
            revision: 3
        }
    ],
    TOP5_MKT_FEE: [
        {
            mktCode: "",
            mktName: "",
            fees: 4000
        },
        {
            mktCode: "test-11",
            mktName: "测试11",
            fees: 24900
        },
        {
            mktCode: "SGM-TEST",
            mktName: "山东测试",
            fees: 50
        },
        {
            mktCode: "SGM_TEST_0919",
            mktName: "SGM通用测试",
            fees: 45200
        }
    ],
    OPENING_BANK: [
        {
            11: "兴业银行",
            12: "广发银行",
            13: "平安银行",
            14: "上海浦东发展银行",
            15: "恒丰银行",
            16: "浙商银行",
            17: "渤海银行",
            18: "中国邮政储蓄银行",
            OTHER: "其他",
            1: "中国工商银行",
            2: "中国农业银行",
            3: "中国银行",
            4: "中国建设银行",
            5: "交通银行",
            6: "中信银行",
            7: "中国光大银行",
            8: "华夏银行",
            9: "中国民生银行",
            10: "招商银行"
        }
    ]
};









module.exports = {
    balanceRecords: balanceRecords,
    allOtherData: allOtherData
};