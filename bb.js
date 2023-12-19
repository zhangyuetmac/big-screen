// console.log("查询流程实例接口返回：", data);
var riskDes = "";
if (globalValue.yingJiDescription && globalValue.yingJiDescription.value) {
  riskDes = globalValue.yingJiDescription.value;
}
return {
  body: {
    eventId: "",
    eventName: "",
    processInstanceId: data.data.id,
    riskId: globalValue.yingJiEventId,
    riskName: globalValue.yingJiName.value,
    riskType: globalValue.yingJiType.label,
    riskTypeId: globalValue.yingJiType.value,
    riskTime: globalValue.yingJiTime.value,
    rangeWeight: globalValue.yingJiRadius.value,
    rangeHeight: globalValue.yingJiHeight.value,
    riskPlace: globalValue.yingJiPlaceName && globalValue.yingJiPlaceName.value ? globalValue.yingJiPlaceName.value : " ",
    riskPlaceCoor: globalValue.yingJiPlace,
    accidentTypeFirst: globalValue.yingJiShiGuType1.label,
    accidentTypeFirstId: globalValue.yingJiShiGuType1.value,
    accidentTypeSecond: globalValue.yingJiShiGuType2.label,
    accidentTypeSecondId: globalValue.yingJiShiGuType2.value,
    planType: globalValue.yingJiYuAnType.label,
    planTypeId: globalValue.yingJiYuAnType.value,
    planName: globalValue.yingJiYuAnName.code,
    riskPlan: globalValue.yingJiYuAnName.label,
    riskPlanId: globalValue.yingJiYuAnName.value,
    processName: "应急-测试",
    processCode: "c2fbad50-0f5f-47e2-bf62-72c04cac4085",
    riskDes: riskDes,
    riskState: 0,
    extra1: globalValue.yingJiYuAnName.code
  },
  headers: {},
  querys: {},
  sourceId: "721ff15b-e878-452e-b91f-691efb4bc2dc"
};
