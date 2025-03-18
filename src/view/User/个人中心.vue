<template>
  <el-card>
  <div class="边框" style="width: 620px;height: 850px">



    <el-radio-group v-model="当前功能" style="margin-bottom: 5px">
      <el-radio-button label="基础信息"/>
      <el-radio-button label="基础功能"/>
      <el-radio-button label="余额充值"/>
      <el-radio-button label="购卡充值"/>
      <el-radio-button label="二次开发"/>
    </el-radio-group>
    <div v-show="当前功能==='基础信息'">
      <el-form>
        <el-form-item prop="username" label="公告">
          <el-text>{{ 公告 }}</el-text>
        </el-form-item>
        <el-form-item prop="username" label="用户分类">
          <el-text>{{ 个人信息.UserClassName }}</el-text>
        </el-form-item>
        <el-form-item prop="username" label="到期时间">
          <el-text>{{ TimestampToStr(个人信息.VipTime) }}</el-text>
        </el-form-item>
        <el-form-item prop="username" label="积分">
          <el-text>{{ 个人信息.VipNumber }}</el-text>
        </el-form-item>
        <el-form-item prop="username" label="登录ip">
          <el-text>{{ 个人信息.LoginIp }}</el-text>
        </el-form-item>
        <el-form-item prop="username" label="登录时间">
          <el-text>{{ TimestampToStr(个人信息.LoginTime) }}</el-text>
        </el-form-item>

      </el-form>
    </div>
    <UserInfo v-show="当前功能==='基础功能'"></UserInfo>
    <PayKa v-show="当前功能==='购卡充值'"></PayKa>
    <PayMoney v-show="当前功能==='余额充值'"></PayMoney>
    <exFunc v-show="当前功能==='二次开发'"></exFunc>



  </div>
  </el-card>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import UserInfo from "@/view/User/组件/基础功能.vue";
import PayKa from "@/view/User/组件/购卡充值.vue";
import PayMoney from "@/view/User/组件/余额充值.vue";
import exFunc from "@/view/User/组件/二开功能.vue";

import {F_取应用公告, F_密码找回或修改_超级密码} from "@/api/飞鸟快验sdk.js";


const 当前功能 = ref("基础信息")
const 个人信息 = ref({
  "Key": "",
  "LoginIp": "",
  "LoginTime": 0,
  "NewAppUser": false,
  "OutUser": 1,
  "RegisterTime": 0,
  "UserClassMark": 0,
  "UserClassName": "",
  "VipNumber": 0,
  "VipTime": 0
})
const 公告 = ref("")

onMounted(async () => {
  个人信息.value = JSON.parse(localStorage.getItem("UserInfo"))
  let ret = await F_取应用公告()
  if (ret.Status === 10000) {
    公告.value = ret.Data.AppGongGao
  }


})

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
  return`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


</script>

<style scoped lang="scss">
@import "@/styles/newLogin.scss";


.边框 {
  border-radius: 5px;
  padding: 5px 5px 5px 5px;
  border: 1px solid #0c0d0e;
}

.英数验证码 {
  padding: 0;
  margin: 0;
}
</style>
