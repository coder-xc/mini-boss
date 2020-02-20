import storageUtils from "./storageUtils";

// 初始时取一次并保存为user
const user = storageUtils.getUser()
export default {
    user, // 用来存储登录用户的信息，默认没有登录，初始值为 local 中读取的 user
    product: {}, // 需要查看的商品对象 
}