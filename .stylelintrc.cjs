/*
 * @Author: WangNing
 * @Date: 2022-12-27 19:43:29
 * @LastEditors: WangNing
 * @LastEditTime: 2023-01-03 16:00:55
 * @FilePath: /hz-map-tools/.stylelintrc.cjs
 */
module.exports = {
    // 注册 stylelint 的 prettier 插件
    plugins: ['stylelint-prettier'],
    // 继承一系列规则集合
    extends: [
        // standard 规则集合
        "stylelint-config-standard-scss",
        "stylelint-config-recommended-vue/scss",
    ],
    // 配置 rules
    rules: {
        // 开启 Prettier 自动格式化功能
        'prettier/prettier': true
    }
}