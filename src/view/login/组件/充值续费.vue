<template>
  <el-form label-width="120px">
    <el-divider>卡号充值</el-divider>
    <div style="align-items: center ">
      <el-form-item label="充值账号" style="width: 100%">
        <el-input v-model.trim="局_充值账号" placeholder="请输入卡号"></el-input>
      </el-form-item>
      <el-form-item label="使用充值卡" style="width: 100%">
        <el-input v-model.trim="局_使用充值卡" placeholder="请输入卡号"></el-input>
      </el-form-item>
    </div>
    <div style="text-align:center">
      <el-button style="width: 15vh;" @click="on使用充值卡充值" type="primary">充值</el-button>
    </div>


    <el-divider>选择功能</el-divider>
    <el-form-item>
      <el-radio-group v-model="操作Type" style="margin-bottom: 5px">
        <el-radio-button label="购卡"/>
        <el-radio-button label="续费"/>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="选择支付方式" style="width: 100%">
      <el-radio-group v-model="支付方式" style="align-items: center ">
        <el-radio v-for="key in Object.keys(支付通道状态)" :key="key" :label="key" v-show="支付通道状态[key]"
                  border>{{ key }}

        </el-radio>
      </el-radio-group>
    </el-form-item>


    <div style="align-items: center ">
      <el-form-item v-show="操作Type!=='购卡'" label="充值账号" style="width: 100%">
        <el-input v-model.trim="局_充值账号" placeholder="请输入卡号"></el-input>
      </el-form-item>
      <el-form-item label="选择充值卡">
        <el-select v-model="选择充值卡Id" placeholder="请选择要购买的充值卡">
          <el-option
              v-for="item in 数组_可购买充值卡"
              :key="item.Id"
              :label="item.Name+' => ¥'+item.Money"
              :value="item.Id"
          >
            <span style="float: left">{{ item.Name }}</span>
            <span
                style="
          float: right;
          color: var(--el-text-color-secondary);
          font-size: 13px;
        "
            >¥{{ item.Money }}</span
            >
          </el-option>
        </el-select>

      </el-form-item>
      <div v-show="操作Type==='购卡'">
        <el-form-item label="订单号" style="width: 100%">
          <el-input v-model.trim="订单信息.订单ID" placeholder="" class="只读编辑框"></el-input>
        </el-form-item>
        <el-form-item label="" style="width: 100%">
          <el-button type="primary" @click="on订单_支付购卡(选择充值卡Id)">购买卡号</el-button>
          <el-button @click="on查询订单信息">查询订单信息</el-button>
        </el-form-item>
      </div>

      <div v-show="操作Type==='续费'">
        <el-form-item>
          <el-button type="primary" style="margin-left: 5px" @click="on订单_购卡直冲(选择充值卡Id)">购卡直充</el-button>
        </el-form-item>
      </div>

      <div>
        <el-form-item v-if="订单信息.订单状态>0" label="订单ID">{{ 订单信息.订单ID }}</el-form-item>
        <el-form-item v-if="订单信息.订单状态>0" label="订单状态">
          {{
            订单信息.订单状态 === 1 ? "等待支付" : 订单信息.订单状态 === 2 ? "已支付待充值" : 订单信息.订单状态 === 3 ? "充值成功" : "异常状态" + 订单信息.订单状态.toString()
          }}
        </el-form-item>

        <el-form-item v-if="订单信息.订单状态===1" label="">
          <div style="text-align:center" v-if="订单信息.PayURL!==''">请在打开的网页支付</div>
          <div style="text-align:center"
               v-if="订单信息.PayQRCode!==''">请使用扫码支付
          </div>
        </el-form-item>
        <el-form-item v-if="订单信息.订单状态===1 && 订单信息.PayQRCodePNG!=='' ">
          <img style="width:  200Px; height: 200Px ;  padding: 0;margin: 0;"
               :src="'data:image/png;base64,'+订单信息.PayQRCodePNG"
               alt="请输入验证码"
          >
        </el-form-item>

      </div>

    </div>

  </el-form>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {
  F_余额充值_取支付通道状态,
  F_余额购买充值卡,
  F_卡号充值,
  F_取可购买卡类列表,
  F_取已购买卡号列表, F_订单_支付购卡,
  F_订单_查询支付结果, F_订单_购买余额, F_订单_购卡直冲
} from "@/api/飞鸟快验sdk";

