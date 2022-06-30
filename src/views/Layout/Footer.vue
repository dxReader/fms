<template>
    <footer class="footer">技术支持：北京北青厚泽数据科技有限公司</footer>
</template>

<style lang="scss" scoped>
.footer {
    position: absolute;
    width: 100%;
    height: 44px;
    line-height: 44px;
    bottom: 0;
    font-size: 16px;
    text-align: center;
    // opacity: .7;
    @include themify($themes) {
        color: themed('sub-word-color');
    }
}
</style>