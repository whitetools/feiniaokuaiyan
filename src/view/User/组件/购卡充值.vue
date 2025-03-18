<template>
  <div v-loading="is加载中">
    <el-card>
      <el-form label-width="120px">
        <div style="align-items: center ">
          <el-form-item label="购买充值卡">
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
            <el-button type="primary" style="margin-left: 5px" @click="on购买充值卡(选择充值卡Id)">立即购买</el-button>
            <el-button @click="on刷新购买记录">购买记录</el-button>
          </el-form-item>
        </div>


        <el-divider/>

        <div style="align-items: center ">
          <el-form-item label="使用充值卡" style="width: 100%">
            <el-input v-model.trim="局_使用充值卡" placeholder="请输入卡号"></el-input>
          </el-form-item>
          <el-form-item label="推荐人账号" style="width: 100%">
            <el-tooltip
                content="获取奖励，记得把自己的帐号告诉他哦。"
                effect="dark"
                placement="right">
              <el-input v-model="推荐人账号"
                        placeholder="填写推荐人帐号，他也奖励时间,推荐越多奖励越多。填自己无效。赶快帮助更多人，获取奖励，记得把自己的帐号告诉他哦。"></el-input>
            </el-tooltip>

          </el-form-item>
        </div>
        <div style="text-align:center">
          <el-button style="width: 15vh;" @click="on使用充值卡充值" type="primary">充值</el-button>
        </div>
      </el-form>
      <div style="margin-top: 5px">
        <el-table v-loading="is加载中" :data="数组_已购买充值卡" border style="width: 100% ;white-space: pre-wrap;"
                  ref="tableRef"
                  :max-height="2000"
                  v-if="数组_已购买充值卡.length>0"
                  :header-cell-style="{background:'#FAFAFAFF',color:'#606266'}">

          <el-table-column prop="Name" label="卡号" width="260" show-overflow-tooltip="">
            <template #default="scope">
              {{ scope.row.Name }}
            </template>
          </el-table-column>
          <el-table-column prop="KaClassName" label="卡类名称" width="150"/>
          <el-table-column prop="Num" label="已用/最大" width="85">
            <template #default="scope">
              <el-tag
                  :type="scope.row.Num<scope.row.NumMax?'':'warning'">
                {{ scope.row.Num.toString() + '/' + scope.row.NumMax.toString() }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="RegisterTime" label="制卡时间" width="160">
            <template #default="scope">
              {{ 时间_时间戳到时间(scope.row.RegisterTime) }}
            </template>
          </el-table-column>


          <template v-slot:empty>
            <div slot="empty" style="text-align: left;">
              <el-empty description="居然没有数据啊"/>
            </div>
          </template>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {F_余额购买充值卡, F_卡号充值, F_取可购买卡类列表, F_取已购买卡号列表} from "@/api/飞鸟快验sdk";

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

const 选择充值卡Id = ref(0)

const 数组_可购买充值卡 = ref([])
const 数组_已购买充值卡 = ref([])

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
const 局_使用充值卡 = ref("")
const 推荐人账号 = ref("")

const on使用充值卡充值 = async () => {

  is加载中.value = true
  let User=localStorage.getItem("User")
  let 返回 = await F_卡号充值(User?User:"", 局_使用充值卡.value, 推荐人账号.value)
  is加载中.value = false
  console.info("on使用充值卡充值")
  console.info(返回)
  if (返回.Status === 10000) {
    ElMessage({
      type: "success",
      message: 返回.Msg===""?"操作成功":返回.Msg,
      showClose: true,
    })
  }

}
const on购买充值卡 = async (Id) => {
  if (Id > 0) {
    is加载中.value = true
    let 返回 = await F_余额购买充值卡(Id)
    is加载中.value = false
    console.info("余额购买充值卡")
    console.info(返回)
    if (返回.Status === 10000) {
      局_使用充值卡.value = 返回.Data.KaName

      ElMessage({
        type: "success",
        message: 返回.Msg===""?"购买成功":返回.Msg,
        showClose: true,
      })
      if (数组_已购买充值卡.value.length > 0) {
        await on刷新购买记录()
      }

    }
  }
}
const on充值卡记录加一 = async (卡号: string) => {
  for (let i = 0; i < 数组_已购买充值卡.value.length; i++) {
    if (数组_已购买充值卡.value[i].Name === 卡号) {
      数组_已购买充值卡.value[i].Num++
    }
  }
}

const on刷新购买记录 = async () => {
  is加载中.value = true
  let 返回 = await F_取已购买卡号列表(5)
  is加载中.value = false
  console.info("购买充值卡记录")
  console.info(返回)
  if (返回.Status === 10000) {
    数组_已购买充值卡.value = 返回.Data
  }
}
onMounted(() => {
  on快验取可购买充值卡()
})
</script>

<style scoped>
</style>
