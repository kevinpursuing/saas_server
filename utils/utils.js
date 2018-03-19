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

module.exports = timeConvert