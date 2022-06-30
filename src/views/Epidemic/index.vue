<template>
    <div class="epidemic">
        <div class="el-row">
            <div class="el-col">
                <div class="grid-content bg-purple project">
                    <el-tabs :class="`${ftSize('0311', 3)}`" v-model="activeName" @tab-click="beforeLeave">
                        <el-tab-pane v-for="(item, key) in tabs" :key="key" :label="item.na" :name="item.cd"></el-tab-pane>
                    </el-tabs>
                    <medical-tech 
                        v-if=" activeName === '1101' " 
                        :midicalData="tabContent" 
                        :cdMod="activeName" 
                        :cdModTp="cdModTp" 
                        :cardActive="cardActive" 
                        @getUrl="getUrl" 
                    />
                    <healthy v-if=" activeName === '1102' "/>
                </div>
            </div>
        </div>
        <public-iframe :config="ifmConfig" />
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style rel="stylesheet/scss" lang="scss" src="./index.scss"></style>
