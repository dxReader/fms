<template>
    <div class="average-operation-time">
        <div class="gl-date-head gl-clearfix">
            <public-date @dateChange="dateChange" :type="'quarter-month'" />
            <div class="search-box gl-float-left">
                <the-search :data="formData" @getValue="getValue"/>
            </div>
        </div>
        <!-- BI弹窗 -->
        <public-iframe :config="ifmUrl" />
    </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style rel="stylesheet/scss" lang="scss">
    @import "./index.scss";
</style>