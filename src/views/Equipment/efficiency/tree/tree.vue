<template>
    <div class="effTree" :class="ftSize('0701', 2)">
      <el-scrollbar v-if="treeData.length">
          <p
            class="total"
            :class="[isClick ? 'gl-item-active' : 'defaultTotal', treeData.length>0 ? 'effTree_line':'']"
            @click="totalClick"
          >本类全部</p>
          <el-tree
            ref="tree"
            :indent="indent"
            :data="treeData"
            node-key="id"
            auto-expand-parent
            :default-expanded-keys="defaultExpanded"
            :default-checked-keys="defaultChecked"
            :expand-on-click-node="true"
            @node-click="handleNodeClick"
            :highlight-current="isHighlight"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span class="childText">
                <!-- <span :class="[data.class]"></span>
                          {{ node.naSubMedeqCa }}
                <i class="iconfont" :class="[data.icon]"></i>-->

                <span :class="[ !data.naFaDev ? 'treeNodeImg' : '' ]"></span>
                {{ data.naFaDev ? data.naFaDev : data.naSubMedeqCa }}
                <i
                  class="iconfont"
                  :class="[ data.icon ]"
                ></i>
              </span>
            </span>
          </el-tree>
      </el-scrollbar>
      <div v-else class="gl-noData">暂无数据</div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class tree extends Vue {
  @Prop({ default: () => [] }) readonly treeData!: any;
  @Prop({ default: true }) readonly isTotal?: boolean;
  @Prop({ default: () => [] }) readonly defaultExpanded?: Array<number>;
  @Prop({ default: () => [] }) readonly defaultChecked?: Array<number | string>;

  private indent: number = 90;
  private emitData: any = null;
  private isHighlight: boolean = true;
  private isClick: boolean = true;
  private sign: any = "";

  @Watch("isTotal", { deep: true, immediate: true })
  private totalChange(status: boolean) {
      this.isClick = status;
      this.isHighlight = !status;
  }

  @Watch("defaultChecked", { deep: true, immediate: true })
  private checked(status: any) {
      this.sign = status[0];
  }

  private handleNodeClick(data: any, parentNode: any): void {
      if (parentNode.level === 1 && data.children.length) {
          if (data.off) {
              data.icon = "iconshouqi";
          } else {
              data.icon = "iconzhankai2";
          }
      }
      data.off = !data.off;
      if (this.sign !== data.id) {
          this.sign = data.id;
          this.isHighlight = true;
          this.isClick = false;
          let that = this;
          that.emitData = {
              level: parentNode.level,
              sdFaDev: data.sdFaDev,
              sdSubMedeqCa: data.sdSubMedeqCa,
              naFaDev: data.naFaDev,
              sdMedeqCa: data.sdMedeqCa,
              naMedeqCa: data.naMedeqCa
          };
          this.$emit("treeChange", that.emitData);
      }
  }

  private totalClick(): void {
      if (this.sign) {
          this.sign = "";
          let that = this;
          that.isClick = true;
          that.isHighlight = false;
          that.emitData = {
              level: 0,
              sdFaDev: "",
              sdSubMedeqCa: "",
              naFaDev: ""
          };
          that.$emit("treeChange", that.emitData);
      }
  }
}
</script>

<style  rel="stylesheet/scss" lang="scss">
.effTree {
  height: 823px;
  padding: 24px 0 24px 29px;
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
    position: relative;
    height: 58px;
    line-height: 58px;
    cursor: pointer;
  }
  .effTree_line::before {
    content: '';
    position: absolute;
    top: 42px;
    right: 0;
    left: 40px;
    width: 1px;
    height: 24px;
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
        padding-left: 76px !important;
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
      left: 40px;
      width: 1px;
      height: 100%;
      @include themify($themes) {
        border-left: 1px dashed themed('main-color');
      }
    }
    .el-tree-node__content {
      height: 58px;
      line-height: 58px;
      @include themify($themes) {
        color: themed('key-word-color');
      }
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
}
</style>
