import {createRouter, createWebHashHistory, RouteRecordRaw,} from "vue-router";

// @ts-ignore
// @ts-ignore
// @ts-ignore
const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/view/login/login.vue')
    },{
        path: '/',
        name: '个人中心',
        component: () => import('@/view/User/个人中心.vue')
    }
]


const router = createRouter({
    history: createWebHashHistory('/'),
    routes: routes
})

var isF = false; //这个是用于判断动态路由是否已经被获取

const 路由守卫白名单 = ['/Login']
//路由守卫
router.beforeEach(async (to, from) => {

    to.path = decodeURI(to.path) //中文路由坑点, 正常跳转没问题,但是刷新后路由会是url编码后 所以会找不到路由 跳404,必须解码一次才能找到正确路由,英文就没这个问题,但是我还是喜欢中文
    if (to.path == "/Login") {
        return true;
    }

    //console.log(to)
    if (路由守卫白名单.indexOf(to.path) > -1) {
        return true
    }
    //如果没有 token  跳转登录
    if (!localStorage.getItem("UserInfo") || !localStorage.getItem("kyToken")) {
        return {path: "/Login"};
    } else {
        if (isF) {
            return true;
        } else {
            //let add = Store.getters.menuList || "";
            //routerData(add);
            isF = true;
            return {...to, replace: true};
        }
    }
});

export default router
