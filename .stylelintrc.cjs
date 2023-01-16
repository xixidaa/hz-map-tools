/*
 * @Author: WangNing
 * @Date: 2022-12-27 19:43:29
 * @LastEditors: WangNing
 * @LastEditTime: 2023-01-13 18:48:07
 * @FilePath: /hz-map-tools/.stylelintrc.cjs
 */
module.exports = {
    // 注册 stylelint 的 prettier 插件
    plugins: ['stylelint-prettier'],
    // 继承一系列规则集合
    extends: [
        // standard 规则集合
        'stylelint-config-standard-scss',
        'stylelint-config-recommended-vue'
    ],
    customSyntax: 'postcss-html',
    overrides: [
        {
            files: ['**/*.{scss,css,sass}'], // css 相关文件由 postcss-scss 处理
            customSyntax: 'postcss-scss'
        }
    ],
    // 配置 rules
    rules: {
        // 开启 Prettier 自动格式化功能
        'prettier/prettier': true,
        "string-quotes":"single", // 单引号
        "rule-empty-line-before": null, 
        'scss/at-import-partial-extension': null, // 是否隐藏导入scss文件后缀名
        'declaration-block-trailing-semicolon': null, // 每个属性声明末尾都要加分号
        'selector-class-pattern': null, // 命名规范
        "color-function-notation": null, // 取消rgba小数点报错
        "declaration-empty-line-before": null,
        "max-line-length": null,
        "alpha-value-notation": null
    }
}