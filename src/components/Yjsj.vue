<template>
  <el-row>
    <el-col :span="24" class="buttonWrap">
      <el-button type="primary" @click="yjqd" style="padding: 0 10px">应急启动</el-button>
    </el-col>
    <el-col :span="24">
      <el-table :data="state.tableData" style="width: 100%" border>
        <el-table-column prop="riskid" label="应急事件ID" width="180" align="center" />
        <el-table-column prop="riskname" label="应急名称" width="230" align="center" />
        <el-table-column prop="risktime" label="应急时间" align="center" />
        <el-table-column prop="riskplace" label="应急地点" align="center" />
        <el-table-column prop="riskdes" label="应急事件描述" align="center" width="330" />
        <el-table-column prop="riskplan" label="预案名称" align="center" />
        <el-table-column prop="risktype" label="（应急演练、双盲演练、应急事件）" align="center" />
        <el-table-column prop="accidenttypefirst" label="事故类型大类" align="center" />
        <el-table-column prop="riskstate" label=" 状态（未关闭/已关闭）" align="center">
          <template #default="scope">
            <span v-if="scope.row.riskstate == '0'">未处置</span>
            <span v-if="scope.row.riskstate == '1'">已处置</span>
          </template>
        </el-table-column>
        <el-table-column prop="plantype" label="预案类型（综合/专项/班组）" align="center" />
        <el-table-column fixed="right" label="操作" width="120" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleChuZhi(scope.row)">处置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
  <div class="myDialog">
    <el-dialog v-model="dialogFormVisible" title="发起应急事件" class="dialog1" width="700px">
      <el-form label-width="100px" :model="state.form" :rules="state.rules">
        <el-col :span="24">
          <el-form-item label="应急名称：" prop="riskName">
            <input v-model="state.form.riskname" class="normalinput" type="text" placeholder="地点（设备） + 事件名称" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="应急类型：" prop="riskType">
            <select class="selectLx" v-model="state.form.riskType" placeholder="请选择">
              <option v-for="item in state.yjlxOptions" :key="item.value" :label="item.label" :value="item.value"></option>
            </select>
          </el-form-item>
        </el-col>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="发生地点：" style="display: flex" prop="riskPlaceCoor">
              <el-col :span="7">
                <div class="location">
                  <img src="../assets/logo.png" />
                  <span>标注地点</span>
                </div>
              </el-col>
              <el-col :span="7">
                <!-- <el-input v-model="state.form.region" placeholder="坐标" /> -->
                <input v-model="state.form.riskPlaceCoor" class="normalinput" type="text" placeholder="坐标" style="height: 32px" />
              </el-col>
              <el-col :span="8" style="margin-left: 20px">
                <!-- <el-input v-model="state.form.region" placeholder="地点" /> -->
                <input v-model="state.form.riskPlace" class="normalinput" type="text" placeholder="地点" style="height: 32px" />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="影响范围：" style="display: flex" prop="rangeWeight">
              <el-col :span="12">
                <div class="banjing">
                  <span>半径：</span>
                  <input v-model="state.form.rangeWeight" class="banjing_input" type="text" placeholder="请输入" @input="allNumber(state.form.rangeWeight, 'rangeWeight')" />
                  <a>米</a>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="banjing">
                  <span>高：</span>
                  <input v-model="state.form.rangeHeight" class="banjing_input" type="text" placeholder="请输入" @input="allNumber(state.form.rangeHeight, 'rangeHeight')" />
                  <a>米</a>
                </div>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="事故类型：" prop="accidentTypeFirstId">
              <el-col :span="12">
                <select class="selectLxsg" v-model="state.form.accidentTypeFirstId" placeholder="请选择" @change="changeAccidentTypeFirst">
                  <option v-for="item in state.sglxBigOption" :key="item.dictLabel" :label="item.dictLabel" :value="item.dictLabel"></option>
                </select>
              </el-col>
              <el-col :span="12">
                <select class="selectLxsg" v-model="state.form.accidentTypeSecondId" placeholder="请选择">
                  <option v-for="item in state.sglxSmallOption" :key="item.dictLabel" :label="item.dictLabel" :value="item.dictLabel"></option>
                </select>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="24">
          <el-form-item label="预案类型：" prop="planTypeId">
            <select class="selectLx" v-model="state.form.planTypeId" placeholder="请选择">
              <option v-for="item in state.yalxOption" :key="item.dictCode" :label="item.dictLabel" :value="item.dictCode"></option>
            </select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="预案名称：" prop="riskPlanId">
            <select class="selectLx" v-model="state.form.riskPlanId" placeholder="请选择">
              <option v-for="item in state.yamcOption" :key="item.tenantid" :label="item.name" :value="item.tenantid"></option>
            </select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：">
            <textarea v-model="state.form.riskDes" class="textareaYj" name="message" rows="4" placeholder="请输入"></textarea>
          </el-form-item>
        </el-col>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="submit"> 确定 </el-button>
          <el-button type="primary" @click="dialogFormVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
