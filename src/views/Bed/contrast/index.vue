<template>
    <div class="bedContrast">
        <public-know-card :config="dataConfig" />
        <div class="header gl-date-head">
            <public-date @dateChange="dateChange" :defaultDate="dtDate" />
            <router-link class="gl-return iconfont iconfanhui"
                v-if="$route.query.euScene" 
                :to="{path: 'bed', query:{'euScene':$route.query.euScene}}" >
            </router-link>
        </div>
        <div class="content">
            <div class="left-main gl-box-sub gl-box-default">
                <div >
                    <el-input
                        v-model="searchStr" @keyup.enter.native="searchDept">
                        <i slot="suffix" class="el-input__icon el-icon-search" @click="searchDept"></i>
                    </el-input>
                    <el-table
                        style="width: 100%"
                        >
                        <el-table-column
                          label="排名"
                          align="center"
                          :width="80 * common.getProportion()">
                        </el-table-column>
                        <el-table-column
                          label="科室名称"
                          :width="143 * common.getProportion()">
                        </el-table-column>
                        <el-table-column
                          align="right"
                          :width="95 * common.getProportion()">
                          <template slot="header" slot-scope="scope">
                            <span class="header-name" :data-scope="scope">总分</span>
                            <div class="sort-box">
                                <div :class="sortItem['type'] === 'up' && sortItem['param'] === 'CWLYZF_CLN_CNT' ? 'active' : ''" @click="sort('up', 'CWLYZF_CLN_CNT')"></div>
                                <div :class="sortItem['type'] === 'down' && sortItem['param'] === 'CWLYZF_CLN_CNT' ? 'active' : ''" @click="sort('down', 'CWLYZF_CLN_CNT')"></div>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column
                          align="right"
                          :width="100 * common.getProportion()"
                          >
                          <template slot="header" slot-scope="scope">
                            <span class="header-name" :data-scope="scope">资源配置</span>
                            <div class="sort-box">
                                <div :class="{'active': sortItem.type === 'up' && sortItem.param === 'CWZYPZPGZ_CLN_CNT'}" @click="sort('up', 'CWZYPZPGZ_CLN_CNT')"></div>
                                <div :class="{'active': sortItem.type === 'down' && sortItem.param === 'CWZYPZPGZ_CLN_CNT'}" @click="sort('down', 'CWZYPZPGZ_CLN_CNT')"></div>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column
                          align="right"
                          :width="100 * common.getProportion()"
                          >
                          <template slot="header" slot-scope="scope">
                            <span class="header-name" :data-scope="scope">床位效率</span>
                            <div class="sort-box">
                                <div :class="{'active': sortItem.type === 'up' && sortItem.param === 'CWXLPGZ_CLN_CNT'}" @click="sort('up', 'CWXLPGZ_CLN_CNT')"></div>
                                <div :class="{'active': sortItem.type === 'down' && sortItem.param === 'CWXLPGZ_CLN_CNT'}" @click="sort('down', 'CWXLPGZ_CLN_CNT')"></div>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column
                          align="right"
                          :width="100 * common.getProportion()"
                          >
                          <template slot="header" slot-scope="scope">
                            <span class="header-name" :data-scope="scope">床位效益</span>
                            <div class="sort-box">
                                <div :class="{'active': sortItem.type === 'up' && sortItem.param === 'CWXYPGZ_CLN_CNT'}" @click="sort('up', 'CWXYPGZ_CLN_CNT')"></div>
                                <div :class="{'active': sortItem.type === 'down' && sortItem.param === 'CWXYPGZ_CLN_CNT'}" @click="sort('down', 'CWXYPGZ_CLN_CNT')"></div>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column label="科室选择">
                        </el-table-column>
                    </el-table>
                    <el-scrollbar :style="'height:' + 750 * common.getProportion() + 'px'">
                        <div class="line" v-if="typeof activeBlue.index ==='number' && typeof activeRed.index ==='number'" :style="{'height': Math.abs((activeBlue.index - activeRed.index) * 50 * common.getProportion())+'px','marginTop': activeBlue.index < activeRed.index ? activeBlue.index * 50 * common.getProportion() + 'px' : activeRed.index * 50 * common.getProportion() + 'px' }" :class="[activeBlue.index > activeRed.index ? 'redTop' : 'blueTop']">
                            <div class="child"></div>
                            <div class="child"></div>
                        </div>
                        <el-table
                            :data="showTableData"
                            style="width: 100%"
                            :show-header="false"
                            :row-style="rowStyle"
                            :empty-text="'未查询到数据'"
                            >
                            <el-table-column
                              label="排名"
                              align="center"
                              :width="80 * common.getProportion()">
                              <template slot-scope="scope">
                                <span>{{ scope.row.id }}</span>
                              </template>
                            </el-table-column>
                            <el-table-column
                              label="科室名称"
                              align="left"
                              :width="143 * common.getProportion()">
                              <template slot-scope="scope">
                                <span>{{ scope.row.naDept }}</span>
                              </template>
                            </el-table-column>
                            <el-table-column
                              align="right"
                              :width="95 * common.getProportion()">
                              <template slot="header">
                                <span class="header-name">总分</span>
                                <div class="sort-box">
                                    <div :class="{'active': sortItem.type === 'up' && sortItem.param === 'CWLYZF_CLN_CNT'}" @click="sort('up', 'CWLYZF_CLN_CNT')"></div>
                                    <div :class="{'active': sortItem.type === 'down' && sortItem.param === 'CWLYZF_CLN_CNT'}" @click="sort('down', 'CWLYZF_CLN_CNT')"></div>
                                </div>
                              </template>
                              <template slot-scope="scope">
                                  {{ numFormat.numStr(scope.row.CWLYZF_CLN_CNT, '分数') }}
                                <!-- {{ scope.row.CWLYZF_CLN_CNT || scope.row.CWLYZF_CLN_CNT===0 ? scope.row.CWLYZF_CLN_CNT : '-' }} -->
                              </template>
                            </el-table-column>
                            <el-table-column
                              align="right"
                              :width="100 * common.getProportion()"
                              >
                              <template slot="header">
                                <span class="header-name">资源配置</span>
                                <div class="sort-box">
                                    <div @click="sort('up', 'CWZYPZPGZ_CLN_CNT')"></div>
                                    <div @click="sort('down', 'CWZYPZPGZ_CLN_CNT')"></div>
                                </div>
                              </template>
                              <template slot-scope="scope">
                                  {{ numFormat.numStr(scope.row.CWZYPZPGZ_CLN_CNT, '分数') }}
                                <!-- {{ scope.row.CWZYPZPGZ_CLN_CNT || scope.row.CWZYPZPGZ_CLN_CNT===0 ? scope.row.CWZYPZPGZ_CLN_CNT : '-' }} -->
                              </template>
                            </el-table-column>
                            <el-table-column
                              align="right"
                              :width="100 * common.getProportion()"
                              >
                              <template slot="header">
                                <span class="header-name">床位效率</span>
                                <div class="sort-box">
                                    <div @click="sort('up', 'CWXLPGZ_CLN_CNT')"></div>
                                    <div @click="sort('down', 'CWXLPGZ_CLN_CNT')"></div>
                                </div>
                              </template>
                              <template slot-scope="scope">
                                  {{ numFormat.numStr(scope.row.CWXLPGZ_CLN_CNT, '分数') }}
                                <!-- {{ scope.row.CWXLPGZ_CLN_CNT || scope.row.CWXLPGZ_CLN_CNT===0 ? scope.row.CWXLPGZ_CLN_CNT : '-' }} -->
                              </template>
                            </el-table-column>
                            <el-table-column
                              align="right"
                              :width="100 * common.getProportion()"
                              >
                              <template slot="header">
                                <span class="header-name">床位效益</span>
                                <div class="sort-box">
                                    <div @click="sort('up', 'CWXYPGZ_CLN_CNT')"></div>
                                    <div @click="sort('down', 'CWXYPGZ_CLN_CNT')"></div>
                                </div>
                              </template>
                              <template slot-scope="scope">
                                  {{ numFormat.numStr(scope.row.CWXYPGZ_CLN_CNT, '分数') }}
                                <!-- {{ scope.row.CWXYPGZ_CLN_CNT }} -->
                              </template>
                            </el-table-column>
                            <el-table-column label="科室选择">
                              <template slot-scope="scope">
                                <div class="sel-item" :class="{'activeBlue': activeBlue.sdDept === scope.row.sdDept}" @click="selBlue(scope.row, scope.$index)"></div>
                                <div class="sel-item" :class="{'activeRed': activeRed.sdDept === scope.row.sdDept}" @click="selRed(scope.row, scope.$index)"></div>
                              </template>
                            </el-table-column>
                        </el-table>
                    </el-scrollbar>
                </div>
            </div>
            <div class="right-main">
                <div class="center">
                    <div class="left-child" :class="`${ftSize('0302', 1)}`">
                        资源配置
                        <div>
                            <i class="iconfont iconziyuanpeizhi"></i>
                        </div>
                    </div>
                    <div class="rt-child" :class="`${ftSize('0302', 1)}`">
                        床位效率
                        <div>
                            <i class="iconfont iconchuangweixiaoshuai"></i>
                        </div>
                    </div>
                    <div class="rb-child" :class="`${ftSize('0302', 1)}`">
                        <div>
                            <i class="iconfont iconchuangweixiaoyi"></i>
                        </div>
                        床位效益
                    </div>
                    <div class="total">
                        <p :class="`${ftSize('0302', 1)}`">总分</p>
                        <div class="vsbox" :class="`${ftSize('0501', 1)}`">
                            <span>{{numFormat.numStr(activeBlue.CWLYZF_CLN_CNT, '分数')}}</span>
                            <div><em>V</em><em>S</em></div>
                            <span>{{numFormat.numStr(activeRed.CWLYZF_CLN_CNT, '分数')}}</span>
                        </div>
                    </div>
                </div>
                <div class="right-top">
                    <div class="select">
                        <div class="blue" :class="`left ${ftSize('0406', 1)}`" v-if="activeBlue.naDept">{{activeBlue.naDept}}<i class="iconfont iconguanbi" @click="closeDept('blue')"></i></div>
                        <div class="red" :class="`left ${ftSize('0406', 1)}`" v-if="activeRed.naDept">{{activeRed.naDept}}<i class="iconfont iconguanbi" @click="closeDept('red')"></i></div>
                    </div>
                    <div class="chart" :class="{'gl-box-default gl-box-sub': $store.state.Global.themeName === 'theme-2' || $store.state.Global.themeName === 'theme-3'}">
                        <div :class="`left ${ftSize('0302', 1)}`">
                            <div class="title">
                                <span>资源配置</span>
                                <span>{{ blueData.CWZYPZPGZ_CLN_CNT ? numFormat.numStr(blueData.CWZYPZPGZ_CLN_CNT.value, '分数') : '-' }}</span>
                                <span>{{ redData.CWZYPZPGZ_CLN_CNT ? numFormat.numStr(redData.CWZYPZPGZ_CLN_CNT.value, '分数') : '-' }}</span>
                            </div>
                            <ul>
                                <li>
                                    <span>平均床位工作日<i class="iconfont iconshujuqiapian" @click="showCard('PJCWGZR_CLN_CNT', '平均床位工作日')"></i></span>
                                    <span>{{ (blueData.CWZYPZPGZ_CLN_CNT && numFormat.noUnitNumStr(blueData.CWZYPZPGZ_CLN_CNT.index[0].data, '日')) || '-' }}</span>
                                    <span>{{ (redData.CWZYPZPGZ_CLN_CNT && numFormat.noUnitNumStr(redData.CWZYPZPGZ_CLN_CNT.index[0].data, '日')) || '-' }}</span>
                                </li>
                                <li>
                                    <span>床位医师比<i class="iconfont iconshujuqiapian" @click="showCard('CWYSB_HR_PER', '床位医师比')"></i></span>
                                    <span>{{ blueData.CWZYPZPGZ_CLN_CNT && blueData.CWZYPZPGZ_CLN_CNT.index[1].data  ? `1:${blueData.CWZYPZPGZ_CLN_CNT.index[1].data.toFixed(2)}` : '-' }}</span>
                                    <span>{{ redData.CWZYPZPGZ_CLN_CNT && redData.CWZYPZPGZ_CLN_CNT.index[1].data  ? `1:${redData.CWZYPZPGZ_CLN_CNT.index[1].data.toFixed(2)}` : '-' }}</span>
                                </li>
                                <li>
                                    <span>床位护士比<i class="iconfont iconshujuqiapian" @click="showCard('HR_PER_HSRCB', '床位护士比')"></i></span>
                                    <span>{{ blueData.CWZYPZPGZ_CLN_CNT && blueData.CWZYPZPGZ_CLN_CNT.index[2].data  ? `1:${blueData.CWZYPZPGZ_CLN_CNT.index[2].data.toFixed(2)}` : '-' }}</span>
                                    <span>{{ redData.CWZYPZPGZ_CLN_CNT && redData.CWZYPZPGZ_CLN_CNT.index[2].data  ? `1:${redData.CWZYPZPGZ_CLN_CNT.index[2].data.toFixed(2)}` : '-' }}</span>
                                </li>
                            </ul>
                        </div>
                        <div :class="`right-top ${ftSize('0302', 1)}`">
                            <div class="title">
                                <span>床位效率</span>
                                <span>{{ blueData.CWXLPGZ_CLN_CNT ? numFormat.numStr(blueData.CWXLPGZ_CLN_CNT.value, '分数') : '-' }}</span>
                                <span>{{ redData.CWXLPGZ_CLN_CNT ? numFormat.numStr(redData.CWXLPGZ_CLN_CNT.value, '分数') : '-' }}</span>
                            </div>
                            <ul>
                                <li>
                                    <span>平均住院日<i class="iconfont iconshujuqiapian" @click="showCard('CLN_DAYS_PJZYR', '平均住院日')"></i></span>
                                    <span>{{ (blueData.CWXLPGZ_CLN_CNT && numFormat.noUnitNumStr(blueData.CWXLPGZ_CLN_CNT.index[0].data, '天')) || '-' }}</span>
                                    <span>{{ (redData.CWXLPGZ_CLN_CNT && numFormat.noUnitNumStr(redData.CWXLPGZ_CLN_CNT.index[0].data, '天')) || '-' }}</span>
                                </li>
                                <li>
                                    <span>床位周转次数<i class="iconfont iconshujuqiapian" @click="showCard('CLN_CNT_CWZZCS', '床位周转次数')"></i></span>
                                    <span>{{ (blueData.CWXLPGZ_CLN_CNT && numFormat.noUnitNumStr(blueData.CWXLPGZ_CLN_CNT.index[1].data, '次')) || '-' }}</span>
                                    <span>{{ (redData.CWXLPGZ_CLN_CNT && numFormat.noUnitNumStr(redData.CWXLPGZ_CLN_CNT.index[1].data, '次')) || '-' }}</span>
                                </li>
                                <li>
                                    <span>床位使用率<i class="iconfont iconshujuqiapian" @click="showCard('CLN_PER_CWSYL', '床位使用率')"></i></span>
                                    <span>{{ (blueData.CWXLPGZ_CLN_CNT && numFormat.numStr(blueData.CWXLPGZ_CLN_CNT.index[2].data, '%')) || '-' }}</span>
                                    <span>{{ (redData.CWXLPGZ_CLN_CNT && numFormat.numStr(redData.CWXLPGZ_CLN_CNT.index[2].data, '%')) || '-' }}</span>
                                </li>
                            </ul>
                        </div>
                        <div :class="`right-bottom ${ftSize('0302', 1)}`">
                            <div class="title">
                                <span>床位效益</span>
                                <span>{{ blueData.CWXYPGZ_CLN_CNT ? numFormat.numStr(blueData.CWXYPGZ_CLN_CNT.value, '分数') : '-' }}</span>
                                <span>{{ redData.CWXYPGZ_CLN_CNT ? numFormat.numStr(redData.CWXYPGZ_CLN_CNT.value, '分数') : '-' }}</span>
                            </div>
                            <ul>
                                <li>
                                    <span>单床产出<i class="iconfont iconshujuqiapian" @click="showCard('GL_AM_CJSR', '单床产出')"></i></span>
                                    <span>{{ (blueData.CWXYPGZ_CLN_CNT && numFormat.noUnitNumStr(blueData.CWXYPGZ_CLN_CNT.index[0].data, '元')) || '-' }}</span>
                                    <span>{{ (redData.CWXYPGZ_CLN_CNT && numFormat.noUnitNumStr(redData.CWXYPGZ_CLN_CNT.index[0].data, '元')) || '-' }}</span>
                                </li>
                                <li>
                                    <span>床日收入<i class="iconfont iconshujuqiapian" @click="showCard('CRSR_GL_AM', '床日收入')"></i></span>
                                    <span>{{ (blueData.CWXYPGZ_CLN_CNT && numFormat.noUnitNumStr(blueData.CWXYPGZ_CLN_CNT.index[1].data, '元')) || '-' }}</span>
                                    <span>{{ (redData.CWXYPGZ_CLN_CNT && numFormat.noUnitNumStr(redData.CWXYPGZ_CLN_CNT.index[1].data, '元')) || '-' }}</span>
                                </li>
                                <li>
                                    <span>床位成本<i class="iconfont iconshujuqiapian" @click="showCard('CJCB_GL_AM', '床位成本')"></i></span>
                                    <span>{{ (blueData.CWXYPGZ_CLN_CNT && numFormat.noUnitNumStr(blueData.CWXYPGZ_CLN_CNT.index[2].data, '元')) || '-' }}</span>
                                    <span>{{ (redData.CWXYPGZ_CLN_CNT && numFormat.noUnitNumStr(redData.CWXYPGZ_CLN_CNT.index[2].data, '元')) || '-' }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="right-bottom gl-box-default gl-box-sub">
                    <div class="child">
                        <h4 :class="`gl-box-title ${ftSize('0302', 1)}`">{{activeBlue.naDept}}分析建议</h4>
                        <div class="child-content" :class="`${ftSize('0403', 3)}`" >
                            <el-scrollbar v-if="blueAnalysis.length" style="height:100%">
                                <p v-for="(item,index) in blueAnalysis" :key="index">{{(index+1)+'、'+item}}</p>
                            </el-scrollbar>
                            <div class="gl-noData" v-else>暂无数据</div>
                        </div>
                    </div>
                    <div class="child">
                        <h4 :class="`gl-box-title ${ftSize('0302', 1)}`">{{activeRed.naDept}}分析建议</h4>
                        <div class="child-content" :class="`${ftSize('0403', 3)}`">
                            <el-scrollbar v-if="redAnalysis.length" style="height:100%">
                                <p v-for="(item,index) in redAnalysis" :key="index">{{(index+1)+'、'+item}}</p>
                            </el-scrollbar>
                            <div class="gl-noData" v-else>暂无数据</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style lang="scss" scpoed src="./index.scss"></style>

