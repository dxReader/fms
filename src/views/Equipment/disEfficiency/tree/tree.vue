<template>
    <div class="disEffTree">
        <p class="total" :class="[isClick ? 'changeTotal' : 'defaultTotal', data.length>0 ? 'effTree_line':'', ftSize('0701', 3)]"  @click="totalClick">本类全部</p>
        <el-tree
            :class="ftSize('0701', 2)"
            ref="tree"
            :indent='indent'
            :data="data"
            node-key="id"
            :default-expanded-keys="defaultShow"
            :default-checked-keys="defaultCheck"
            auto-expand-parent
            :expand-on-click-node="true"
            @node-click="handleNodeClick"
            :highlight-current="isHighlight"
        >
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span class="childText">
                    <span :class="[ !data.naFaDev ? 'treeNodeImg' : '' ]"></span>
                    {{ data.naFaDev ? data.naFaDev :  data.naSubMedeqCa  }}
                    <i class="iconfont"  :class="[ data.icon ]"></i>
                </span>
            </span>
        </el-tree>
    </div>
</template>
<script>
export default {
    name: "tree",
    props: {
        data: {
            type: Array,
            default: ()=>[]
        },
        defaultShow: {
            type: Array,
            default: ()=>[]
        },
        defaultCheck: {
            type: Array,
            default: ()=>[]
        }
    },
    data() {
        return {
            indent: 90,
            emitData: null,
            isHighlight: true,
            isClick: true
        }
    },
    created() {
    },
    methods: {
        handleNodeClick(data, parentNode) {
            this.isHighlight = true;
            this.isClick = false;
            let that = this;
            
            if(parentNode.level === 1 && data.children.length) {
                if(data.off) {
                    data.icon = 'iconzhankai2'
                } else {
                    data.icon = 'iconshouqi'
                }
            }
            data.off = !data.off;
            
            that.emitData = {
                sdFaDev: data.sdFaDev,
                sdSubMedeqCa: data.sdSubMedeqCa,
                naFaDev: data.naFaDev
            };
            
            this.$emit('treeChange',that.emitData);
        },
        totalClick() {
            return false;
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
    .disEffTree {
        .is-horizontal{
            opacity:0!important;
        }
        .el-tree__empty-block {
            height: 700px;
        }
        .el-tree__empty-text{
            color: #d7dff5 !important;
        }
        .total {
            margin-bottom: 30px;
            @include themify($themes) {
                color: themed('select-lise-disabled-text') !important;
            }
            cursor: pointer;
            margin-left:15px;
        }
        .changeTotal {
            @include themify($themes) {
                color: themed('select-lise-disabled-text') !important;
            }
            cursor: not-allowed;
        }
        // .total::before {
        //     content: '';
        //     position: absolute;
        //     top: 38px;
        //     right: 0;
        //     left: 58px;
        //     width: 1px;
        //     height: 30px;
        //     border-left: 1px dashed #03f9fc;
        // }
        .effTree_line::before {
            content: '';
            position: absolute;
            top: 38px;
            right: 0;
            left: 58px;
            width: 1px;
            height: 30px;
            @include themify($themes) {
                border-left: 1px dashed themed('main-color');
            }
        }
        .el-tree {
            background-color: transparent !important;
        }
        // 子节点选中样式
        
        .el-tree--highlight-current
          .el-tree-node.is-current
          > .el-tree-node__content {
            font-weight: bold !important;
            @include themify($themes) {
              // color: themed("key-word-color2");
              font-weight: themed("box-title-font");
              background: themed("menu-active-bg");
            }
          .icon-yk_fangkuai_fill {
            color: #9ad1ff;
          }
        }
        
        
        

        .el-tree {
            color: #939ba3;
            .el-tree-node:hover{
                background: none;
            }
            >.el-tree-node:focus>.el-tree-node__content {
                background: none !important;
            }
            .el-tree-node__children {
                position: relative;
                .childText:before {
                    content: '';
                    position: absolute;
                    top: 28px;
                    right: 0;
                    left: -26px;
                    width: 18px;
                    height: 1px;
                    @include themify($themes) {
                        border-top: 1px solid themed('main-color');
                    }
                }
                .el-tree-node__content{
                    padding-left: 95px !important;
                }
                
                .is-current:active{
                    background: none;
                }
                
                
                
                .is-current .childText{
                    @include themify($themes) {
                        color: themed('key-word-color') !important;
                    }
                }
            }
            .el-tree-node__children::before {
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                left: 57px;
                width: 1px;
                height: 100%;
                @include themify($themes) {
                    border-left: 1px dashed themed('main-color');
                }
            }
            .el-tree-node__content {
                @include themify($themes) {
                    color: themed('key-word-color');
                }
                height: 58px;
                line-height: 58px;
                .custom-tree-node {
                    width: 100%;
                }
                >.el-tree-node__expand-icon {
                    position: absolute;
                    right: 0;
                }
                >.el-tree-node__expand-icon:before {
                    content: none;
                }
            }
            
            .el-tree-node__content:hover {
                background: none;
            }

            .childText {
                display: inline-block;
                width: 100%;
                position: relative;
                .treeNodeImg {
                    display: inline-block;
                    width: 36px;
                    height: 36px;
                    position: relative;
                    top: 10px;
                    @include themify($themes) {
                        background:  url('#{themed("bg-url")}/treeImg.png') no-repeat;
                        background-size: 100% 100%;
                    }
                }
                .iconzhankai2,
                .iconshouqi {
                    font-size: 16px;
                    color: #9fa9b6;
                    position: absolute;
                    right: 0;
                    margin-right: 20px;
                }
            }
        }
        .defaultTotal{
            cursor: not-allowed;
        }
    }
    .theme-2{
        .disEffTree{
            @include themify($themes) {
                color: themed('select-lise-disabled-text') !important;
            }
            
            cursor: not-allowed;
        }
    }
</style>
