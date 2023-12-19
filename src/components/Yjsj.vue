<template>
  <el-row>
    <el-col :span="24" class="buttonWrap">
      <el-button type="primary" @click="yjqd" style="padding: 0 10px">应急启动</el-button>
    </el-col>
    <el-col :span="24">
      <el-table :data="state.tableData" style="width: 100%; height: 850px" border>
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
            <el-button v-show="scope.row.riskstate == '0'" link type="primary" size="small" @click="handleChuZhi(scope.row)">处置</el-button>
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
            <input v-model="state.form.riskName" class="normalinput" type="text" placeholder="地点（设备） + 事件名称" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="应急类型：" prop="riskTypeId">
            <select class="selectLx" v-model="state.form.riskTypeId" placeholder="请选择" @change="changeRiskType">
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
                <input v-model="state.form.riskPlaceCoor" class="normalinput" type="text" placeholder="坐标" style="height: 32px" />
              </el-col>
              <el-col :span="8" style="margin-left: 20px">
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
                  <option v-for="item in state.sglxBigOption" :key="item.dictCode" :label="item.dictLabel" :value="item.dictCode"></option>
                </select>
              </el-col>
              <el-col :span="12">
                <select class="selectLxsg" v-model="state.form.accidentTypeSecondId" placeholder="请选择" @change="changeAccidentTypeSecond">
                  <option v-for="item in state.sglxSmallOption" :key="item.dictCode" :label="item.dictLabel" :value="item.dictCode"></option>
                </select>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="24">
          <el-form-item label="预案类型：" prop="planTypeId">
            <select class="selectLx" v-model="state.form.planTypeId" placeholder="请选择" @change="changePlanType">
              <option v-for="item in state.yalxOption" :key="item.dictCode" :label="item.dictLabel" :value="item.dictCode"></option>
            </select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="预案名称：" prop="riskPlanId" @change="changerRiskPlan">
            <select class="selectLx" v-model="state.form.riskPlanId" placeholder="请选择">
              <option v-for="item in state.yamcOption" :key="item.preplaninfoid" :label="item.name" :value="item.preplaninfoid"></option>
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
const taskCode = ref("c2fbad50-0f5f-47e2-bf62-72c04cac4085");
const eventId = ref("");
const riskTime = ref("");
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
const changeRiskType = (event) => {
  state.yjlxOptions.forEach((item) => {
    if (item.value == event.target.value) {
      state.form.riskType = item.label;
    }
  });
};
const changeAccidentTypeFirst = async (event) => {
  console.log("event.target==", event.target);
  console.log("event.target.value==", event.target.value);
  console.log("event.target.label==", event.target.label);
  state.sglxSmallOption = [];
  state.form.accidentTypeSecondId = "";
  state.form.accidentTypeSecond = "";
  state.sglxBigOption.forEach((item) => {
    if (item.dictCode == event.target.value) {
      state.form.accidentTypeFirst = item.dictLabel;
    }
  });
  const data = {
    dictName: state.form.accidentTypeFirst
  };
  const res = await axios({
    method: "post",
    url: `/dataService/oss/search`,
    data,
    headers: {
      //单个请求设置请求头
      "Content-Type": "application/json",
      token: "AcH5xNvXV0bw8Z5Xm2kSToCklXKCO9GlZZVvRTlC7MNFORGLUDugnSqCV61TdWO9fILZPdhN9uJzrb7Co58EFkBMef9O22jtuByfiQEd2dvh8a6FVMxMMxOQmlSLRMxi2f93642333c0ea44"
    }
  });
  console.log("事故类型res", res);
  /*const res = {
    data:{
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
    }
  };*/
  state.sglxSmallOption = JSON.parse(res.data.list[0].list);
};
const changeAccidentTypeSecond = (event) => {
  state.sglxSmallOption.forEach((item) => {
    if (item.dictCode == event.target.value) {
      state.form.accidentTypeSecond = item.dictLabel;
    }
  });
};
const changePlanType = (event) => {
  state.yalxOption.forEach((item) => {
    if (item.dictCode == event.target.value) {
      state.form.planType = item.dictLabel;
    }
  });
};
const changerRiskPlan = (event) => {
  state.yamcOption.forEach((item) => {
    if (item.preplaninfoid == event.target.value) {
      state.form.riskPlan = item.name;
    }
  });
};
const getSglxBig = async () => {
  console.log("获取事故类型");
  const data = {
    dictName: "事故类型"
  };
  const res = await axios({
    method: "post",
    url: `/dataService/oss/search`,
    data,
    headers: {
      //单个请求设置请求头
      "Content-Type": "application/json",
      token: "AcH5xNvXV0bw8Z5Xm2kSToCklXKCO9GlZZVvRTlC7MNFORGLUDugnSqCV61TdWO9fILZPdhN9uJzrb7Co58EFkBMef9O22jtuByfiQEd2dvh8a6FVMxMMxOQmlSLRMxi2f93642333c0ea44"
    }
  });
  console.log("事故类型res", res);
  // const res = {
  //   data: {
  //     list: [
  //       {
  //         list: '[{"dictValue":"生产安全事故","dictSort":1,"dictType":"EVENT_TYPE","dictLabel":"生产安全事故","dictCode":450,"createTime":"2021-11-23 17:23:13","status":0},{"dictValue":"环境污染事故","dictSort":2,"dictType":"EVENT_TYPE","dictLabel":"环境污染事故","dictCode":451,"createTime":"2021-11-23 17:23:13","status":0},{"dictValue":"职业病事故","dictSort":3,"dictType":"EVENT_TYPE","dictLabel":"职业病事故","dictCode":452,"createTime":"2021-11-23 17:23:13","status":0}]',
  //         dicttype: "EVENT_TYPE",
  //         dictid: 50,
  //         zjlid: "19460a916693f20d273bc41cb6ac5da0",
  //         xxrksj: "2023-12-15 08:00:15",
  //         bz: "1702598400113",
  //         dictname: "事故类型"
  //       }
  //     ],
  //     totalCount: 1,
  //     totalPage: 1,
  //     serviceBill: null
  //   }
  // };
  state.sglxBigOption = JSON.parse(res.data.list[0].list);
};
const getYalx = async () => {
  const data = {
    dictName: "应急预案类型"
  };
  const res = await axios({
    method: "post",
    url: `/dataService/oss/search`,
    data,
    headers: {
      //单个请求设置请求头
      "Content-Type": "application/json",
      token: "AcH5xNvXV0bw8Z5Xm2kSToCklXKCO9GlZZVvRTlC7MNFORGLUDugnSqCV61TdWO9fILZPdhN9uJzrb7Co58EFkBMef9O22jtuByfiQEd2dvh8a6FVMxMMxOQmlSLRMxi2f93642333c0ea44"
    }
  });
  console.log("预案类型res", res);
  // const res = {
  //   data: {
  //     list: [
  //       {
  //         list: '[{"dictValue":"综合应急预案","dictSort":1,"dictType":"EMERGENCY_PLAN_TYPE","dictLabel":"综合应急预案","dictCode":408,"createTime":"2021-11-22 17:12:50","status":0},{"dictValue":"专项应急预案","dictSort":2,"dictType":"EMERGENCY_PLAN_TYPE","dictLabel":"专项应急预案","dictCode":409,"createTime":"2021-11-22 17:12:50","status":0},{"dictValue":"现场处置方案","dictSort":3,"dictType":"EMERGENCY_PLAN_TYPE","dictLabel":"现场处置方案","dictCode":410,"createTime":"2021-11-22 17:12:50","status":0}]',
  //         dicttype: "EMERGENCY_PLAN_TYPE",
  //         dictid: 49,
  //         zjlid: "aa90853fe9873d4ea2ab975ec3a4f549",
  //         xxrksj: "2023-12-15 08:00:15",
  //         bz: "1702598400113",
  //         dictname: "应急预案类型"
  //       }
  //     ],
  //     totalCount: 1,
  //     totalPage: 1,
  //     serviceBill: null
  //   }
  // };
  state.yalxOption = JSON.parse(res.data.list[0].list);
};
const getYamc = async () => {
  const data = {
    preplanInfoId: "",
    number: ""
  };
  const res = await axios({
    method: "post",
    url: `/dataService/oss/search`,
    data,
    headers: {
      //单个请求设置请求头
      "Content-Type": "application/json",
      token: "iPTiaNCNjjlvHBwRKxUicLOBIUUJyRhY2gceziYsvpCvNP9URrGvxxzGu2q5q0KOoymV7D2xWu3LdHaDUJHP2Dkw7E0qJPCks3n87UKaEuRPEiGhMRKn0HAs0Q9Ob7e1455be785fa6bd0d6"
    }
  });
  console.log("预案名称res", res);
  // const res = {
  //   data: {
  //     list: [
  //       {
  //         peoples: "[]",
  //         preplaninfoid: 19,
  //         orgid: "",
  //         starttime: "2023-11-05",
  //         eventtypesecond: "设备事故",
  //         authorizepeople: "席雨伟",
  //         attachmenturl: "502B2652177F3FCBF960973491FFB3C1",
  //         reportunitcode: "",
  //         zjlid: "17de26470a771817b42124faee3df9d1",
  //         tenantid: "1414896210194907137",
  //         extparams: null,
  //         eventtypefirst: "生产安全事故",
  //         name: "生产安全事故综合应急预案_断电",
  //         number: "ENN8126/HSE001C-2023",
  //         authorizeunitcode: "",
  //         releasetime: "2023-11-01",
  //         type: "综合应急预案",
  //         xxrksj: "2023-12-15 10:55:07",
  //         authorizeunitname: "",
  //         authorizeexplanation: "处理流程参照的是《 35kVI 段和Ⅱ段母线同时失电，启动柴油发电机》",
  //         status: 0,
  //         releaseunitname: "舟山基础设施运营智能群",
  //         remark: "",
  //         bz: "1702608900048",
  //         endtime: "2023-11-30",
  //         version: "2023版",
  //         releaseunitcode: "1414896210194907137",
  //         createusername: "席雨伟",
  //         onlinepreplanurl: "",
  //         reportunitname: ""
  //       }
  //     ],
  //     totalCount: 1,
  //     totalPage: 1,
  //     serviceBill: null
  //   }
  // };
  state.yamcOption = res.data.list;
};
const handleChuZhi = async (item) => {
  console.log("item==", item.processinstanceid);
  const res = await axios({
    method: "get",
    url: "/adapterServer/adapter/task/todo/process_instance/?processInstanceId=" + item.processinstanceid
  });
  console.log("res.data.data==", res.data.data);
  if (res.data && res.data.data) {
    const taskId = res.data.data[0].id;
    const url = "http://10.21.134.39:12841/workbench/micro/task/detail/" + taskId;
    window.open(url);
  } else {
    ElMessage.warning("处置未获取到id，不打开新页面");
  }
  // window.open("http://10.21.134.39:12841/workbench/micro/task/detail/17985761109122");
};
const getTableData = async () => {
  console.log("11");
  console.log("77");
  getEventId();
  const data = {};
  const res = await axios({
    method: "post",
    url: `/dataService/oss/search`,
    data,
    headers: {
      //单个请求设置请求头
      "Content-Type": "application/json",
      token: "5E3z9hyRDT2LW7oO8CVlA17zqg9siYnxAhPxIew5eGws8nbG4tDysgKYk6spsl4uurtxsjxZGBTSKXU2E4Ycot5jvf4SxmFzyLXshVUGU2icfkF3plsNtZoHPh3rMoqe0148915adc5037a6"
    }
  });
  // const res = {
  //   data: {
  //     list: [
  //       {
  //         extra2: "",
  //         riskid: "20231108085951125",
  //         processinstanceid: "17879269795008",
  //         rangeheight: "33",
  //         processcode: "c2fbad50-0f5f-47e2-bf62-72c04cac4085",
  //         riskplacecoor: "[122.28258595862034,30.09883166054057,-0.0012441341727344834]",
  //         rangeweight: "33",
  //         riskplace: "总变电所",
  //         extra3: "",
  //         risktype: "应急演练",
  //         processname: "应急-测试",
  //         accidenttypesecondid: "418",
  //         zjlid: null,
  //         risktypeid: "v1",
  //         plantype: "综合应急预案",
  //         riskstate: "1",
  //         riskplan: "生产安全事故综合应急预案_断电",
  //         extra1: "ENN8126/HSE001C-2023",
  //         accidenttypesecond: "其他生产安全事故",
  //         eventid: "",
  //         plantypeid: "1",
  //         xxrksj: "2023-11-27 15:11:56",
  //         risktime: "2023-11-08 08:59:51",
  //         bz: null,
  //         riskplanid: "19",
  //         accidenttypefirst: "生产安全事故",
  //         accidenttypefirstid: "450",
  //         riskname: "舟山市大面积停电应急演练",
  //         riskdes:
  //           "舟山500千伏双回海缆故障抢修，舟山电网因断面控制执行负荷管控110万千瓦，同时因设备故障损失10万千瓦，全市电网减供负荷达120万千瓦，约占舟山地区总负荷40%，舟山市政府根据《舟山市大面积停电应急预案》标准，启动大面积停电事件Ⅱ级应急响应。",
  //         planname: "ENN8126/HSE001C-2023",
  //         eventname: ""
  //       },
  //       {
  //         extra2: "",
  //         riskid: "20231108085951125",
  //         processinstanceid: "17985761081856",
  //         rangeheight: "33",
  //         processcode: "c2fbad50-0f5f-47e2-bf62-72c04cac4085",
  //         riskplacecoor: "[122.28258595862034,30.09883166054057,-0.0012441341727344834]",
  //         rangeweight: "33",
  //         riskplace: "总变电所",
  //         extra3: "",
  //         risktype: "应急演练",
  //         processname: "应急-测试",
  //         accidenttypesecondid: "418",
  //         zjlid: null,
  //         risktypeid: "v1",
  //         plantype: "综合应急预案",
  //         riskstate: "1",
  //         riskplan: "生产安全事故综合应急预案_断电",
  //         extra1: "ENN8126/HSE001C-2023",
  //         accidenttypesecond: "其他生产安全事故",
  //         eventid: "",
  //         plantypeid: "1",
  //         xxrksj: "2023-12-05 10:59:37",
  //         risktime: "2023-11-27 15:11:56",
  //         bz: null,
  //         riskplanid: "19",
  //         accidenttypefirst: "生产安全事故",
  //         accidenttypefirstid: "450",
  //         riskname: "舟山市大面积停电应急演练",
  //         riskdes:
  //           "舟山500千伏双回海缆故障抢修，舟山电网因断面控制执行负荷管控110万千瓦，同时因设备故障损失10万千瓦，全市电网减供负荷达120万千瓦，约占舟山地区总负荷40%，舟山市政府根据《舟山市大面积停电应急预案》标准，启动大面积停电事件Ⅱ级应急响应。",
  //         planname: "ENN8126/HSE001C-2023",
  //         eventname: ""
  //       }
  //     ],
  //     totalCount: 2,
  //     totalPage: 1,
  //     serviceBill: null
  //   }
  // };
  console.log("res", res);
  state.tableData = res.data.list;
};
const validateForm = () => {
  if (!state.form.riskName) {
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
// 根据当前时间获取eventid
const getEventId = () => {
  //将时间戳格式转换成年月日时分秒
  var date = new Date();
  var Y = date.getFullYear();
  var M = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  var h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  var m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  let millseconds = "";
  if (date.getMilliseconds() < 10) {
    millseconds = "00" + date.getMilliseconds();
  } else if (date.getMilliseconds() < 100) {
    millseconds = "0" + date.getMilliseconds();
  } else {
    millseconds = date.getMilliseconds();
  }
  eventId.value = String(Y) + String(M) + String(D) + String(h) + String(m) + String(s) + String(millseconds);
  riskTime.value = Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
};
const yjsjfqgdFirst = async () => {
  getEventId();
  const data = {
    //迎接类型
    riskType: state.form.riskType,
    //发生地点
    riskPlace: state.form.riskPlace,
    //发生地点坐标
    riskPlaceCoor: state.form.riskPlaceCoor,
    //发生时间
    riskTime: riskTime.value,
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
    riskPlanCode: "riskPlanCode",
    //应急描述
    riskDes: state.form.riskDes || "无",
    //应急名称
    riskName: state.form.riskName,
    //影响范围半径
    rangeWeight: state.form.rangeWeight,
    //影响范围高度
    rangeHeight: state.form.rangeHeight,
    //应急id，第一次发起生成的应急事件id，每个升级流程，都与之关联
    riskId: eventId.value
  };
  const res = await axios({
    method: "post",
    url: "/adapterServer/adapter/start/risk?taskCode=" + taskCode.value,
    data,
    headers: {
      //单个请求设置请求头
      "Content-Type": "application/json"
    }
  });
  console.log("点击保存-1、应急事件发起工单res==", res.data.data.taskInstanceCode);
  return res.data.data.taskInstanceCode;
};
const cxyjsjlcSecond = async (taskInstanceCode) => {
  // 这个接口在上个接口通了以后立马执行  后端不返回数据
  console.log(taskInstanceCode);
  const res = await axios({
    method: "get",
    url: "/adapterServer/adapter/query/processInstanceId?eventId=" + taskInstanceCode
    // url: "/adapterServer/adapter/query/processInstanceId?eventId=8944ab8688c14d24b816c7f0e433a528"
  });
  // const res = {
  //   data: {
  //     data: {
  //       riskName: "3",
  //       step_result_1_1_2: null,
  //       step_result_1_1_1: null,
  //       step_executed_2_1_2: false,
  //       step_executed_2_1_1: false,
  //       step_people_2_2_1: null,
  //       step_people_2_2_2: null,
  //       step_time_3_1_2: null,
  //       step_time_3_1_1: null,
  //       riskPlaceCoor: "3",
  //       step_time_3_1_3: null,
  //       riskPlace: "3",
  //       step_result_1_1_3: null,
  //       riskPlanCode: "riskPlanCode",
  //       step_result_2_1_1: null,
  //       step_executed_1_1_2: false,
  //       riskProcessInstanceId: "18106540381312",
  //       taskCode: null,
  //       step_executed_1_1_1: false,
  //       step_time_1_1_2: null,
  //       step_time_1_1_1: null,
  //       step_executed_1_1_3: false,
  //       step_time_2_1_2: null,
  //       step_time_2_1_1: null,
  //       riskPlanId: "19",
  //       step_time_1_1_3: null,
  //       step_group_2: "预警告知",
  //       step_group_1: "信息报告",
  //       step_result_2_1_2: null,
  //       attach_ment_3_1_1: null,
  //       attach_ment_3_1_2: null,
  //       operatorIframeUrl:
  //         "http://10.21.134.39:28180/publish/548297308526600?eventId=831ff9b564db4c7fb8161fb7cbfa22bd&riskName=3&riskType=应急演练&riskPlace=3&riskTime=2023-12-19 11:24:53.0&planType=专项应急预案&accidentType=&riskPlan=生产安全事故综合应急预案_断电&riskDes=3&riskProcessInstanceId=18106540381312&riskId=20231219112452252&accidentTypeFirst=生产安全事故&accidentTypeSecond=人身伤亡事故&riskPlaceCoor=3&rangeHeight=3&rangeWeight=3&riskPlanCode=riskPlanCode",
  //       attach_ment_3_1_3: null,
  //       rangeWeight: "3",
  //       step_content_2_1_1: "1. 联系中控，空压机 C-1201A、1#罐内泵 P-0201A、2#罐内泵 P-0202A 具备 启动条件。由工艺人员现场启动上述设备。",
  //       step_result_3_1_3: null,
  //       accidentType: null,
  //       step_result_3_1_2: null,
  //       step_content_2_1_2: "2. 联系总变内值班人员确认 1#码头变电所 2#进线已送电，检查 1#码头变 电所内电气设备运行正常。",
  //       step_result_3_1_1: null,
  //       attach_ment_2_1_1: null,
  //       accidentTypeFirst: "生产安全事故",
  //       isRisk: true,
  //       attach_ment_2_1_2: null,
  //       step_group_1_1: " ",
  //       step_group_3_1: "确认阶段",
  //       step_content_1_1_3: "3. 总变值班人员将 6kV 母分应急段隔离开关手车由“运行”位置摇至“试验” 位置;确认应急发电机已启动，6kv 应急段母线运行正常。",
  //       step_content_1_1_2:
  //         "2. 分别断开 6kV I 段、II 段、应急段各出线  开关并确认确已断开; 将 1#主变由“运行”改为“热备用”;断开 1#主变 35kV 开关母线闸刀; 将 2#主变由“运行”改为“热备用”;断开 2#主变 35kV 开关母线闸",
  //       step_people_3_1_3: null,
  //       taskName: null,
  //       step_content_1_1_1: "1. 检查监控系统报警记录及跳闸开关动作情况，确认 35kV I 段母线和Ⅱ段 母线已失电。",
  //       step_people_3_1_1: null,
  //       step_people_3_1_2: null,
  //       step_executed_2_2_2: false,
  //       riskBroadcastTemplate: null,
  //       riskTime: "2023-12-19 11:24:53.0",
  //       step_people_2_1_1: null,
  //       step_executed_2_2_1: false,
  //       step_people_2_1_2: null,
  //       attach_ment_1_1_3: null,
  //       iframeDataUrl: "http://10.21.134.39:28180/publish/548294742507528?riskPlanId=19",
  //       riskId: "20231219112452252",
  //       step_people_1_1_3: null,
  //       step_people_1_1_1: null,
  //       step_people_1_1_2: null,
  //       riskType: "应急演练",
  //       step_time_2_2_2: null,
  //       step_time_2_2_1: null,
  //       attach_ment_1_1_1: null,
  //       attach_ment_1_1_2: null,
  //       rangeHeight: "3",
  //       step_result_2_2_2: null,
  //       step_content_3_1_2: "2. 检查 UPS，直流屏，EPS 运行正常",
  //       step_result_2_2_1: null,
  //       step_content_3_1_1: "1. 确认 3#码头变电所已送电，检查 3#码头变电所内电气设备运行正常；确认现场应急照明启动。",
  //       planType: "专项应急预案",
  //       riskPlan: "生产安全事故综合应急预案_断电",
  //       step_content_3_1_3: "3. 待 35kV 供电系统恢复正常后，根据电调命令恢复正常运行方式。",
  //       step_group_3: "预警响应",
  //       accidentTypeSecond: "人身伤亡事故",
  //       step_content_2_2_2: "2. 联系总变内值班人员确认海水变电所 2#进线已送电，检查海水变电所内 电气设备运行正常。",
  //       step_content_2_2_1: "1. 联系总变内值班人员确认 2#码头变电所 2#进线已送电，检查 2#码头变 284电所内电气设备运行正常。",
  //       attach_ment_2_2_1: null,
  //       step_executed_3_1_2: false,
  //       attach_ment_2_2_2: null,
  //       step_executed_3_1_1: false,
  //       event_id: "831ff9b564db4c7fb8161fb7cbfa22bd",
  //       step_group_2_1: "联系中控",
  //       step_executed_3_1_3: false,
  //       step_group_2_2: "联系总变",
  //       riskDes: "3"
  //     },
  //     name: "生产安全事故综合应急预案_断电",
  //     startTime: 1702956293458,
  //     id: "18106540381312",
  //     endTime: null,
  //     state: 1,
  //     user: {
  //       loginName: "ioctest",
  //       id: "2",
  //       avatar: null,
  //       userName: "租户管理员"
  //     },
  //     tasks: null
  //   },
  //   resultCode: 0,
  //   resultMessage: "成功"
  // };
  console.log("查询应急事件流程实例res==", res);
  return res.data.data.id;
};
const xryjsjThird = async (processInstanceCode) => {
  getEventId();
  console.log(processInstanceCode);
  state.form.processInstanceId = processInstanceCode;
  // state.form.processInstanceId = "777";
  state.form.processCode = taskCode.value;
  state.form.riskId = eventId.value;
  state.form.riskTime = riskTime.value;
  const data = state.form;
  const res = await axios({
    method: "post",
    url: "/daasOnline/api/daas-online-main/v1/generate/query/1055",
    data,
    headers: {
      //单个请求设置请求头
      "Content-Type": "application/json"
    }
  });
  console.log("保存最后一步返回的res=", res.data);
  return res.data;
};
const submit = async () => {
  console.log("state.form===", state.form);
  if (validateForm()) {
    console.log("表单验证通过");
    // 点击保存-1、应急事件发起工单
    const taskInstanceCode = await yjsjfqgdFirst();
    console.log("应急事件发起工单返回taskInstanceCode==", taskInstanceCode);
    // 点击保存-2、查询应急事件流程实例ID
    setTimeout(async () => {
      const processInstanceCode = await cxyjsjlcSecond(taskInstanceCode);
      console.log("查询应急事件流程实例ID==", processInstanceCode);
      // 点击保存-3、通过智心服务写入应急事件
      const result = await xryjsjThird(processInstanceCode);
      console.log("result=", result);
      if (result.resultMessage == "成功") {
        ElMessage.success("保存成功");
        dialogFormVisible.value = false;
        // 刷新table
        getTableData();
      }
    }, 1500);
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
