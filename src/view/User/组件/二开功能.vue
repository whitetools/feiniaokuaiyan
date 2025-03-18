<template>
  <div style="width: 100%">
    <el-row>
      <el-button type="primary" plain @click="on读公共变量">读公共变量
      </el-button>
      <el-button type="primary" plain @click="on执行公共js函数">执行公共js函数
      </el-button>
    </el-row>
    <el-row>
      <el-button type="primary" plain @click="on读用户云配置">读用户云配置
      </el-button>
      <el-button type="primary" plain @click="on写用户云配置">写用户云配置
      </el-button>
    </el-row>

  </div>
</template>
<script setup>
import {onMounted, ref} from 'vue'
import {
  F_取公共变量, F_公共js函数运行, F_用户云配置_取值, F_用户云配置_置值, F_置新绑定信息
} from "@/api/飞鸟快验sdk.js";

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

const on读公共变量 = async () => {
  let 局_变量名称 = "系统名称"
  let ret = await F_取公共变量(局_变量名称)
  ElMessage({
    type: ret.Status === 10000 ? "success" : "error",
    message: 局_变量名称 + ":" + ret.Data[局_变量名称],
    showClose: true,
  })
}


const on执行公共js函数 = async () => {
  let ret = await F_公共js函数运行("测试网页访问", "{}",true)
  ElMessage({
    type: ret.Status === 10000 ? "success" : "error",
    message: JSON.stringify(ret.Data),
    showClose: true,
  })
}

const on读用户云配置 = async () => {

  let 配置名称 = "窗口宽度"
  let ret = await F_用户云配置_取值(配置名称)
  if (ret.Status === 10000) {
    ElMessage({
      type: "success",
      message: 配置名称 + ":" + ret.Data[配置名称],
      showClose: true,
    })
  }


}

const on写用户云配置 = async () => {
  let 配置名称 = "窗口宽度"
  ElMessageBox.prompt('请输入配置信息,配置名称:' + 配置名称, 'Tip', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
  })
      .then(({value}) => {
        on写用户云配置_异步(配置名称,value)
      })
      .catch(() => {
      })

}
const on写用户云配置_异步 = async (配置名称,value) => {
  let ret = await F_用户云配置_置值(配置名称, value)
  if (ret.Status === 10000) {
    ElMessage({
      type: "success",
      message: "成功",
      showClose: true,
    })
  }
}
</script>

<style scoped>

</style>
