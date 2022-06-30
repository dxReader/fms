<template>
    <div class="patient1">
        <iframe-box :config="ifmConfig" />
        <div class="gl-date-head">
            <public-date type="month" @dateChange="dateChange" />
            <router-link
                class="gl-return iconfont iconfanhui"
                v-if="$route.query.euScene"
                :to="{path: 'patient', query: {'euScene': 1, 'date': setDate}}"
            />
        </div>
        <div class="el-row">
            <div class="el-col el-col-4 left gl-box-default gl-box-sub patient1-left">
                <div>
                    <div
                        class="patient1-box"
                        v-for="(item, index) in boxNames"
                        :key="index"
                        v-show="index < 2"
                    >
                        <h4 :class="ftSize('0302', 1)">
                            {{item.na}}
                        </h4>
                        <div class="box-con" :class="index === 1 ? 'con-bg' : ''">
                            <div>
                                <!-- <div v-show="index === 0 && isBar" class="con" id="myBar"></div> -->
                                <public-chart
                                    v-show="index === 0 && isBar"
                                    :option="barOption"
                                    name="myBar"
                                    type="bar"
                                />
                            </div>
                            <div>
                                <div v-show="index === 1 && isTableData1" class="con">
                                    <public-table
                                        :header = 'header1'
                                        :height = 'height1'
                                        :tableData = "tableData1.data"
                                    />
                                </div>
                                <div class="gl-noData" :class="ftSize('0402', 3)" v-show="index === 1 && !isTableData1">暂无数据</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="el-col el-col-16 patient1-center">
                <div class="patient1-right-top">
                    <div
                        class="process-box"
                        v-for="(item, index) in processData"
                        :key="index"
                        :class="'process' + index">
                        <div
                            class="title"
                            :class="[item.isIcon ? 'title-change' : 'title-def', ftSize('0402', 3)]"
                            @click="processClick(item, index)">
                            {{item.title}}
                        </div>
                        <div class="icon">
                            <div @click="processClick(item, index)" :class="item.isIcon ? 'icon-change' : 'icon-def'"></div>
                        </div>
                        <div class="detail">
                            <div v-for="(el, i) in item.data" :key="i">
                                <div :class="el.isChange ? 'text-change' : 'text-def'">
                                    <div>
                                        <span class="gl-float-left text" :class="ftSize('0403', 2)">
                                            {{el.text}}<i class="iconfont iconshujuqiapian" @click.stop="showCard(el)"></i>
                                        </span>
                                        <p class="gl-float-left">
                                            <span class="num" :class="ftSize('0504', 2)">
                                                {{el.num}}
                                            </span>
                                            <span class="units" :class="ftSize('0504', 2)">
                                                {{el.unit === '%' && el.num !== '-' ? el.unit : ''}}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="patient1-right-bottom gl-box-default gl-box-sub">
                    <div>
                        <h4 :class="ftSize('0302', 1)">
                            {{processData[status - 1].data[1].text ? (processData[status - 1].data[1].text) : '' + '变化趋势'}}
                        </h4>
                        <div>
                            <public-chart
                                :option="lineOption"
                                name="leftLine"
                                type="line"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div class="el-col el-col-4 patient1-right right gl-box-default gl-box-sub">
                <div>
                    <div class="patient1-box">
                        <h4 :class="ftSize('0302', 1)">
                            {{boxNames[3].na}}
                        </h4>
                        <div class="box-con con-bg" :style="'height:' + tableData2.tableHeight + 'px'">
                            <div class="con" v-if="isTableData2">
                                <public-table
                                    :header = 'header2'
                                    :height = 'height2'
                                    :tableData = "tableData2.data"
                                >
                                         <template slot="name" slot-scope="scope">
                                            <span class="gl-float-left">
                                                {{ scope.item.name }}
                                            </span>
                                            <i @click="doctorDetail(scope.item.sdEmp)" class="iconfont iconshujuqiapian" />
                                        </template>
                                </public-table>
                            </div>
                            <div v-else class="gl-noData" :class="ftSize('0402', 3)">暂无数据</div>
                        </div>
                    </div>
                    <div class="patient1-box" v-show="showTable">
                        <h4 :class="ftSize('0302', 1)">
                            {{status === 5 ? boxNames[4].na : boxNames[5].na}}
                        </h4>
                        <div class="box-con con-bg" :style="'height:' + tableData3.tableHeightL + 'px'">
                            <div class="con" v-if="isTableData3">
                                <public-table
                                    :header = 'header3'
                                    :height = 'height3'
                                    :tableData = "tableData3.data"
                                />
                            </div>
                            <div v-else class="gl-noData" :class="ftSize('0402', 3)">暂无数据</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 数据卡片 -->
        <public-know-card :config="dataConfig" />
        <!-- 医生卡片 -->
        <public-doctor-card :data="configData" />
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style lang="scss" src="./index.scss"></style>
