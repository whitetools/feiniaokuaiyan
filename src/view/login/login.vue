<template>
  <div class="边框" style="margin :0% 0% 50% 0%;width: 420px;">
    <el-radio-group @change="显示充值=true" v-model="当前功能" style="margin-bottom: 5px">
      <el-radio-button label="登录"/>
      <el-radio-button label="注册"/>
      <el-radio-button label="找回"/>
      <el-radio-button label="充值"/>
    </el-radio-group>
    <div v-if="显示充值" v-show="当前功能==='充值'">
      <ChongZhiXuFei></ChongZhiXuFei>
    </div>

    <el-form
        v-show="当前功能!=='充值'"
        :model="data"
    >
      <el-form-item prop="username">
        <el-input
            v-model="data.User"
            size="large"
            placeholder="请输入用户名"
            suffix-icon="user"

        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
            v-model="data.PassWord"
            show-password
            size="large"
            :placeholder="当前功能==='找回'?'请输入新密码':'请输入密码'"
        />
      </el-form-item>

      <el-form-item prop="password" v-if="当前功能==='找回'||当前功能==='注册'">
        <el-input
            v-model="data.superPassWord"
            show-password
            size="large"
            placeholder="请输入超级密码"
        />
      </el-form-item>
      <el-form-item prop="username" v-if="当前功能==='注册'">
        <el-input
            v-model="data.Qq"
            size="large"
            placeholder="请输入联系QQ"
        />
      </el-form-item>

      <el-form-item prop="captcha"
                    v-if="(当前功能==='登录'&& 开启验证码接口列表.UserLogin===1)||(当前功能==='注册'&& 开启验证码接口列表.NewUserInfo===1)||(当前功能==='找回'&& 开启验证码接口列表.SetPassWord===1)">
        <div class="英数验证码" style="height: 100%;width: 100%">
          <el-input
              v-model="CaptCha.CaptChaValue"
              placeholder="请输入右侧验证码"
              size="large"
              style="flex:1;padding-right: 20px; width: 40%"
          />

          <img style="width: 30%; height: 30Px ;  padding: 0;margin: 0;"
               :src="PicPath"
               alt="请输入验证码"
               @click="on刷新验证码()"
          >
        </div>
      </el-form-item>

      <el-form-item>
        <el-button
            type="primary"
            size="large"
            style="width: 100%; margin-left: 0"
            @click="on功能按钮被点击"
        >{{ 当前功能 }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import router from "@/router";
import {
  F_取Token,
  F_取开启验证码接口列表,
  F_取验证码, F_密码找回或修改_超级密码,
  F_提交验证码,
  F_用户注册,
  F_登录通用
} from "@/api/飞鸟快验sdk.js";
import ChongZhiXuFei from "@/view/login/组件/充值续费.vue";

const 显示充值   = ref(false)
const 当前功能 = ref("登录")
const 开启验证码接口列表 = ref({UserLogin: 0, SetPassWord: 0, NewUserInfo: 0})
const PicPath = ref("")
const data = ref({
  User: "",
  PassWord: "",
  superPassWord: "",
  Qq: "",
})
const CaptCha = ref({
  captchaId: "",
  captchaType: 1,
  CaptChaValue: "",
})

const on功能按钮被点击 = () => {


  if (当前功能.value === "注册") {
    func注册()
  }
  if (当前功能.value === "登录") {
    func登录()
  }
  if (当前功能.value === "找回") {
    func找回密码()
  }
}

const func注册 = async () => {
  if (开启验证码接口列表.value.NewUserInfo) {
    if (CaptCha.value.CaptChaValue.length < 4) {
      ElMessage({
        type: "error",
        message: "请输入验证码",
        showClose: true,
      })
      return
    }
    //如果开启了验证码,提前把验证码置入提交缓存
    F_提交验证码(CaptCha.value.captchaId, CaptCha.value.captchaType, CaptCha.value.CaptChaValue)
  }

  let post = data.value
  let ret = await F_用户注册(post.User, post.PassWord, "绑定信息", post.superPassWord, post.Qq)
  console.log(ret)
  if (ret.Status === 10000) {
    当前功能.value = "登录"
  }

  ElMessage({
    type: "success",
    message: ret.Msg,
    showClose: true,
  })
  await on刷新验证码()

}

const func登录 = async () => {
  if (开启验证码接口列表.value.UserLogin) {
    if (CaptCha.value.CaptChaValue.length < 4) {
      ElMessage({
        type: "error",
        message: "请输入验证码",
        showClose: true,
      })
      return
    }
    //如果开启了验证码,提前把验证码置入提交缓存
    F_提交验证码(CaptCha.value.captchaId, CaptCha.value.captchaType, CaptCha.value.CaptChaValue)
  }

  let post = data.value
  let ret = await F_登录通用(post.User, post.PassWord, "绑定信息", "我是动态标记,随便填写", "1.0.1")
  console.log("let ret = await F_登录通用(post.User, post.PassWord, \"绑定信息\", \"我是动态标记,随便填写\", \"1.0.1\")")
  console.log(ret)
  if (ret.Status === 10000) {
    console.log(ret.Data.toString())
    localStorage.setItem("UserInfo", JSON.stringify(ret.Data))
    localStorage.setItem("User", post.User)
    router.push('/') //登录成功跳转个人中心
    return
  }

  await on刷新验证码()

}
const func找回密码 = async () => {
  if (开启验证码接口列表.value.SetPassWord) {
    if (CaptCha.value.CaptChaValue.length < 4) {
      ElMessage({
        type: "error",
        message: "请输入验证码",
        showClose: true,
      })
      return
    }
    //如果开启了验证码,提前把验证码置入提交缓存
    F_提交验证码(CaptCha.value.captchaId, CaptCha.value.captchaType, CaptCha.value.CaptChaValue)
  }

  let post = data.value
  let ret = await F_密码找回或修改_超级密码(post.User, post.PassWord, post.superPassWord)
  console.log(ret)
  if (ret.Status === 10000) {
    当前功能.value = "登录"
  }
  if (返回.Status === 10000) {
    ElMessage({
      type: "success",
      message: ret.Msg,
      showClose: true,
    })
  }

  await on刷新验证码()

}
const on刷新验证码 = async () => {
  let 返回 = await F_取验证码(1);
  console.log(返回)
  if (返回.Status === 10000) {
    PicPath.value = 返回.Data.CaptChaImg
    CaptCha.value.captchaId = 返回.Data.CaptchaId
    CaptCha.value.CaptChaValue = ""
  }

}

const 读取开启验证码接口列表 = async () => {

  let 返回 = await F_取开启验证码接口列表();
  console.log(" F_取开启验证码接口列表();")
  console.log(返回)
  if (返回.Status === 10000 && 返回.Data.length>2) {
    console.log(返回.Data)
    let 临时开启验证码接口列表 = JSON.parse(返回.Data)
    console.log(临时开启验证码接口列表)
    开启验证码接口列表.value.NewUserInfo = 临时开启验证码接口列表.hasOwnProperty('NewUserInfo') ? 临时开启验证码接口列表.NewUserInfo : 0
    开启验证码接口列表.value.SetPassWord = 临时开启验证码接口列表.hasOwnProperty('SetPassWord') ? 临时开启验证码接口列表.SetPassWord : 0
    开启验证码接口列表.value.UserLogin = 临时开启验证码接口列表.hasOwnProperty('UserLogin') ? 临时开启验证码接口列表.UserLogin : 0
  }
  console.log(开启验证码接口列表.value)


}
//页面加载完毕
onMounted(async () => {
  await init()
})
const init = async () => {
  //判断是否有Token,没有先获取
  localStorage.setItem("kyToken", "")
  let ret = await F_取Token()
  console.log("await F_取Token()")
  console.log(ret)
  if (ret.Status === 10000) {
    localStorage.setItem("kyToken", ret.Data.Token)
    console.log("获取Token成功:" + ret.Data.Token)

    localStorage.setItem("CryptoKeyAes", ret.Data.CryptoKeyAes)
    console.log("获取CryptoKeyAes成功:" + ret.Data.CryptoKeyAes)
    //读取验证码开启的端口
    读取开启验证码接口列表()
    on刷新验证码()
  }

}

</script>

<style scoped lang="scss">
@import "@/styles/newLogin.scss";

.边框 {
  border-radius: 2px;
  padding: 5px 5px 5px 5px;
  border: 1px solid #0c0d0e;
}

.英数验证码 {
  padding: 0;
  margin: 0;
}
</style>
