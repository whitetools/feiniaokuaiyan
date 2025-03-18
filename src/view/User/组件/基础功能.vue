<template>
  <div style="width: 100%">
    <el-row>
      <el-button type="primary" plain @click="on网络连接">网络连接
      </el-button>
      <el-button type="primary" plain @click="on取用户基础信息">取用户基础信息
      </el-button>
      <el-button type="primary" plain @click="on取软件用户信息">取软件用户信息
      </el-button>
      <el-button type="primary" plain @click="on检测登录状态">检测登录状态
      </el-button>
      <el-button type="primary" plain @click="on取绑定信息">取绑定信息
      </el-button>
      <el-button type="primary" plain @click="on取到期时间">取到期时间
      </el-button>
      <el-button type="primary" plain @click="on应用基础信息">应用基础信息
      </el-button>
    </el-row>
    <el-row>
      <el-button type="primary" plain @click="on用户投诉建议">用户投诉建议
      </el-button>
      <el-button type="primary" plain @click="on更换绑定信息">更换绑定信息
      </el-button>
      <el-button type="primary" plain @click="on删除绑定信息">删除绑定信息
      </el-button>
      <el-button type="primary" plain @click="on用户登录注销">注销
      </el-button>
    </el-row>
  </div>
</template>
<script setup>
import {onMounted, ref} from 'vue'
import {
  F_取会员到期时间戳或点数, F_取应用基础信息,
  F_取服务器连接状态, F_取用户基础信息,
  F_取登录状态,
  F_取绑定信息,
  F_置新用户消息, F_置新绑定信息, F_取软件用户信息, F_用户登录注销, F_删除绑定信息
} from "@/api/飞鸟快验sdk.js";
import router from "@/router";

function TimestampToStr(timestamp) {
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

const on网络连接 = async () => {
  let ret = await F_取服务器连接状态()
  ElMessage({
    type: ret.Status === 10000 ? "success" : "error",
    message: ret.Status === 10000 ? "连接正常" : ret.Msg,
    showClose: true,
  })
}
const on取用户基础信息 = async () => {
  let ret = await F_取用户基础信息()
  ElMessage({
    type: ret.Status === 10000 ? "success" : "error",
    message: JSON.stringify(ret.Data),
    showClose: true,
  })
}
const on取软件用户信息 = async () => {
  let ret = await F_取软件用户信息()
  ElMessage({
    type: ret.Status === 10000 ? "success" : "error",
    message:JSON.stringify(ret.Data),
    showClose: true,
  })
}
const on检测登录状态 = async () => {
  let ret = await F_取登录状态()
  ElMessage({
    type: ret.Status === 10000 ? "success" : "error",
    message: ret.Status === 10000 ? ret.Msg ? ret.Msg : "登录正常" : ret.Msg,
    showClose: true,
  })
}

const on取绑定信息 = async () => {
  let ret = await F_取绑定信息()
  if (ret.Status === 10000) {
    ElMessage({
      type: "success",
      message: ret.Data.Key,
      showClose: true,
    })
  }
}
const on应用基础信息 = async () => {
  let ret = await F_取应用基础信息 ()
  if (ret.Status === 10000) {
    ElMessage({
      type: "success",
      message: JSON.stringify(ret.Data),
      showClose: true,
    })
  }
}
const on取到期时间 = async () => {
  let ret = await F_取会员到期时间戳或点数()
  if (ret.Status === 10000) {
    ElMessage({
      type: "success",
      message: TimestampToStr(ret.Data.VipTime),
      showClose: true,
    })
  }
}
const on用户投诉建议 = async () => {

  ElMessageBox.prompt('请输入投诉建议', 'Tip', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
  })
      .then(({value}) => {
        on用户投诉建议_异步(value)
      })
      .catch(() => {
      })


}
const on用户投诉建议_异步 = async (value) => {
  let ret = await F_置新用户消息(3, value)
  if (ret.Status === 10000) {
    ElMessage({
      type: "success",
      message: "成功",
      showClose: true,
    })
  }
}
const on更换绑定信息 = async () => {

  ElMessageBox.prompt('请输入新绑定信息', 'Tip', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
  })
      .then(({value}) => {
        on更换绑定信息_异步(value)
      })
      .catch(() => {
      })


}
const on更换绑定信息_异步 = async (value) => {
  let ret = await F_置新绑定信息(value)
  if (ret.Status === 10000) {
    ElMessage({
      type: "success",
      message: "成功",
      showClose: true,
    })
  }
}
const on删除绑定信息 = async () => {

  let ret = await F_删除绑定信息 ()
  if (ret.Status === 10000) {
    localStorage.setItem("UserInfo", "")
    localStorage.setItem("kyToken", "")
    router.replace('Login')
    ElMessage({
      type: "success",
      message: "成功",
      showClose: true,
    })
  }


}
const on解除绑定信息_异步 = async (value) => {
  let ret = await F_置新绑定信息(value)
  if (ret.Status === 10000) {
    ElMessage({
      type: "success",
      message: "成功",
      showClose: true,
    })
  }
}
const on用户登录注销 = async () => {
  let ret = await F_用户登录注销 ()
  if (ret.Status === 10000) {
    localStorage.setItem("UserInfo", "")
    localStorage.setItem("kyToken", "")
    router.replace('Login')
    ElMessage({
      type: "success",
      message: "注销成功",
      showClose: true,
    })
  }
}

</script>

<style scoped>

</style>
