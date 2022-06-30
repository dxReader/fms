<template>
  <div class="cmister-loading">
    <div class="cmister-loading-conts">
      <div class="cmister-loading-cont">
        <div class="cmister-loading-inner">
          <div class="img img1"></div>
          <div class="img img2"></div>
          <div class="img img3"></div>
          <div class="img img4"></div>
        </div>
      </div>
      <div class="cmister-title">
        正在进行数据分析，请稍等一会！
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
  @Component({})
export default class cmisterLoading extends Vue {
}
</script>

<style scoped lang="scss">
  .cmister-loading {
    position: fixed;
    background: rgba(0, 0, 0, .6);

    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 11111;
    .cmister-loading-conts {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .cmister-loading-cont {
        width: 413px;
        height: 413px;
        margin: 0 auto;
        @include themify($themes) {
          background-image: url('#{themed("bg-url")}/cmister/loading/bg.png');
          background-repeat: no-repeat;
          background-size: contain;
        }

        .cmister-loading-inner {
          width: 413px;
          height: 413px;
          @include themify($themes) {
            background-image: url('#{themed("bg-url")}/cmister/loading/circle.png');
            background-repeat: no-repeat;
            background-size: contain;
          }
          animation: myloading 30s infinite;
          animation-timing-function: linear;
        }
      }
      
      .cmister-title {
        font-size: 22px;
        margin-top: 20px;
        text-align: center;
        @include themify($themes) {
         color: themed("main-color");
        }
      }

      .img {
        width: 46px;
        height: 46px;
        position: absolute;
        @include themify($themes) {
          background-repeat: no-repeat;
          background-size: contain;
        }
        animation: imgloading 30s infinite;
        animation-timing-function: linear;
      }

      .img1 {
        top: 55px;
        left: 184px;
        @include themify($themes) {
          background-image: url('#{themed("bg-url")}/cmister/loading/img1.png');
          background-repeat: no-repeat;
          background-size: contain;
        }
      }

      .img2 {
        top: 182px;
        left: 311px;
        @include themify($themes) {
          background-image: url('#{themed("bg-url")}/cmister/loading/img2.png');
          background-repeat: no-repeat;
          background-size: contain;
        }
      }

      .img3 {
        top: 313px;
        left: 184px;
        @include themify($themes) {
          background-image: url('#{themed("bg-url")}/cmister/loading/img3.png');
          background-repeat: no-repeat;
          background-size: contain;
        }
      }

      .img4 {
        top: 182px;
        left: 55px;
        @include themify($themes) {
          background-image: url('#{themed("bg-url")}/cmister/loading/img4.png');
          background-repeat: no-repeat;
          background-size: contain;
        }
      }
    }

    @keyframes myloading {
      from {
        transform:rotate(0deg)
      }
      to {
        transform:rotate(360deg)
      }
    }

    @keyframes imgloading {
      from {
        transform:rotate(360deg)
      }
      to {
        transform:rotate(0deg)
      }
    }
  }
</style>
