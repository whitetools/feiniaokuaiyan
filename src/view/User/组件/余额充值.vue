<template>
  <div v-loading="is加载中">
    <el-card>
      <el-form label-width="120px">
        <div style="align-items: center ">
          <el-form-item label="充值金额">
            <el-input-number v-model="充值金额" :precision="2" :step="1" :value-on-clear="0.00" :min="0"/>
          </el-form-item>
          <div style="align-items: center ">
            <el-form-item label="充值方式" style="width: 100%">
              <el-radio-group v-model="支付方式">
                <el-radio v-for="key in Object.keys(支付通道状态)" :key="key" :label="key" v-show="支付通道状态[key]"
                          border>{{ key }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div style="text-align:center">
            <el-button style="width: 15vh; " type="primary" @click="on取余额充值地址">充值</el-button>
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
            <el-form-item v-if="订单信息.订单状态===1 && 订单信息.PayQRCode!=='' ">
              <img style="width:  380Px; height: 380Px ;  padding: 0;margin: 0;"
                   :src="订单信息.PayQRCode"
                   alt="请输入验证码"
              >
            </el-form-item>

          </div>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import QrcodeVue from 'qrcode.vue';
import {F_余额充值_取支付通道状态, F_订单_查询支付结果, F_订单_购买余额} from "@/api/飞鸟快验sdk.js";

const 充值金额 = ref(5)
const 支付方式 = ref("")

const 订单信息 = ref({订单ID: "", PayQRCode: "", PayURL: "", 订单状态: 0})

const 支付通道状态 = ref({})


const on快验取可购买充值卡 = async () => {

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

const is加载中 = ref(false)
const on取余额充值地址 = async () => {
  if (充值金额.value > 0) {
    clearInterval(轮询id.value)
    订单信息.value.PayURL = ""
    订单信息.value.PayQRCode = ""
    订单信息.value.订单ID = ""
    订单信息.value.订单状态 = 0
    is加载中.value = true
    let User = localStorage.getItem("User")
    let 返回 = await F_订单_购买余额(User, 充值金额.value, 支付方式.value)
    is加载中.value = false
    console.info("取余额充值地址")
    console.info(返回)
    if (返回.Status === 10000) {
      ElMessage({
        type: "success",
        message: 返回.Msg,
        showClose: true,
      })

      订单信息.value.订单ID = 返回.Data.OrderId
      订单信息.value.订单状态 = 返回.Data.Status


      订单信息.value.PayURL = 返回.Data?.PayURL || ""
      订单信息.value.PayQRCode = 返回.Data?.PayQRCode || ""


      if (订单信息.value.PayURL !== "") {
        window.open(订单信息.value.PayURL, '网页支付')
      }

      await on取支付结果()
    }
  } else {
    ElMessage({
      type: "error",
      message: "充值金额必须大于0",
      showClose: true,
    })
  }
}
const emit = defineEmits(['on更新个人信息'])
const 轮询id = ref(0)

const on取支付结果 = async () => {//轮询当前订单状态s
  if (订单信息.value.订单ID === "") {
    clearInterval(轮询id.value)
    emit('on更新个人信息')
    return
  }


  轮询id.value = setInterval(() => {

    F_订单_查询支付结果(订单信息.value.订单ID).then((返回) => {
      //请求成功后
      //console.log(返回)
      if (返回.Status === 10000) {
        订单信息.value.订单状态 = 返回.Data.Status
      } else {
        clearInterval(轮询id.value)  //订单不存在停止轮询
      }
      if (订单信息.value.订单状态 === 3) {//充值成功停止轮询
        clearInterval(轮询id.value)
      }


    })

  }, 3000)
}


onMounted(() => {
  on快验取可购买充值卡()
})
</script>

<style scoped>
</style>
