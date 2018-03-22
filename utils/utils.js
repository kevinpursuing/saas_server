utils = {
    timeConvert: timeConvert,
    getNowFormatDate: getNowFormatDate
}

function timeConvert(data) {
    if (data.saleTime) {
        data.saleTime = data.saleTime.split('.')
        data.saleTime = data.saleTime[0]
    }
    if (data.createTime) {
        data.createTime = data.createTime.split('.')
        data.createTime = data.createTime[0]
    }
    console.log(data.saleTime)
    return data
}

function getNowFormatDate() {
    var date = new Date()
    var seperator1 = "-"
    var seperator2 = ":"
    var month = date.getMonth() + 1
    var strDate = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
    }
    if (minute >= 0 && minute <= 9) {
        minute = "0" + minute;
    }
    if (second >= 0 && second <= 9) {
        second = "0" + second;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + "T" + hour + seperator2 + minute
        + seperator2 + second;
    return currentdate;
}
module.exports = utils