function 时间_时间戳到时间(timestamp) {
  // 将十位时间戳转换为毫秒级时间戳
  const milliseconds = timestamp * 1000;
  // 创建Date对象
  const date = new Date(milliseconds);

  // 获取年、月、日、小时、分钟、秒
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  // 格式化时间文本
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const 操作Type = ref("购卡")
const 选择充值卡Id = ref(0)
const 订单信息 = ref({订单ID: "", PayQRCode: "", PayQRCodePNG: "", PayURL: "", 订单状态: 0})

const 数组_可购买充值卡 = ref([])


const on快验取可购买充值卡 = async () => {
  let 返回 = await F_取可购买卡类列表()
  console.log(返回)
  if (返回.Status === 10000) {
    数组_可购买充值卡.value = 返回.Data
  }
  if (数组_可购买充值卡.value.length > 0) {
    选择充值卡Id.value = 数组_可购买充值卡.value[0].Id

  }
}


const is加载中 = ref(false)
const 局_充值账号 = ref("")
const 局_使用充值卡 = ref("")
const 推荐人账号 = ref("")

const on使用充值卡充值 = async () => {

  is加载中.value = true
  let User = 局_充值账号.value
  let 返回 = await F_卡号充值(User ? User : "", 局_使用充值卡.value, 推荐人账号.value)
  is加载中.value = false
  console.info("on使用充值卡充值")
  console.info(返回)
  if (返回.Status === 10000) {
    ElMessage({
      type: "success",
      message: 返回.Msg === "" ? "充值成功" : 返回.Msg,
      showClose: true,
    })
  }

}
const on订单_购卡直冲 = async (Id) => {
  订单信息.value.PayURL = ""
  订单信息.value.PayQRCode = ""
  订单信息.value.订单ID = ""
  订单信息.value.订单状态 = 0

  if (Id > 0) {
    is加载中.value = true
    let 返回 = await F_订单_购卡直冲 (局_充值账号.value, Id, 支付方式.value)
    is加载中.value = false
    console.info("on订单_购卡")
    console.info(返回)
    if (返回.Status === 10000) {
      订单信息.value.订单ID = 返回.Data.OrderId
      订单信息.value.PayQRCode = 返回.Data.PayQRCode||""
      订单信息.value.PayQRCodePNG = 返回.Data?.PayQRCodePNG||""
      订单信息.value.订单状态 = 1
      订单信息.value.PayURL = 返回.Data?.PayURL || ""

      if (订单信息.value.PayURL !== "") {
        window.open(订单信息.value.PayURL, '网页支付')
        ElMessage({
          type: "success",
          message: "请在打开的网页支付",
          showClose: true,
        })
      }
      await on取支付结果()
    }
  }
}

const on订单_支付购卡 = async (Id) => {
  订单信息.value.PayURL = ""
  订单信息.value.PayQRCode = ""
  订单信息.value.订单ID = ""
  订单信息.value.订单状态 = 0

  if (Id > 0) {
    is加载中.value = true
    let 返回 = await F_订单_支付购卡 ( Id, 支付方式.value)
    is加载中.value = false
    console.info("on订单_购卡")
    console.info(返回)
    if (返回.Status === 10000) {
      订单信息.value.订单ID = 返回.Data.OrderId
      订单信息.value.PayQRCode = 返回.Data.PayQRCode||""
      订单信息.value.PayQRCodePNG = 返回.Data?.PayQRCodePNG||""
      订单信息.value.订单状态 = 1
      订单信息.value.PayURL = 返回.Data?.PayURL || ""

      if (订单信息.value.PayURL !== "") {
        window.open(订单信息.value.PayURL, '网页支付')
        ElMessage({
          type: "success",
          message: "请在打开的网页支付",
          showClose: true,
        })
      }
      await on取支付结果()
    }
  }
}

const on查询订单信息 = async () => {
  is加载中.value = true
  let 返回 = await F_订单_查询支付结果(订单信息.value.订单ID)
  is加载中.value = false
  console.info("购买充值卡记录")
  console.info(返回)
  if (返回.Status === 10000) {
    if (返回.Data?.KaName){
      局_使用充值卡.value=返回.Data.KaName
      ElMessage({
        type: "success",
        message: "卡号:"+返回.Data.KaName+",已填写到输入框",
        showClose: true,
      })
    }
  }
  ElMessage({
    type: "success",
    message: JSON.stringify(返回),
    showClose: true,
  })
}
const 轮询id = ref(0)
const on取支付结果 = async () => {//轮询当前订单状态s
  if (订单信息.value.订单ID === "") {
    clearInterval(轮询id.value)
    return
  }


  轮询id.value = setInterval(() => {
    if (订单信息.value.订单状态 === 3) {//充值成功停止轮询
      clearInterval(轮询id.value)
      return
    }

    F_订单_查询支付结果(订单信息.value.订单ID).then((返回) => {
      //请求成功后
      //console.log(返回)
      if (返回.Status === 10000) {
        订单信息.value.订单状态 = 返回.Data.Status
        if (返回.Data?.KaName){
          局_使用充值卡.value=返回.Data.KaName
        }

      } else {
        clearInterval(轮询id.value)  //订单不存在停止轮询
      }
      if (订单信息.value.订单状态 === 3) {//充值成功停止轮询
        clearInterval(轮询id.value)
      }
    })

  }, 3000)
}
//====================================
const 支付方式 = ref("")
const 支付通道状态 = ref({})
const on取支付通道状态 = async () => {

  let 返回 = await F_余额充值_取支付通道状态()
  console.info("取支付通道状态")
  console.info(返回)
  if (返回.Status === 10000) {
    支付通道状态.value = 返回.Data
    for (let key in 支付通道状态.value) {
      if (支付通道状态.value[key]) {
        支付方式.value = key
      }
    }
  }
}
onMounted(() => {
  on快验取可购买充值卡()
  on取支付通道状态()
})


</script>

<style scoped>
</style>