const dialogFormVisible = ref(false);
const state = reactive({
  tableData: [],
  yjlxOptions: [
    {
      label: "应急演练",
      value: "v1"
    },
    {
      label: "双盲演练",
      value: "v2"
    },
    {
      label: "应急事件",
      value: "v3"
    }
  ],
  sglxBigOption: [],
  sglxSmallOption: [],
  yalxOption: [],
  yamcOption: [],
  rules: {
    riskName: [{ required: true, message: "请输入应急名称", trigger: "blur" }],
    riskType: [{ required: true, message: "请输入应急类型", trigger: "blur" }],
    riskPlaceCoor: [{ required: true, message: "请输入", trigger: "blur" }],
    rangeWeight: [{ required: true, message: "请输入", trigger: "blur" }],
    accidentTypeFirstId: [{ required: true, message: "请选择事故类型", trigger: "blur" }],
    planTypeId: [{ required: true, message: "请选择预案类型", trigger: "blur" }],
    riskPlanId: [{ required: true, message: "请选择预案名称", trigger: "blur" }]
  },
  form: {
    eventId: "",
    eventName: "",
    processInstanceId: "",
    riskId: "",
    riskName: "",
    riskType: "",
    riskTypeId: "",
    riskTime: "",
    rangeWeight: "",
    rangeHeight: "",
    riskPlace: "",
    riskPlaceCoor: "",
    accidentTypeFirst: "",
    accidentTypeFirstId: "",
    accidentTypeSecond: "",
    accidentTypeSecondId: "",
    planType: "",
    planTypeId: "",
    planName: "",
    riskPlan: "",
    riskPlanId: "",
    processName: "",
    processCode: "",
    riskDes: "",
    riskState: 0,
    extra1: ""
  }
});
const allNumber = (value, type) => {
  console.log("111");
  console.log(value);
  value = value.replace(/[^\d]/g, ""); //只能输入数字
  state.form[type] = value; //注意这里是string，你要数字类型记得自己转一下
};
const yjqd = () => {
  console.log("应急启动");
  dialogFormVisible.value = true;
  Object.keys(state.form).forEach((item) => {
    if (item != "riskState") {
      state.form[item] = "";
    }
  });
  // 获取事故类型大类列表
  getSglxBig();
  // 获取预案类型列表
  getYalx();
  // 获取预案名称列表
  getYamc();
};
const changeAccidentTypeFirst = (event) => {
  console.log("event.target==", event.target.value);
  // const data = {
  //   dictName: event.target.value
  // };
  // const res = axios({
  //   method: "post",
  //   url: `/dataService/oss/search`,
  //   data,
  //   headers: {
  //     //单个请求设置请求头
  //     "Content-Type": "application/json",
  //     token: "AcH5xNvXV0bw8Z5Xm2kSToCklXKCO9GlZZVvRTlC7MNFORGLUDugnSqCV61TdWO9fILZPdhN9uJzrb7Co58EFkBMef9O22jtuByfiQEd2dvh8a6FVMxMMxOQmlSLRMxi2f93642333c0ea44"
  //   }
  // });
  // console.log("事故类型res", res);
  const res = {
    list: [
      {
        list: '[{"dictValue":"人身伤亡事故","dictSort":1,"dictType":"PRODUCTION_SAFETY_ACCIDENT","dictLabel":"人身伤亡事故","dictCode":411,"createTime":"2021-11-22 17:16:16","status":0},{"dictValue":"火灾事故","dictSort":2,"dictType":"PRODUCTION_SAFETY_ACCIDENT","dictLabel":"火灾事故","dictCode":412,"createTime":"2021-11-22 17:16:16","status":0},{"dictValue":"爆炸事故","dictSort":3,"dictType":"PRODUCTION_SAFETY_ACCIDENT","dictLabel":"爆炸事故","dictCode":413,"createTime":"2021-11-22 17:16:16","status":0},{"dictValue":"生产事故","dictSort":4,"dictType":"PRODUCTION_SAFETY_ACCIDENT","dictLabel":"生产事故","dictCode":414,"createTime":"2021-11-22 17:16:16","status":0},{"dictValue":"设备事故","dictSort":5,"dictType":"PRODUCTION_SAFETY_ACCIDENT","dictLabel":"设备事故","dictCode":415,"createTime":"2021-11-22 17:16:16","status":0},{"dictValue":"交通运输事故","dictSort":6,"dictType":"PRODUCTION_SAFETY_ACCIDENT","dictLabel":"交通运输事故","dictCode":416,"createTime":"2021-11-22 17:16:16","status":0},{"dictValue":"海损事故","dictSort":7,"dictType":"PRODUCTION_SAFETY_ACCIDENT","dictLabel":"海损事故","dictCode":417,"createTime":"2021-11-22 17:16:16","status":0},{"dictValue":"其他生产安全事故","dictSort":8,"dictType":"PRODUCTION_SAFETY_ACCIDENT","dictLabel":"其他生产安全事故","dictCode":418,"createTime":"2021-11-22 17:16:16","status":0}]',
        dicttype: "PRODUCTION_SAFETY_ACCIDENT",
        dictid: 51,
        zjlid: "f1462a1284fc73f97606c57b7a5d8414",
        xxrksj: "2023-12-15 08:00:15",
        bz: "1702598400113",
        dictname: "生产安全事故"
      }
    ],
    totalCount: 1,
    totalPage: 1,
    serviceBill: null
  };
  state.sglxSmallOption = JSON.parse(res.list[0].list);
};
const getSglxBig = () => {
  console.log("获取事故类型");
  // const data = {
  //   dictName: "事故类型"
  // };
  // const res = axios({
  //   method: "post",
  //   url: `/dataService/oss/search`,
  //   data,
  //   headers: {
  //     //单个请求设置请求头
  //     "Content-Type": "application/json",
  //     token: "AcH5xNvXV0bw8Z5Xm2kSToCklXKCO9GlZZVvRTlC7MNFORGLUDugnSqCV61TdWO9fILZPdhN9uJzrb7Co58EFkBMef9O22jtuByfiQEd2dvh8a6FVMxMMxOQmlSLRMxi2f93642333c0ea44"
  //   }
  // });
  // console.log("事故类型res", res);
  const res = {
    list: [
      {
        list: '[{"dictValue":"生产安全事故","dictSort":1,"dictType":"EVENT_TYPE","dictLabel":"生产安全事故","dictCode":450,"createTime":"2021-11-23 17:23:13","status":0},{"dictValue":"环境污染事故","dictSort":2,"dictType":"EVENT_TYPE","dictLabel":"环境污染事故","dictCode":451,"createTime":"2021-11-23 17:23:13","status":0},{"dictValue":"职业病事故","dictSort":3,"dictType":"EVENT_TYPE","dictLabel":"职业病事故","dictCode":452,"createTime":"2021-11-23 17:23:13","status":0}]',
        dicttype: "EVENT_TYPE",
        dictid: 50,
        zjlid: "19460a916693f20d273bc41cb6ac5da0",
        xxrksj: "2023-12-15 08:00:15",
        bz: "1702598400113",
        dictname: "事故类型"
      }
    ],
    totalCount: 1,
    totalPage: 1,
    serviceBill: null
  };
  state.sglxBigOption = JSON.parse(res.list[0].list);
};
const getYalx = () => {
  // const data = {
  //   dictName: "应急预案类型"
  // };
  // const res = axios({
  //   method: "post",
  //   url: `/dataService/oss/search`,
  //   data,
  //   headers: {
  //     //单个请求设置请求头
  //     "Content-Type": "application/json",
  //     token: "AcH5xNvXV0bw8Z5Xm2kSToCklXKCO9GlZZVvRTlC7MNFORGLUDugnSqCV61TdWO9fILZPdhN9uJzrb7Co58EFkBMef9O22jtuByfiQEd2dvh8a6FVMxMMxOQmlSLRMxi2f93642333c0ea44"
  //   }
  // });
  // console.log("预案类型res", res);
  const res = {
    list: [
      {
        list: '[{"dictValue":"综合应急预案","dictSort":1,"dictType":"EMERGENCY_PLAN_TYPE","dictLabel":"综合应急预案","dictCode":408,"createTime":"2021-11-22 17:12:50","status":0},{"dictValue":"专项应急预案","dictSort":2,"dictType":"EMERGENCY_PLAN_TYPE","dictLabel":"专项应急预案","dictCode":409,"createTime":"2021-11-22 17:12:50","status":0},{"dictValue":"现场处置方案","dictSort":3,"dictType":"EMERGENCY_PLAN_TYPE","dictLabel":"现场处置方案","dictCode":410,"createTime":"2021-11-22 17:12:50","status":0}]',
        dicttype: "EMERGENCY_PLAN_TYPE",
        dictid: 49,
        zjlid: "aa90853fe9873d4ea2ab975ec3a4f549",
        xxrksj: "2023-12-15 08:00:15",
        bz: "1702598400113",
        dictname: "应急预案类型"
      }
    ],
    totalCount: 1,
    totalPage: 1,
    serviceBill: null
  };
  state.yalxOption = JSON.parse(res.list[0].list);
};
const getYamc = () => {
  // const data = {
  //   preplanInfoId: "",
  //   number: ""
  // };
  // const res = axios({
  //   method: "post",
  //   url: `/dataService/oss/search`,
  //   data,
  //   headers: {
  //     //单个请求设置请求头
  //     "Content-Type": "application/json",
  //     token: "iPTiaNCNjjlvHBwRKxUicLOBIUUJyRhY2gceziYsvpCvNP9URrGvxxzGu2q5q0KOoymV7D2xWu3LdHaDUJHP2Dkw7E0qJPCks3n87UKaEuRPEiGhMRKn0HAs0Q9Ob7e1455be785fa6bd0d6"
  //   }
  // });
  // console.log("预案名称res", res);
  const res = {
    list: [
      {
        peoples: "[]",
        preplaninfoid: 19,
        orgid: "",
        starttime: "2023-11-05",
        eventtypesecond: "设备事故",
        authorizepeople: "席雨伟",
        attachmenturl: "502B2652177F3FCBF960973491FFB3C1",
        reportunitcode: "",
        zjlid: "17de26470a771817b42124faee3df9d1",
        tenantid: "1414896210194907137",
        extparams: null,
        eventtypefirst: "生产安全事故",
        name: "生产安全事故综合应急预案_断电",
        number: "ENN8126/HSE001C-2023",
        authorizeunitcode: "",
        releasetime: "2023-11-01",
        type: "综合应急预案",
        xxrksj: "2023-12-15 10:55:07",
        authorizeunitname: "",
        authorizeexplanation: "处理流程参照的是《 35kVI 段和Ⅱ段母线同时失电，启动柴油发电机》",
        status: 0,
        releaseunitname: "舟山基础设施运营智能群",
        remark: "",
        bz: "1702608900048",
        endtime: "2023-11-30",
        version: "2023版",
        releaseunitcode: "1414896210194907137",
        createusername: "席雨伟",
        onlinepreplanurl: "",
        reportunitname: ""
      }
    ],
    totalCount: 1,
    totalPage: 1,
    serviceBill: null
  };
  state.yamcOption = res.list;
};
const handleChuZhi = async (item) => {
  console.log("item", item);
  // const res = await axios({
  //   method: "get",
  //   url: `/dataService/workbench/micro/task/detail/${item.riskid}`
  // });
  const res = await axios({
    method: "get",
    url: "/adapterServer/adapter/task/todo/process_instance/?processInstanceId=17985761081856"
  });
  console.log("res==", res);
};
const getTableData = async () => {
  console.log("11");
  console.log("77");
  // const data = {
  //   riskId: "20231108085951125" // 20231116114026452
  // };
  // const res = await axios({
  //   method: "post",
  //   url: `/dataService/oss/search`,
  //   data,
  //   headers: {
  //     //单个请求设置请求头
  //     "Content-Type": "application/json",
  //     token: "udvGI5Za0AewuLLV6ZLi21UqN35PwOiyHJ2sE44NtDbnW7o9mw7K8IFpStqnKNWtAmrJiOV5RrJIbir0Cf8j7EfRCFAJuG4GDbv5Ndak4dz9EAS9rQlHjGeTFVy7gdzsf9de7b90745ccf2f"
  //   }
  // });
  const res = {
    list: [
      {
        extra2: "",
        riskid: "20231108085951125",
        processinstanceid: "17879269795008",
        rangeheight: "33",
        processcode: "c2fbad50-0f5f-47e2-bf62-72c04cac4085",
        riskplacecoor: "[122.28258595862034,30.09883166054057,-0.0012441341727344834]",
        rangeweight: "33",
        riskplace: "总变电所",
        extra3: "",
        risktype: "应急演练",
        processname: "应急-测试",
        accidenttypesecondid: "418",
        zjlid: null,
        risktypeid: "v1",
        plantype: "综合应急预案",
        riskstate: "1",
        riskplan: "生产安全事故综合应急预案_断电",
        extra1: "ENN8126/HSE001C-2023",
        accidenttypesecond: "其他生产安全事故",
        eventid: "",
        plantypeid: "1",
        xxrksj: "2023-11-27 15:11:56",
        risktime: "2023-11-08 08:59:51",
        bz: null,
        riskplanid: "19",
        accidenttypefirst: "生产安全事故",
        accidenttypefirstid: "450",
        riskname: "舟山市大面积停电应急演练",
        riskdes:
          "舟山500千伏双回海缆故障抢修，舟山电网因断面控制执行负荷管控110万千瓦，同时因设备故障损失10万千瓦，全市电网减供负荷达120万千瓦，约占舟山地区总负荷40%，舟山市政府根据《舟山市大面积停电应急预案》标准，启动大面积停电事件Ⅱ级应急响应。",
        planname: "ENN8126/HSE001C-2023",
        eventname: ""
      },
      {
        extra2: "",
        riskid: "20231108085951125",
        processinstanceid: "17985761081856",
        rangeheight: "33",
        processcode: "c2fbad50-0f5f-47e2-bf62-72c04cac4085",
        riskplacecoor: "[122.28258595862034,30.09883166054057,-0.0012441341727344834]",
        rangeweight: "33",
        riskplace: "总变电所",
        extra3: "",
        risktype: "应急演练",
        processname: "应急-测试",
        accidenttypesecondid: "418",
        zjlid: null,
        risktypeid: "v1",
        plantype: "综合应急预案",
        riskstate: "1",
        riskplan: "生产安全事故综合应急预案_断电",
        extra1: "ENN8126/HSE001C-2023",
        accidenttypesecond: "其他生产安全事故",
        eventid: "",
        plantypeid: "1",
        xxrksj: "2023-12-05 10:59:37",
        risktime: "2023-11-27 15:11:56",
        bz: null,
        riskplanid: "19",
        accidenttypefirst: "生产安全事故",
        accidenttypefirstid: "450",
        riskname: "舟山市大面积停电应急演练",
        riskdes:
          "舟山500千伏双回海缆故障抢修，舟山电网因断面控制执行负荷管控110万千瓦，同时因设备故障损失10万千瓦，全市电网减供负荷达120万千瓦，约占舟山地区总负荷40%，舟山市政府根据《舟山市大面积停电应急预案》标准，启动大面积停电事件Ⅱ级应急响应。",
        planname: "ENN8126/HSE001C-2023",
        eventname: ""
      }
    ],
    totalCount: 2,
    totalPage: 1,
    serviceBill: null
  };
  console.log("res", res);
  state.tableData = res.list;
};
const validateForm = () => {
  if (!state.form.riskname) {
    ElMessage.error("请输入应急名称");
    return false;
  } else if (!state.form.riskType) {
    ElMessage.error("请选择应急类型");
    return false;
  } else if (!state.form.riskPlaceCoor) {
    ElMessage.error("请输入发生地点坐标");
    return false;
  } else if (!state.form.riskPlace) {
    ElMessage.error("请输入发生地点");
    return false;
  } else if (!state.form.rangeWeight) {
    ElMessage.error("请输入影响范围半径");
    return false;
  } else if (!state.form.rangeHeight) {
    ElMessage.error("请输入影响范围高");
    return false;
  } else if (!state.form.accidentTypeFirstId) {
    ElMessage.error("请选择事故类型大类");
    return false;
  } else if (!state.form.accidentTypeSecondId) {
    ElMessage.error("请选择事故类型小类");
    return false;
  } else if (!state.form.planTypeId) {
    ElMessage.error("请选择预案类型");
    return false;
  } else if (!state.form.riskPlanId) {
    ElMessage.error("请选择预案名称");
    return false;
  }
  return true;
};
const submit = async () => {
  console.log("state.form===", state.form);
  if (validateForm()) {
    console.log("表单验证通过");
    // 应急事件发起工单
    const data = {
      // riskId:riskIdParam
      riskId: "20231211101224089"
    };
    const res = await axios({
      method: "post",
      url: `/dataService/oss/search`,
      data,
      headers: {
        //单个请求设置请求头
        "Content-Type": "application/json",
        token: "udvGI5Za0AewuLLV6ZLi21UqN35PwOiyHJ2sE44NtDbnW7o9mw7K8IFpStqnKNWtAmrJiOV5RrJIbir0Cf8j7EfRCFAJuG4GDbv5Ndak4dz9EAS9rQlHjGeTFVy7gdzsf9de7b90745ccf2f"
      }
    });
    console.log("res==", res);
  } else {
    console.log("表单验证不通过");
  }
};
onMounted(() => {
  console.log("走到mounted");
  getTableData();
});
</script>

