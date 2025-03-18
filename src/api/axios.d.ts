// axios.d.ts  //用来解决 http返回 报错 TS2339: Property 'code' does not exist on type 'AxiosResponse<any, any>'. 的问题
//参考https://blog.csdn.net/qq_38969618/article/details/119181738
import * as axios from 'axios'

declare module 'axios' {
    interface AxiosInstance {
        (config: AxiosRequestConfig): Promise<any>
    }
}
