module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ["plugin:vue/essential", "@vue/prettier", "@vue/typescript"],
    rules: {
        /**
           *  "off"或者0    //关闭规则关闭
           *  "warn"或者1    //在打开的规则作为警告(不影响退出代码)
           *  "error"或者2    //把规则作为一个错误(退出代码触发时为1)
           */
        camelcase: 2, //制驼峰法命名
        eqeqeq: 2, //必须使用全等
        indent: [2, 4], //缩进风格
        semi: [0], //关闭语句强制分号结尾
        "no-console": process.env.NODE_ENV === "production" ? 1 : 0, //禁止使用console
        "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0, //禁止使用debugger
        "no-mixed-spaces-and-tabs": [2, false], //禁止混用tab和空格
        "no-tabs": 2, //禁止tabs换行
        "spaced-comment": 0, //注释空格
        "no-else-return": 2, //如果if语句里面有return,后面不能跟else语句
        "no-irregular-whitespace": 2, //不能有不规则的空格
        "no-redeclare": 2, //禁止重复声明变量
        "no-undef": 0, //不能有未定义的变量
        "no-use-before-define": 2, //未定义前不能使用
        "no-var": 2, //禁用var，用let和const代替
        "new-parens": 2, //new时必须加小括号
        "one-var": ["error", "never"], //禁止连续声明
        "use-isnan": 2, //禁止比较时使用NaN，只能用isNaN()
        "no-invalid-regexp": 2, //禁止无效的正则表达式
        "init-declarations": 2, //声明时必须赋初值
        "typescript/class-name-casing": 0, //类和接口的命名必须遵守帕斯卡命名法，比如 PersianCat
        "quote-props": [0, "always"], //对象字面量中的属性名是否强制双引号
        "valid-typeof": 2, //必须使用合法的typeof的值
        "prettier/prettier": 0, //避免规则冲突
        "no-empty-interface": true, //禁止空接口 {}
        "no-unused-vars": [2, {
            "vars": "all",
            "args": "after-used"
        }], //不能有声明后未被使用的变量或参数
        "space-before-function-paren": [2, "never"], //函数定义时括号前面有空格
        "no-undefined": 2, //禁止出现未使用过的变量
        "arrow-parens": 2, //箭头函数定义的参数需要括号
        "no-restricted-globals": 2,// 禁止 var 声明 与外层作用域的变量同名
        "no-confusing-arrow": 2,// 禁止修改 const 声明的变量
    },
    parserOptions: {
        parser: "@typescript-eslint/parser"
    }
};