<style lang="less" scoped>
.textareaYj {
  width: 100%;
  background: #025eb1;
  height: 150px;
  border: none;
  outline: none;
  color: white;
  padding: 10px;
  font-size: 14px;
}
.textareaYj::placeholder {
  color: #bbb;
}
.normalinput {
  width: 100%;
  height: 100%;
  background: #025eb1;
  border: none;
  outline: none;
  color: white;
  padding: 0 0 0 10px;
}
.normalinput::placeholder {
  color: #bbb;
}
.selectLx {
  width: 100%;
  height: 100%;
  background: #025eb1;
  border: none;
  outline: none;
  color: white;
  padding: 0 0 0 10px;
}
.selectLxsg {
  width: 100%;
  height: 32px;
  background: #025eb1;
  border: none;
  outline: none;
  color: white;
  padding: 0 0 0 10px;
}
.location {
  display: flex;
  align-items: center;
  img {
    width: 20px;
    height: 20px;
    margin-left: 10px;
  }
  span {
    color: white;
    margin-left: 10px;
    font-size: 14px;
  }
}
.banjing {
  background: #025eb1;
  width: 100%;
  height: 100%;
  display: flex;
  span {
    color: white;
    font-size: 14px;
    margin-left: 10px;
  }
  .banjing_input {
    width: 50%;
    // flex: 1;
    background: #025eb1;
    border: none;
    outline: none;
    // height: 100%;
    color: white;
    margin-left: 15%;
  }
  .banjing_input::placeholder {
    color: #bbb;
  }
  a {
    color: white;
    margin-left: 10px;
    font-size: 14px;
    // margin-right: 20px;
  }
}
.buttonWrap {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 10px;
}
/deep/ .el-input__inner {
  border: 0px;
  box-shadow: 0 0 0 0px;
}
::v-deep .el-dialog {
  background: #002c75;
}
/deep/ .el-form-item__label {
  color: white;
}

/deep/ .el-input__wrapper {
  background: #025eb1;
}
/deep/.el-input__inner {
  color: white;
}
/deep/ .el-dialog__title {
  color: white;
}
/deep/ .el-dialog__headerbtn .el-dialog__close {
  color: #025eb1;
}
/deep/ .el-select .el-input .el-select__caret {
  color: black;
}
/deep/ .el-textarea__inner {
  background: #025eb1;
}
</style>
