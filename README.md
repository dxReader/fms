# 医管宝

### 安装所需依赖
```
npm install
```

### 启动开发环境
```
npm run serve
```

### 编译成静态文件
```
npm run build
```

### Run your tests
```
npm run test
```

# 项目布局
```
.
├── fms                                         // 上线项目文件，放在服务器即可正常访问
├── public                                      // 资源
│   ├── static                                  // 第三方插件
│   │── favicon                                 // 项目图标
│   ├── index.html                              // 主入口html
│   ├── robots                                  // 搜索引擎
├── src                                         // 源码目录
│   ├── assets                                  // 静态资源
│   │   ├── icon_font                           // 字体icon
│   │   ├── images                              // 图片
│   │   └── json                                // 静态数据
│   ├── components                              // 公共组件
│   ├── config                                  // 公共配置
│   │   └── index                               // 资源地址配置
│   ├── directive                               // 全局自定义指令
│   ├── server                                  // 服务器资源
│   │   └── api                                 // 接口集合
│   ├── store                                   // vuex状态管理
│   │   ├── modules                             // 模块列表
│   │   └── index                               // store主入口
│   ├── styles                                  // 样式管理
│   │   ├── global                              // 全局
│   │   ├── index                               // 主入口
│   │   ├── reset_pc                            // 样式重置
│   │   └── theme                               // 换肤
│   ├── utils                                   // 公共方法
│   │   ├── axios                               // 请求封装
│   │   ├── element                             // 按需第三方组件
│   │   ├── numFormat                           // 业务方法
│   │   ├── personalize                         // js换肤                  
│   │   └── utils                               // 基础方法
│   ├── views                                   // 页面视图
│   │   ├── Ability                             // 科室能力
│   │   ├── BenchMark                           // 对标管理
│   │   ├── Cmister                             // 核心医生
│   │   ├── DailyReport                         // 日报
│   │   ├── Develop                             // 发展预测
│   │   ├── Epidemic                            // 疫情防控
│   │   ├── Equipment                           // 设备管理
│   │   ├── Home                                // 首页
│   │   ├── Income                              // 收入分析
│   │   ├── Indicators                          // 重点指标
│   │   ├── Layout                              // 全局主体
│   │   ├── Login                               // 登陆页
│   │   ├── MonthlyReport                       // 月报
│   │   ├── Password                            // 修改密码
│   │   ├── Patient                             // 患者分析
│   │   ├── Perspective                         // 全院透视
│   │   ├── Present                             // 今日动态
│   │   ├── Produce                             // 投入产出
│   │   ├── Target                              // 综合目标
│   │   ├── ThemeGraph                          // 手术平均时长
│   ├── App.vue                                 // 页面入口文件
│   ├── main.ts                                 // 程序入口文件，加载各种公共组件
│   ├── router.ts                               // 程序路由
│── browserslistrc                              // 支持的环境
│── eslintrc                                    // 编码规则
│── gitignore                                   // git忽略
│── CHANGELOG                                   // 版本变更说明
├── FMS2.0                                      // 项目说明
├── package                                     // 依赖描述
├── postcss.config                              // 页面自适应配置
├── tsconfig                                    // typescript说明
├── vue.config                                  // 打包配置
```