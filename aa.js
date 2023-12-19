//将时间戳格式转换成年月日时分秒
var date = new Date();
var Y = date.getFullYear();
var M = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

var h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
var m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
if (date.getMilliseconds() < 10) {
  var millseconds = "00" + date.getMilliseconds();
} else if (date.getMilliseconds() < 100) {
  var millseconds = "0" + date.getMilliseconds();
} else {
  var millseconds = date.getMilliseconds();
}
var eventId = String(Y) + String(M) + String(D) + String(h) + String(m) + String(s) + String(millseconds);
var desc = "无";
if (globalValue.yingJiDescription && globalValue.yingJiDescription.value) {
  desc = globalValue.yingJiDescription.value;
}

// console.log("处置流程编码：", globalValue)
return {
  body: {
    //迎接类型
    riskType: state.form.riskType,
    //发生地点
    riskPlace: state.form.riskPlace,
    //发生地点坐标
    riskPlaceCoor: state.form.riskPlaceCoor,
    //发生时间
    riskTime: Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s,
    //预案类型
    planType: state.form.planType,
    //事故类型一级
    accidentTypeFirst: state.form.accidentTypeFirst,
    //事故类型二级
    accidentTypeSecond: state.form.accidentTypeSecond,
    //应急预案
    riskPlan: state.form.riskPlan,
    //应急预案id
    riskPlanId: state.form.riskPlanId.toString(),
    //应急预案编码
    riskPlanCode: "",
    //应急描述
    riskDes: desc,
    //应急名称
    riskName: state.form.riskName,
    //影响范围半径
    rangeWeight: state.form.rangeWeight,
    //影响范围高度
    rangeHeight: state.form.rangeHeight,
    //应急id，第一次发起生成的应急事件id，每个升级流程，都与之关联
    riskId: eventId
  },
  headers: {},
  querys: {
    taskCode: "c2fbad50-0f5f-47e2-bf62-72c04cac4085"
  },
  sourceId: "a7b34b0c-1d2c-41f8-b97b-5ee2dd875352"
};
