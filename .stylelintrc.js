module.exports = {
    'defaultSeverity': 'warning',
    extends: [],
    "rules":{  
      "color-no-invalid-hex": true, //禁止使用无效的十六位进制的颜色
      "function-calc-no-invalid": true, //禁止在calc函数内使用无效的表达式
      "string-no-newline": true, //禁止在字符串中使用（未转义的）换行符。 
      "keyframe-declaration-no-important": true,//不允许!important在关键帧声明中使用。
      "declaration-block-no-duplicate-properties": true, //禁止在声明块中使用重复的属性
      "block-no-empty": [
        true, {"message":"禁止空块"}
      ],
      "comment-no-empty": [
        true, {"message":"禁止空注释"}
      ],
      "no-duplicate-at-import-rules": true, //禁止@import在样式表中使用重复规则
      "no-duplicate-selectors": [
        true,{"message":"禁止在样式表中使用重复的选择器"}
      ],
      "no-extra-semicolons":true, //禁止使用多余的分号（可自动修复）
      "length-zero-no-unit": [
        true,{"message":"不允许长度为零的单位"}
      ],
      "number-max-precision": [
        3,{"message":"数字中允许的小数位数为3位"}
      ],
      "color-hex-case": [  
        "lower", { "message": "颜色值请使用英文小写"}  
      ],  
      "shorthand-property-no-redundant-values": true, //禁止在速记属性（Autofixable）中使用冗余值。
      "value-no-vendor-prefix":true, //禁止使用值的供应商前缀。
      "declaration-block-single-line-max-declarations":1, //限制单行声明块中的声明数量。
      "function-name-case": "lower", //为函数名称指定小写或大写
      "number-leading-zero": [
        "never",{"message":"不允许小于1的小数前导零"}
      ],
      "number-no-trailing-zeros": [
        true, {"message":"禁止在数字中尾随零"}
      ],
      "string-quotes": [
        "double", {"message":"在字符串周围必须使用双引号"}
      ],
      "unit-case":"lower", //为单位指定小写或大写
      "declaration-colon-space-after": [
        "always", {"message":"在冒号声明后必须有一个空格"}
      ],
      "declaration-colon-space-before": [
        'never', {"message":"在冒号声明前不允许使用空格"}
      ],
      // "declaration-block-semicolon-newline-after": [
      //   "always", {"message": "在声明块的分号后需要换行符"}
      // ],
      "declaration-block-trailing-semicolon":'always', // 在声明块中要求或禁止尾随分号
      "indentation": ["tab", { 
        "severity": "warning",
        "message": "缩进有问题"
      }],
      "max-empty-lines": 1, //限制相邻的空行数


  } 
}