import axios from 'axios' // 引入axios
import router from "@/router";
import {Aes解密并签名, Rsa公钥解密, Aes_CBC_192解密} from "@/api/飞鸟快验sdk.js";

const service = axios.create({
    baseURL: "http://127.0.0.1:18888/Api?AppId=10003",
    timeout: 99999
})

// http request 拦截请求 写入token
service.interceptors.request.use(
    config => {
        config.url;
        config.headers = {
            'Content-Type': 'application/json',
            'Token': localStorage.getItem("kyToken"),
            ...config.headers
        }
        return config
    },
    error => {

        return error
    }
)


// http response 拦截响应
service.interceptors.response.use(
    response => {

        //直接判断 b值 如果没有 不用解密,如果 b值32位长度 aes解密   大于32 rsa公钥解密
        if (response.data && response.data.b && response.data?.b.length === 32) {
            response.data = Aes解密并签名(response.data)
            console.log("Aes解密并签名")
            console.log(response.data)
        }

        //直接判断 b值 如果没有 不用解密,如果 b值32位长度 aes解密   大于32 rsa公钥解密
        if (response.data && response.data.b && response.data.b.length > 32) {
            let tempAesKey = Rsa公钥解密(response.data.b)
            if (tempAesKey.length > 1) {
                console.log("Rsa解密出的临时aes密钥解密a值结果")
                let str = Aes_CBC_192解密(response.data.a, tempAesKey)
                response.data = JSON.parse(str)
                console.log(response.data)
                ;
            }
            console.log("Rsa解密结果")
            console.log(response.data)
        }


        // 响应成功 返回data内容
        if (response.data.Status === 10000) {
            console.log("(response.data.Status === 10000")
            console.log(response.data)
            return response.data
        } else {
            //判断失败原因
            // Token无效,清除本地缓存,跳转登录页面 重新获取
            if (response.data.Status === 109 || response.data.Status === 106) {
                localStorage.setItem("UserInfo", "")
                localStorage.setItem("kyToken", "")
                router.replace('Login')
            }


            // 210登录状态失效 清除UserInfo 本地数据 跳转登陆页
            if (response.data.Status === 210) {
                localStorage.setItem("UserInfo", "")
                router.replace('Login')
            }

            ElMessage({
                showClose: true,
                message: response.data.Msg,
                type: 'error'
            })
            return response.data.Msg ? response.data : response
        }
    }
    ,
    error => {

        return error
    }
)

export default service

