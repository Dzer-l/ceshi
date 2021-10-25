<template>
	<div class="entry-mail-detail-mian">
		<div v-if="rotueState">
			<div class="content-list-mian">
				<div class="go-back-btn">
					<el-button type="primary" size="small" style="width:80px" @click="goBack">返回</el-button>
				</div>
				<div class="evidence-info">
					<h3>
						<i class="el-icon-s-claim" />
						<span>证据编号：</span>
						<span>{{ entryData.evidNo }}</span>
						<el-button type="text" style="margin-left: 30px; padding: 0" class="copy-order-num"
							:data-clipboard-text="entryData.evidNo" @click="copyNum">复制</el-button>
					</h3>
					<div class="evidence-info-list">
						<ul class="basic-information">
							<li>
								<span class="title">证据类型：</span><span>{{ entryData.evidTypeDesc }}</span>
							</li>
							<li>
								<span class="title">送达方式：</span><span>{{ mailData.mailType | theWay }}</span>
							</li>
							<li>
								<span class="title">公证处：</span><span>{{ entryData.orgName }}</span>
							</li>
							<li>
								<span class="title">办证点：</span><span>{{ entryData.certificateOfficeName }}</span>
							</li>
							<li>
								<span class="title">承办人：</span><span>{{ entryData.acceptSysUserName }}</span>
							</li>
							<li>
								<span class="title">取证时间：</span><span>{{ entryData.obtainTime }}</span>
							</li>
						</ul>

						<ul v-if="mailData.evidStatus == 203 || mailData.evidStatus == 202" class="time-information">
							<li>
								<span class="title">提交时间：</span><span>{{ entryData.createTime }}</span>
							</li>
							<li>
								<span class="title">寄函时间：</span><span>{{ entryData.mailTime }}</span>
							</li>
							<li>
								<span class="title">存证时间：</span><span>{{ entryData.storageTime }}</span>
							</li>
						</ul>

						<ul v-if="mailData.evidStatus !== 203 && mailData.evidStatus !== 202" class="time-information">
							<li>
								<span class="title">提交时间：</span><span>{{ entryData.createTime }}</span>
							</li>
							<li>
								<span class="title">审核通过时间：</span><span>{{ entryData.passingCheckTime }}</span>
							</li>
							<li>
								<span class="title">支付时间：</span><span>{{ entryData.payTime }}</span>
							</li>
							<li>
								<span class="title">支付编号：</span>
								<span>{{ entryData.payNo }}</span>
								<!-- v-if="entryData.payNo!==null" -->
								<el-button type="text" style="padding: 0; margin-left: 20px" class="copy-pay-num"
									:data-clipboard-text="entryData.payNo" @click="copyPayNum">
									复制
								</el-button>
							</li>
							<li>
								<span class="title">寄函时间：</span><span>{{ entryData.mailTime }}</span>
							</li>
							<li>
								<span class="title">完成时间：</span><span>{{ entryData.finishTime }}</span>
							</li>
						</ul>
						<ul class="status-information">
							<li class="stress">
								<span class="title" style="width:60px">状态：</span><span
									class="stress-text">{{ mailData.evidStatusDesc }}</span>
							</li>
							<li v-if="mailData.evidStatus == 201">
								<span>待用户将拟寄送文件原件邮寄至公证处</span>
							</li>
							<li v-if="mailData.evidStatus == 4">
								<span>请在审核通过前完成订单信息的<br>修改（包括费用信息）</span>
							</li>
							<!-- <li
                v-if="
                  mailData.evidStatus !== 203 && mailData.evidStatus !== 202
                "
                class="stress"
              >
                <span class="title" style="width:60px">总费用：</span><span class="stress-text">{{ countCost }}</span>
              </li> -->
						</ul>
					</div>
				</div>
				<div class="evidence-info account-information">
					<h3><i class="el-icon-s-claim" /><span>取证账号</span></h3>
					<div class="evidence-info-list">
						<el-table :data="accountData" :header-cell-style="{ color: '#333', background: '#e6f6fe' }"
							border style="width: 100%">
							<el-table-column prop="userAccount" label="用户名" show-overflow-tooltip />
							<el-table-column prop="userName" label="姓名" show-overflow-tooltip />
							<el-table-column prop="" label="证件类型">
								<template slot-scope="scope">
									<span>
										{{ (scope.row.organizationCardType?scope.row.organizationCardType: scope.row.cardType)|filterCardType }}
									</span>
								</template>
							</el-table-column>
							<el-table-column prop="" label="证件号码" show-overflow-tooltip>
								<template slot-scope="scope">
									<span>
										{{ scope.row.organizationCardNum?scope.row.organizationCardNum: scope.row.cardNum }}
									</span>
								</template>
							</el-table-column>
							<el-table-column prop="" label="性别">
								<template slot-scope="scope">
									<span>
										{{ parseInt(scope.row.gender) === 1 ? "男" : "女" }}
									</span>
								</template>
							</el-table-column>
							<el-table-column prop="birth" label="出生日期" />
							<el-table-column prop="mobile" label="联系方式" />
							<el-table-column prop="" label="操作">
								<template slot-scope="scope">
									<span>
										<el-button type="text" @click="viewAccountInformation(scope.row)">查看</el-button>
									</span>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>
				<div class="evidence-info">
					<div class="tab-main">
						<el-tabs v-model="activeName" @tab-click="handleClick(activeName)">
							<el-tab-pane label="案件信息" name="first">
								<div class="case-information">
									<el-table :data="personData"
										:header-cell-style="{color: '#333',background: '#e6f6fe',}" border
										style="width: 100%; margin-top: 20px">
										<el-table-column label="当事人类型" width="">
											<template slot-scope="scope">
												<span>{{scope.row.personType == 1 ? "寄件人" : "受送达人"}}</span>
											</template>
										</el-table-column>
										<el-table-column prop="name" label="姓名" width="" />
										<el-table-column prop="phone" label="手机号码" />
										<el-table-column prop="fixedLine" label="固话号码" />
										<el-table-column prop="company" label="公司名称" />
										<el-table-column prop="" label="地址">
											<template slot-scope="scope">
												<span>
													{{ scope.row.province }}
													{{ scope.row.city }}
													{{ scope.row.county }}
													{{ scope.row.deatilAddress }}
												</span>
											</template>
										</el-table-column>
									</el-table>
									<el-pagination :page-size="size" layout="total, prev, pager, next" :total="total"
										@current-change="handlePageChange" />
									<div class="compile-tost" style="margin-top: 20px">
										<h3><i class="el-icon-s-shop" /><span>费用信息</span></h3>
										<el-button v-if="mailData.evidStatus === 4" type="primary" size="small"
											style="margin-right: 0" @click="compileCost">编辑费用</el-button>
									</div>
									<el-table :data="costData"
										:header-cell-style="{color: '#333',background: '#e6f6fe',}" border
										style="width: 100%">
										<el-table-column prop="type" label="业务类型" width="" />
										<el-table-column prop="witnessNum" label="数量" width="" />
										<el-table-column prop="legalServiceCost" label="法律服务费" />
										<el-table-column prop="witnessCost" label="存证费" />
										<el-table-column prop="countCost" label="总费用" />
									</el-table>
									<div class="total">
										<h5>
											总合计:<span>{{ countCost }}</span>
										</h5>
									</div>
								</div>
							</el-tab-pane>
							<el-tab-pane label="证据文件" name="second">
								<div class="instrument-evidence">
									<!-- <div class="btn">
										<el-buttonsize="medium" type="primary" @click="extractingAllEvidence">提取证据</el-button>
									</div> -->
									<el-table :data="materialListData"
										:header-cell-style="{color: '#333',background: '#e6f6fe',}" border
										style="width: 100%; margin-top: 20px">
										<el-table-column prop="evidNo" label="证据编号" width="" />
										<el-table-column prop="evidName" label="证据名称" />
										<el-table-column prop="" label="证据类型" width="">
											<template slot-scope="scope">
												<span>
													{{ scope.row.evidType | modeService }}
												</span>
											</template>
										</el-table-column>
										<el-table-column prop="obtainTime" label="取证时间" />
										<el-table-column prop="finishTime" label="存证时间 " />
										<el-table-column label="操作" width="200" align="center">
											<template slot-scope="scope">
												<el-button size="mini" type="text" class="exit_btn"
													@click="extractEntry(scope.row)">详情</el-button>
												<el-button v-if="mailData.evidStatus===10" size="mini" type="text"
													class="exit_btn" @click="unfoldChange(scope.row)">提取证据</el-button>
												<el-button size="mini" type="text" class="exit_btn"
													@click="expandDetail(scope.row)">展开</el-button>
											</template>
										</el-table-column>
									</el-table>
									<el-collapse-transition>
										<div v-show="unfold" class="unfold-dateail">
											<div class="file-list">
												<ul>
													<li v-for="(item, index) in mailEvidMaterialDTOList"
														:key="index + 10">
														{{ item.materialName }}
													</li>
												</ul>
											</div>
											<div class="pack-up">
												<el-button type="text" @click="packUp">收起</el-button>
											</div>
										</div>
									</el-collapse-transition>
								</div>
							</el-tab-pane>
							<el-tab-pane label="物流信息" name="third">
								<div class="logistics-information">
									<div v-if="getLogisticsData.length > 0" class="info-length">
										<div class="logistics-list-main">
											<div v-for="(item, index) in getLogisticsData" :key="index"
												class="logistics-list"
												:class="index === listActive ? 'logistics-list-active' : ''"
												@click="changeActive(index, item)">
												<p>运单号：{{ item.emsNo }}</p>
												<p>收件人：{{ item.mailEvidPersonInfoDTO.name }}</p>
											</div>
										</div>
										<div class="time-line-mian">
											<el-timeline>
												<el-timeline-item v-for="(activity, index) in activities" :key="index"
													:timestamp="activity.createTime" :color="activity.color">
													{{ activity.opInfo }}
												</el-timeline-item>
											</el-timeline>
											<div>
												<!-- <el-button v-if="canYouPrint" type="primary" size="medium"
													style="height:32px;width:80px;padding:0"
													@click="handleRefreshLogistics">刷新物流
												</el-button> -->
												<el-button v-if="canYouPrint" type="primary" size="medium"
													style="height:32px;width:80px;padding:0" @click="handlePrint">打印面单
												</el-button>
											</div>
										</div>
									</div>
									<div v-else class="empty">
										<span>
											<i class="el-icon-warning" />
											<h5>暂无物流信息</h5>
										</span>
									</div>
								</div>
							</el-tab-pane>
						</el-tabs>
					</div>
				</div>

				<div class="tost-dialog-main">
					<el-dialog :visible.sync="tostDialog" title="费用编辑" :close-on-click-modal="false">
						<el-form :model="tostData" label-position="right" label-width="100px">
							<div class="cost-dialog-form-title">
								<span class="cost-dialog-form-title-text">业务类型：</span>
								<span>{{ mailData.mailTypeDesc }}</span>
							</div>
							<el-form-item label="数量：">
								<el-input v-model="tostData.quantity" autocomplete="off" disabled size="medium" />
							</el-form-item>
							<el-form-item label="法律服务费：">
								<el-input v-model="tostData.legalTost" autocomplete="off" size="medium"
									@input="realTimeComputing" />
							</el-form-item>
							<el-form-item label="存证费：">
								<el-input v-model="tostData.saveTost" autocomplete="off" size="medium" disabled />
							</el-form-item>
							<el-form-item label="合计：">
								<el-input v-model="tostData.total" autocomplete="off" size="medium" disabled />
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button size="medium" @click="tostDialog = false">取 消</el-button>
							<el-button type="primary" size="medium" @click="modifyCost">确 定</el-button>
						</div>
					</el-dialog>
				</div>
				<!-- 待取件 -->
				<div v-if="mailData.evidStatus == 202||mailData.evidStatus == 204" class="order-status-main">
					<div class="statu-content">
						<ul>
							<li><span>状态</span></li>
							<li>
								<span class="state">{{ mailData.evidStatusDesc }}</span>
							</li>
						</ul>
						<ul style="margin-right: 20px">
							<li><span>订单总额</span></li>
							<li>
								<span class="money">￥{{ countCost }}</span>
							</li>
						</ul>
					</div>
				</div>

				<!-- 运送中 -->
				<div v-if="mailData.evidStatus == 203" class="order-status-main">
					<div class="statu-content">
						<ul>
							<li><span>状态</span></li>
							<li>
								<span class="state">{{ mailData.evidStatusDesc }}</span>
							</li>
						</ul>
						<ul style="margin-right: 20px">
							<li><span>订单总额</span></li>
							<li>
								<span class="money">￥{{ countCost }}</span>
							</li>
						</ul>
					</div>
				</div>
				<!-- 待邮寄原件 -->
				<div v-if="mailData.evidStatus == 201" class="order-status-main">
					<div class="statu-content">
						<ul>
							<li><span>状态</span></li>
							<li>
								<span class="state">{{ mailData.evidStatusDesc }}</span>
							</li>
						</ul>
						<ul style="margin-right: 20px">
							<li><span>订单总额</span></li>
							<li>
								<span class="money">￥{{ countCost }}</span>
							</li>
						</ul>
					</div>
				</div>
				<!-- 待公证处收件 -->
				<div v-if="mailData.evidStatus == 3||mailData.evidStatus == 301" class="order-status-main">
					<div class="statu-content">
						<ul>
							<li><span>状态</span></li>
							<li>
								<span class="state">{{ mailData.evidStatusDesc }}</span>
							</li>
						</ul>
						<ul :class="mailData.evidStatus == 301?'mar_right':''">
							<li><span>订单总额</span></li>
							<li>
								<span class="money">￥{{ countCost }}</span>
							</li>
						</ul>
						<!-- <el-button class="btn" @click="openPop(4)"> -->
						<el-button v-if="mailData.evidStatus == 3" class="btn"
							@click="handleComfirmRreceivedReceived('2061')">
							<span>确认收件</span>
						</el-button>
					</div>
				</div>
				<!-- 待审核 -->
				<div v-if="mailData.evidStatus == 4" class="order-status-main">
					<div class="statu-content">
						<ul>
							<li><span>状态</span></li>
							<li>
								<span class="state">{{ mailData.evidStatusDesc }}</span>
							</li>
						</ul>
						<ul>
							<li><span>订单总额</span></li>
							<li>
								<span>￥{{ countCost }}</span>
							</li>
						</ul>
						<el-button class="btn" style="background:#ff7272" @click="refusedAccept()">
							<span>拒绝受理</span>
						</el-button>
						<el-button class="btn" style="margin-left: 0" @click="getApproved(5)">
							<span>通过审核</span>
						</el-button>
					</div>
				</div>

				<div class="reject">
					<el-dialog title="拒绝受理" :visible.sync="refusedAcceptDialogVisible" :close-on-click-modal="false">
						<el-form ref="refusedAcceptDialog" :model="refusedAcceptData" :rules="refusedAcceptRules">
							<el-form-item label="拒绝原因" label-width="80px" prop="cause">
								<el-input v-model="refusedAcceptData.cause" type="textarea" :rows="4"
									placeholder="请输入5-120个字" maxlength="120" />
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button @click="refusedAcceptDialogVisible = false">取 消</el-button>
							<el-button type="primary" @click="refusedAcceptSubmit">确 定
							</el-button>
						</div>
					</el-dialog>
				</div>

				<!-- 待支付 -->
				<div v-if="mailData.evidStatus == 5" class="order-status-main">
					<div class="statu-content">
						<ul>
							<li><span>状态</span></li>
							<li>
								<span class="state">{{ mailData.evidStatusDesc }}</span>
							</li>
						</ul>
						<ul style="margin-right: 20px">
							<li><span>订单总额</span></li>
							<li>
								<span class="money">￥{{ countCost }}</span>
							</li>
						</ul>
						<el-button class="btn" @click="offlinePayment">
							<span>线下支付</span>
						</el-button>
					</div>
				</div>
				<!-- 待公证处寄函 -->
				<div v-if="mailData.evidStatus == 6" class="order-status-main">
					<div class="statu-content">
						<ul>
							<li><span>状态</span></li>
							<li>
								<span class="state">{{ mailData.evidStatusDesc }}</span>
							</li>
						</ul>
						<ul>
							<li><span>订单总额</span></li>
							<li>
								<span class="money">￥{{ countCost }}</span>
							</li>
						</ul>
						<el-button class="btn" @click="fun">
							<span>寄函</span>
						</el-button>
					</div>
				</div>
				<!-- 已经寄函 -->
				<div v-if="mailData.evidStatus == 7 || mailData.evidStatus == 601" class="order-status-main">
					<div class="statu-content">
						<ul>
							<li><span>状态</span></li>
							<li>
								<span class="state">{{ mailData.evidStatusDesc }}</span>
							</li>
						</ul>
						<ul>
							<li><span>订单总额</span></li>
							<li>
								<span class="money">￥{{ countCost }}</span>
							</li>
						</ul>
						<el-button :disabled="mailData.evidStatus === 7 ? true : false" class="btn cancel_btn"
							@click="cancelSentItem(6)">
							<span>取消寄件</span>
						</el-button>
						<el-button class="btn upload_btn" @click="handleComfirmRreceivedReceived('2071')">
							<span>上传寄函照片</span>
						</el-button>
					</div>
				</div>

				<!-- 确认签收结果 -->
				<div v-if="mailData.evidStatus == 701" class="order-status-main">
					<div class="statu-content">
						<ul>
							<li><span>状态</span></li>
							<li>
								<span class="state">{{ mailData.evidStatusDesc }}</span>
							</li>
						</ul>
						<ul>
							<li><span>订单总额</span></li>
							<li>
								<span class="money">￥{{ countCost }}</span>
							</li>
						</ul>
						<el-button class="btn" @click="handleComrifmSigned()">
							<span>确认签收结果</span>
						</el-button>
					</div>
				</div>

				<!-- 已存证 -->
				<div v-if="mailData.evidStatus == 10" class="order-status-main">
					<div class="statu-content">
						<ul>
							<li><span>状态</span></li>
							<li>
								<span class="state">{{ mailData.evidStatusDesc }}</span>
							</li>
						</ul>
						<ul style="margin-right: 20px">
							<li><span>订单总额</span></li>
							<li>
								<span class="money">￥{{ countCost }}</span>
							</li>
						</ul>
						<el-button class="btn" @click="handleSendBack">
							<span>回寄退件</span>
						</el-button>
					</div>
				</div>
				<!-- 拒绝办理 -->
				<div v-if="mailData.evidStatus == 8" class="order-status-main">
					<div class="reason-main">
						<div class="reason-text">拒绝原因：{{ mailData.remark }}</div>
						<div class="statu-content">
							<ul>
								<li><span>状态</span></li>
								<li>
									<span class="state">{{ mailData.evidStatusDesc }}</span>
								</li>
							</ul>
							<ul style="margin-right: 20px">
								<li><span>订单总额</span></li>
								<li>
									<span class="money">￥{{ countCost }}</span>
								</li>
							</ul>
							<el-button class="btn" @click="handleSendBack">
								<span>回寄文件</span>
							</el-button>
						</div>
					</div>
				</div>

				<div v-if="mailData.evidStatus == 9" class="order-status-main">
					<div class="reason-main">
						<div class="reason-text">撤销原因：用户主动撤销</div>
						<div class="statu-content">
							<ul>
								<li><span>状态</span></li>
								<li>
									<span class="state">{{ mailData.evidStatusDesc }}</span>
								</li>
							</ul>
							<ul style="margin-right: 20px">
								<li><span>订单总额</span></li>
								<li>
									<span class="money">￥{{ countCost }}</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="info-dialog">
			<el-dialog title="证据文件详情" :visible.sync="dialogVisible" width="1200px" top="5vh"
				:close-on-click-modal="false">
				<div>
					<evidenceDocumentDetails v-if="dialogVisible" :data="infoData" :evid-id="evidId"
						@staChange="staChange" />
				</div>
				<div class="inner-layer-pop-up-layer">
					<el-dialog width="40%" title="提取证据" :visible.sync="innerVisible" :close-on-click-modal="false"
						custom-class="inner-layer-pop-up-layer" append-to-body>
						<fileCheck v-if="innerVisible" :mater-list="materList" :evid-id="evidId"
							@statusChange="statusChange" />
						<span slot="footer" class="dialog-footer">
							<el-button v-if="status!==2" @click="innerVisible = false">取 消</el-button>
							<el-button v-if="status===2" type="primary" @click="innerVisible = false">好 的</el-button>
							<el-button v-if="status===1" type="primary" @click="extractionImmediately(1)">立即提取
							</el-button>
						</span>
					</el-dialog>
				</div>
			</el-dialog>
		</div>
		<el-dialog width="50%" title="提取证据" :visible.sync="extractionEvidence" custom-class="inner-layer-pop-up-layer"
			:close-on-click-modal="false">
			<div class="file-check-assembly">
				<fileCheck v-if="extractionEvidence" :mater-list="materList" :evid-id="evidId"
					@statusChange="statusChange" />
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button v-if="status!==2" @click="extractionEvidence = false">取 消</el-button>
				<el-button v-if="status===1" type="primary" @click="extractionImmediately(2)">立即提取</el-button>
				<el-button v-if="status===2" type="primary" @click="extractionEvidence = false">好 的</el-button>
			</span>
		</el-dialog>
		<el-dialog width="800px" title="取证账号" :visible.sync="accountNumber" custom-class="inner-layer-pop-up-layer"
			:close-on-click-modal="false">
			<div class="file-check-assembly">
				<accountNumber v-if="accountNumber" :account-id="accountId" />
			</div>
		</el-dialog>
		<router-view />
	</div>
</template>

<script>
import Clipboard from 'clipboard'
import {
	getCloudDateil,
	getCloudMailDateil,
	getCloudAccountInfo,
	getCloudPersonInfo,
	getEvidMaterialList,
	getLogisticsList,
	getLogisticsDateil,
	getLogisticsDateil2,
	downloadEntry,
	submitEditCost,
	getCostInfo, cancelSentStem,
	modifyCostInformation
} from '../../api/cloudMail'
import evidenceDocumentDetails from '../../components/entryTab/evidenceDocumentDetails'
import fileCheck from '../../components/entryTab/fileCheck'
import accountNumber from '../../components/entryTab/accountInformation'
// import { printInit, print } from '../../utils/entryPrint'
import { printInit, print } from '../../utils/printExpressList';
import {
  packagePrint,
} from '../../api/logisticsManage';
import { filterCardType } from '@/filters/index'
export default {
	components: {
		evidenceDocumentDetails,
		fileCheck,
		accountNumber
	},
	filters: {
		filterCardType,
		modeService(val) {
			var str = ''
			if (val === 1) {
				str = '自寄送达存证'
			} else if (val === 2) {
				str = '公证邮寄送达存证'
			}
			return str
		},
		theWay(val) {
			var str = ''
			if (val === 1) {
				str = '自寄函件'
			} else if (val === 2) {
				str = '公证处代寄打印件'
			} else {
				str = '公证处代寄原件'
			}
			return str
		}
	},
	data() {
		return {
			canYouPrint: true,
			dialogVisible: false,
			innerVisible: false,
			extractionEvidence: false,
			accountNumber: false,
			accountId: '',
			infoData: {},
			evidId: '',
			status: 0,
			materList: [],
			tostDialog: false,
			tostData: {
				quantity: '',
				legalTost: '',
				saveTost: '',
				total: ''
			},
			activities: [],
			listActive: 0,
			id: '',
			url: '',
			entryData: {},
			mailData: {},
			accountData: [],
			personData: [],
			costData: [],
			materialListData: [],
			getLogisticsData: [],
			statu: 10,
			rotueState: true,
			unfold: false,
			tableData: [],
			activeName: 'first',
			refusedAcceptDialogVisible: false,
			refusedAcceptData: { cause: '' },
			refusedAcceptRules: {
				cause: [
					{ required: true, message: '请填写拒绝原因', trigger: 'blur' },
					{ min: 1, max: 120, message: '至多允许输入120个字', trigger: 'blur' }
				]
			},
			evidMailId: '',
			countCost: '',
			mailEvidMaterialDTOList: [],
			mailEvidExpressInfoId: null,
			total: 0,
			page: 1,
			size: 10,
			listActiveItem: "",
		}
	},
	watch: {
		// 路由监听：监听路由的变化，从而做出相应操作
		$route: {
			immediate: true, // 一旦监听到路由的变化立即执行
			handler(to, from) {
				// 回调函数，两个参数，to：当前的组件，from：上一个组件
				if (to.name !== 'entryDetail') {
					this.rotueState = false
				}
			}
		},
		extractionEvidence: {
			handler: function (val) {
				console.log(val)
				if (!val) {
					this.status = 0
				}
			}
		},
		innerVisible: {
			handler: function (val) {
				if (!val) {
					this.status = 0
				}
			}
		}
	},
	created() {
		// console.log(this.$route);
		// if (this.$route.query.id) {
		//   this.id = this.$route.query.id;
		// } else {
		//   this.id = sessionStorage.getItem("entryId");
		//   var url = `/#${this.$route.path}?id=${this.id}`;
		//   history.pushState(null, null, url);
		// }
		this.id = sessionStorage.getItem('entryId')
		if (this.$route.name === 'entryDetail') {
			this.InitializationPage()
			// getEvidJurisdiction({ evidId: this.id }).then((res) => {
			//   // console.log(res, '查看是否有操作权限')
			// })
		}
	},
	methods: {
		// 回寄退件
		handleSendBack() {
			this.$router.push({
				name: "entryMail",
				query: {
					type: "back",
					eMId: this.evidMailId
				}
			})
		},

		// 确认签收结果
		handleComrifmSigned() {
			this.$router.push({
				name: "comrifmSignReceive",
				query: {
					// materialCode: val,
					id: this.id,
					evidId: this.mailData.id,
					evidMailId: this.evidMailId
					// mailType: this.mailData.mailType,
					// isPayment: this.mailData.isPayment,
					// legalServiceCost: this.tostData.legalTost,
					// evidStatus: val,
					// cost: this.mailData.cost,
					// remark: this.refusedAcceptData.cause
				}
			})
		},

		// 确认收件
		handleComfirmRreceivedReceived(val) {
			this.$router.push({
				name: "uploadImage",
				query: {
					materialCode: val,
					id: this.id,
					evidId: this.mailData.id,
					evidMailId: this.evidMailId
					// mailType: this.mailData.mailType,
					// isPayment: this.mailData.isPayment,
					// legalServiceCost: this.tostData.legalTost,
					// evidStatus: val,
					// cost: this.mailData.cost,
					// remark: this.refusedAcceptData.cause
				}
			})
		},

		handlePageChange(val) {
			getCloudPersonInfo({ evidId: this.id, pageNum: val, pageSize: this.size }).then((res) => {
				console.log(res, '2222')
				this.personData = res.data.list
				this.total = res.data.total
			})
		},
		staChange(val) {
			console.log(val)
			this.innerVisible = val
		},
		statusChange(val) {
			this.status = val
		},
		// 初始化页面渲染的数据
		InitializationPage() {
			var data = { evidId: this.id }
			getCloudDateil(data).then((res) => {
				console.log(res, '获取详情基本信息')
				if (res.success && res.data !== null) {
					this.entryData = res.data
					getCloudMailDateil(data).then((res) => {
						console.log(res, '0000')
						this.evidMailId = res.data.id

						this.mailData = res.data
						getCloudAccountInfo(data).then((res) => {
							console.log(res, '1111')
							this.accountData.push(res.data)
							this.accountId = res.data.id
							getCloudPersonInfo({ evidId: this.id, pageNum: this.page, pageSize: this.size }).then((res) => {
								console.log(res, '2222')
								this.personData = res.data.list
								this.total = res.data.total
								// console.log(this.mailData.id)
								getCostInfo({ evidMailId: this.mailData.id }).then((res) => {
									console.log(res, '3333')
									res.data.type = this.mailData.mailTypeDesc
									this.costData.push(res.data)
									this.countCost = this.costData[0].countCost
									console.log(this.countCost)
								})
							})
						})
					})
				} else {
					this.entryData = {}
				}
			})
		},
		fun() {
			this.$router.push({
				name: 'entryMail',
				query: {
					eMId: this.evidMailId
				}
			})
		},
		// 提取枕骨压缩包
		extractEntry(val) {
			console.log(val)
			this.$axios(`org/mailOrder-evid-details/${val.id}`).then(res => {
				console.log(res)
				if (res.success) {
					for (let i = 0; i < res.data.mailEvidMaterialDTOS.length; i++) {
						res.data.mailEvidMaterialDTOS[i].materialBucket = JSON.parse(res.data.mailEvidMaterialDTOS[i].materialBucket)
						res.data.mailEvidMaterialDTOS[i].fileBucket = res.data.mailEvidMaterialDTOS[i].materialBucket
					}
					this.materList = res.data.mailEvidMaterialDTOS
					this.infoData = res.data
					this.evidId = val.id// val.evidId
					this.dialogVisible = true
				}
			})
		},
		extractionImmediately(val) {
			var time = new Date()
			downloadEntry({ evidId: this.materialListData[0].id, fileType: 3 }).then((res) => {
				this.saveAs(
					res,
					`${this.entryData.evidNo}${this.getTime(time)}.zip`
				)
				val === 1 ? this.innerVisible = false : this.extractionEvidence = false
			})
		},
		expandDetail(val) {
			this.mailEvidMaterialDTOList = this.materialListData[0].mailEvidMaterialDTOList
			this.unfold = true
		},
		extractingAllEvidence() {
			this.extractEntry(this.materialListData[0].id)
		},
		// 获取当前时间，用来提取证据命名使用
		getTime(val) {
			var date = new Date(val)
			const y = date.getFullYear()
			let MM = date.getMonth() + 1
			MM = MM < 10 ? '0' + MM : MM
			let d = date.getDate()
			d = d < 10 ? '0' + d : d
			let h = date.getHours()
			h = h < 10 ? '0' + h : h
			let m = date.getMinutes()
			m = m < 10 ? '0' + m : m
			let s = date.getSeconds()
			s = s < 10 ? '0' + s : s
			return y + MM + d + h + m + s
		},
		// 使用axios发起请求的下载
		saveAs(blob, fileName) {
			if (window.navigator.msSaveOrOpenBlob) {
				navigator.msSaveBlob(blob, fileName)
			} else {
				const link = document.createElement('a')
				const body = document.querySelector('body')

				link.href = window.URL.createObjectURL(blob) // 创建对象url
				link.download = fileName

				// fix Firefox
				link.style.display = 'none'
				body.appendChild(link)

				link.click()
				body.removeChild(link)

				window.URL.revokeObjectURL(link.href) // 通过调用 URL.createObjectURL() 创建的 URL 对象
			}
		},
		// 复制证据编号
		copyNum() {
			// var btn = document.querySelector();
			// console.log(btn);
			this.copy('.copy-order-num')
		},
		// 点击编辑费用后表单展示的内容
		compileCost() {
			this.tostData.quantity = this.costData[0].witnessNum
			this.tostData.legalTost = this.costData[0].legalServiceCost
			this.tostData.saveTost = this.costData[0].witnessCost
			this.tostData.total = this.costData[0].countCost
			this.tostData.total = parseFloat(this.tostData.total).toFixed(2)
			this.tostDialog = true
		},
		// 修改状态
		submitCost(val) {
			var data = {
				id: this.mailData.id,
				mailType: this.mailData.mailType,
				isPayment: this.mailData.isPayment,
				legalServiceCost: this.tostData.legalTost,
				evidStatus: val,
				cost: this.mailData.cost,
				remark: this.refusedAcceptData.cause
			}
			// console.log(this.evidMailId)
			submitEditCost(data).then((res) => {
				// console.log(res, '修改状态')
				this.$message({
					type: 'success',
					message: '操作成功!'
				})
				this.refusedAcceptDialogVisible = false
				this.tostDialog = false
				this.$router.go(0)
			})
		},
		// 线下支付按钮
		offlinePayment() {
			this.$confirm('确认变更为线下支付？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					var data = {
						id: this.mailData.id,
						mailType: this.mailData.mailType,
						isPayment: 1,
						legalServiceCost: this.tostData.legalTost,
						evidStatus: 6,
						cost: this.mailData.cost,
						remark: this.refusedAcceptData.cause
					}
					console.log(this.mailData)
					submitEditCost(data).then((res) => {
						// console.log(res, '修改状态')
						this.$message({
							type: 'success',
							message: '操作成功!'
						})
						this.refusedAcceptDialogVisible = false
						this.tostDialog = false
						this.$router.go(0)
					})
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消操作'
					})
				})
		},
		// 复制支付编号
		copyPayNum(val) {
			this.copy('.copy-pay-num')
		},
		// 点击复制按钮复制文字
		copy(val) {
			// eslint-disable-next-line no-undef
			const clipboard = new Clipboard(val) // 这里括号里填写上面点击事件绑定的class名
			// console.log(clipboard);
			clipboard.on('success', (e) => {
				// 复制成功，提示根据自己项目实际使用的UI来写
				this.$message({
					showClose: true,
					message: '复制成功',
					type: 'success',
					duration: 2000
				})
				// 释放内存
				clipboard.destroy()
			})
			clipboard.on('error', (e) => {
				// 不支持复制，提示根据自己项目实际使用的UI来写
				// 释放内存
				clipboard.destroy()
			})
		},
		// 取消寄件
		cancelSentItem(val) {
			const h = this.$createElement
			this.$msgbox({
				title: '提示',
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				message: h('p', null, [
					h('p', null, '确认取消寄件？'),
					h('span', { style: 'color: #E6A23C' }, '取消寄件，所有快递将被取消，需重新寄函！确定取消吗？')
				])
			})
				.then(() => {
					cancelSentStem({ evidMailId: this.evidMailId }).then(res => {
						this.$router.go(0)
					})
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消操作'
					})
				})
		},
		// 物流信息中，点击不同的物流展示不同的信息
		changeActive(index, item) {
			this.listActive = index
			this.listActiveItem = item
			console.log(item)
			this.canYouPrint = item.orgSend === 1
			this.mailEvidExpressInfoId = item.id
			if (item.expressInfoId) {
				getLogisticsDateil2({ tempOrderNo: item.expressInfoId }).then((res) => {
					console.log(res, '物流信息')
					res.data[0].color = '#0bbd87'
					this.activities = res.data
				})
				return
			}
			getLogisticsDateil({ tempOrderNo: item.tempOrderNo }).then((res) => {
				console.log(res, '物流信息')
				res.data[0].color = '#0bbd87'
				this.activities = res.data
			})
		},
		// 刷新物流
		handleRefreshLogistics() {
			if (this.listActiveItem.expressInfoId) {
				getLogisticsDateil2({ tempOrderNo: item.expressInfoId }).then((res) => {
					console.log(res, '物流信息')
					res.data[0].color = '#0bbd87'
					this.activities = res.data
				})
				return
			}
			getLogisticsDateil({ tempOrderNo: this.listActiveItem.tempOrderNo }).then((res) => {
				console.log(res, '物流信息')
				res.data[0].color = '#0bbd87'
				this.activities = res.data
			})
		},
		// 切换选项卡
		handleClick(tab) {
			// console.log(tab)
			if (tab === 'second') {
				this.materialListData = []
				getEvidMaterialList({ evidId: this.id }).then((res) => {
					this.materialListData.push(res.data)
					if (this.materialListData[0].mailEvidMaterialDTOList !== null) {
						for (
							let index = 0;
							index < this.materialListData[0].mailEvidMaterialDTOList.length;
							index++
						) {
							if (
								this.materialListData[0].mailEvidMaterialDTOList[index]
									.materialBucket !== null &&
								this.materialListData[0].mailEvidMaterialDTOList[index] !== null
							) {
								this.materialListData[0].mailEvidMaterialDTOList[
									index
									// eslint-disable-next-line no-eval
								].materialBucket = eval(
									'(' +
									this.materialListData[0].mailEvidMaterialDTOList[index]
										.materialBucket +
									')'
								)
							}
						}
					}
					console.log(this.materialListData, '4444')
				})
			} else if (tab === 'third') {
				getLogisticsList({ evidId: this.id }).then((res) => {
					console.log(res, '555')
					this.getLogisticsData = res.data
					this.listActiveItem = res.data[0]
					this.canYouPrint = res.data[0].orgSend === 1
					this.mailEvidExpressInfoId = res.data[0].id
					// console.log(this.mailEvidExpressInfoId)
					if (res.data[0].expressInfoId) {	// 新系统接口
						getLogisticsDateil2({ tempOrderNo: res.data[0].expressInfoId }).then((res) => {
							console.log(res, '物流信息')
							res.data[0].color = '#0bbd87'
							this.activities = res.data
						})
						return
					}
					getLogisticsDateil({	// 旧系统接口
						tempOrderNo: res.data[0].tempOrderNo
					}).then((res) => {
						console.log(res, '物流信息')
						res.data[0].color = '#0bbd87'
						this.activities = res.data
					})
				})
			}
		},
		unfoldChange(val) {
			console.log(val)
			for (let i = 0; i < val.mailEvidMaterialDTOList.length; i++) {
				val.mailEvidMaterialDTOList[i].fileBucket = val.mailEvidMaterialDTOList[i].materialBucket
			}
			this.materList = val.mailEvidMaterialDTOList !== null ? val.mailEvidMaterialDTOList : []
			this.evidId = val.id// '1371379304229560322'
			this.extractionEvidence = true
			// this.mailEvidMaterialDTOList = this.materialListData[0].mailEvidMaterialDTOList
			// // console.log(this.mailEvidMaterialDTOList)
			// this.unfold = true
		},
		packUp() {
			this.mailEvidMaterialDTOList = []
			this.unfold = false
		},
		// 确认收货
		openPop(val) {
			const h = this.$createElement
			this.$msgbox({
				title: '提示',
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				message: h('p', null, [
					h('p', null, '确定收到用户寄送的文件原件？'),
					h('span', { style: 'color: #E6A23C' }, '确认收件后，需寄送原件。')
				])
			})
				.then(() => {
					this.submitCost(val)
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消操作'
					})
				})
		},
		// 通过审核
		getApproved(val) {
			// console.log(val)
			this.$confirm('确认审核通过该申请？', '', {
				confirmButtonText: '确定',
				cancelButtonText: '取消'
			})
				.then(() => {
					this.submitCost(val)
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消操作'
					})
				})
		},
		// 拒绝受理
		refusedAccept() {
			this.refusedAcceptDialogVisible = true
		},
		// 拒绝受理提交
		refusedAcceptSubmit() {
			this.$refs['refusedAcceptDialog'].validate((valid, obj) => {
				if (valid) {
					console.log(valid)
					var val = 8
					this.submitCost(val)
				}
			})
		},
		sendLetter() { },
		modifyCost() {
			var data = {
				id: this.costData[0].id,
				legalServiceCost: this.tostData.legalTost,
				witnessCost: this.tostData.saveTost,
				evidMailId: this.mailData.id,
				witnessNum: this.tostData.quantity
			}
			modifyCostInformation(data).then((res) => {
				console.log(res, '修改费用信息')
				if (res.success) {
					this.$router.go(0)
				}
			})
		},
		realTimeComputing() {
			// console.log('00000')
			if (this.tostData.legalTost === '') {
				this.tostData.total =
					parseInt(this.tostData.quantity) * parseFloat(this.tostData.saveTost)
				this.tostData.total = parseFloat(this.tostData.total).toFixed(2)
			} else {
				this.tostData.legalTost = this.tostData.legalTost
					.replace(/^\.+|[^\d.]/g, '')
					.replace(/\.{2,}/g, '')
					.replace('.', '$#$')
					.replace(/\./g, '')
					.replace('$#$', '.')
				if (this.tostData.legalTost.indexOf('.') > 0) {
					this.tostData.legalTost = this.tostData.legalTost
						.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
						.slice(0, 13)
					if (this.tostData.legalTost.indexOf('.') > 10) {
						this.tostData.legalTost = this.tostData.legalTost.substring(
							0,
							this.tostData.legalTost.length - 3
						)
					}
				} else {
					this.tostData.legalTost = this.tostData.legalTost
						.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
						.slice(0, 10)
				}

				this.tostData.total =
					parseInt(this.tostData.quantity) * parseInt(this.tostData.saveTost) +
					parseInt(this.tostData.quantity) *
					parseFloat(this.tostData.legalTost)
				this.tostData.total = parseFloat(this.tostData.total).toFixed(2)
			}
		},
		viewAccountInformation(val) {
			// this.evidId = this.entryData.id
			this.accountNumber = true
		},
		goBack() {
			this.$router.push({ name: 'entryList' })
		},
		// async printingMat() {
		// 	// console.log(null + '000')
		// 	const p = { evidId: sessionStorage.getItem('entryId'), mailEvidExpressInfoId: this.mailEvidExpressInfoId }
		// 	const status = await printInit(2, p)
		// 	if (status) {
		// 		setTimeout(() => {
		// 			print()
		// 		}, 1000)
		// 		// console.log(status)
		// 	}
		// }
    // 打印面单
    async handlePrint() {
      let res = await packagePrint(this.listActiveItem.expressInfoId)
      console.log("打印面单", res);

      if (res.success && res.data) {
        let flag = await printInit(res)
        flag && print()
        return
      }

      this.$message({
        message: "打印失败，请稍后再试！",
        type: "error"
      })
    },
	}
}
</script>

<style lang="less" scoped>
.mar_right {
	margin-right: 30px;
}
.cancel_btn {
	background: #d9001b !important;
	color: #fff;
	font-size: 20px !important;
}
.upload_btn {
	margin-left: 0 !important;
}
ul {
	margin: 0;
	padding: 0;
	li {
		list-style: none;
	}
}
/deep/ .el-table--border:after,
/deep/ .el-table--group:after,
/deep/ .el-table:before {
	background-color: #eee;
}
/deep/ .el-table--border,
/deep/ .el-table--group {
	border-color: #eee;
}
/deep/ .el-table td,
/deep/ .el-table th.is-leaf {
	border-bottom: 1px solid #eee;
}
/deep/ .el-table--border th,
/deep/ .el-table--border th.gutter:last-of-type {
	border-bottom: 1px solid red;
}
/deep/ .el-table--border td,
/deep/ .el-table--border th {
	border-right: none;
}
.entry-mail-detail-mian {
	background: #f5f5f5;
	min-height: calc(100vh - 50px);
	padding: 20px;
	color: #333;
	font-size: 14px;
	position: relative;
	h3 {
		margin: 0;
		padding: 20px 0;
		display: flex;
		align-items: center;
		.el-icon-s-claim,
		.el-icon-s-shop {
			color: #409eff;
			margin-right: 5px;
			font-size: 26px;
		}
	}
	.total {
		display: flex;
		justify-content: flex-end;
		border-bottom: solid 1px #eee;
		border-left: solid 1px #eee;
		border-right: solid 1px #eee;
		h5 {
			width: 40%;
			font-size: 14px;
			span {
				padding-left: 20px;
				color: yellowgreen;
			}
		}
	}
	.content-list-mian {
		margin-bottom: 80px;
		// position: relative;
		.account-information {
			margin: 20px 0;
			.el-table {
				color: #333;
			}
		}
		.evidence-info {
			background: #fff;
			padding: 0 20px;
			padding-bottom: 20px;
			.tab-main {
				padding-top: 10px;
			}
			ul li {
				display: flex;
				span {
					display: block;
					line-height: 20px;
				}
				.title {
					width: 100px;
					text-align: right;
				}
			}
			.evidence-info-list {
				display: flex;
				.basic-information {
					width: 30%;
				}
			}
			.time-information {
				width: 40%;
			}
			.status-information {
				flex: 1;
				li {
					span {
						text-align: left;
					}
				}
			}
		}
	}
	.order-status-main {
		border-top: #e4e7ed solid 1px;
		position: absolute;
		bottom: 0;
		left: 0;
		height: 80px;
		width: calc(100% - 40px);
		margin: 0 20px;
		background: #fff;
		z-index: 99;
		.reason-main {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 100%;
			.reason-text {
				padding-left: 30px;
			}
		}
		.statu-content {
			display: flex;
			justify-content: flex-end;
			height: 100%;
			align-items: center;
			ul {
				width: 100px;
				li {
					span {
						display: block;
						width: 100%;
						text-align: right;
						font-size: 16px;
						line-height: 20px;
					}
				}
			}
			.btn {
				height: 100%;
				background: #409eff;
				width: 180px;
				margin-left: 20px;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 0;
				border: none;
				span {
					font-size: 16px;
					color: #fff;
				}
			}
		}
	}
	.logistics-information {
		width: 100%;
		.info-length {
			display: flex;
		}

		.empty {
			span {
				display: flex;
				justify-content: center;
				align-items: center;
				h5 {
					margin: 0;
					font-size: 14px;
				}
				i {
					font-size: 18px;
					margin-right: 5px;
				}
			}
			padding: 50px 0;
		}
		.logistics-list-main {
			.logistics-list {
				padding: 20px;
				margin-bottom: 20px;
				width: 300px;
				cursor: pointer;
				border-left: solid #666 1px;
				p {
					margin: 0;
					line-height: 18px;
				}
			}
			.logistics-list-active {
				background: #e6f6fe;
			}
		}
		.time-line-mian {
			margin-left: 30px;
			padding-top: 10px;
			border-left: solid #eee 1px;
			padding-left: 30px;
		}
	}
	.unfold-dateail {
		border-bottom: solid #eee 1px;
		border-left: solid #eee 1px;
		border-right: solid #eee 1px;
		padding: 10px 0;
		display: flex;
		.file-list {
			flex: 1;
			ul {
				display: flex;
				flex-wrap: wrap;
				padding-left: 50px;
				li {
					width: 50%;
					color: #409eff;
				}
			}
		}
		.pack-up {
			width: 200px;
			text-align: center;
			.el-button--text {
				padding: 0;
			}
		}
	}

	/deep/ .el-dialog__body {
		border-top: solid #eee 1px;
		border-bottom: solid 1px #eee;
		padding: 30px 60px;
		/deep/ .el-form-item__label {
			line-height: 20px;
		}
	}
	/deep/ .el-dialog__footer {
		padding-top: 20px;
	}
	.stress {
		justify-content: flex-start;
		align-items: flex-start;
		padding: 10px 0;
		.title {
			line-height: 14px !important;
		}
		.stress-text {
			font-size: 20px;
			color: yellowgreen;
			font-weight: bold;
		}
	}
	.compile-tost {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.tost-dialog-main {
		/deep/ .el-dialog__body {
			display: flex;
			justify-content: center;
		}
		.el-form {
			width: 60%;
			.cost-dialog-form-title {
				padding: 20px 0;
				span {
					font-size: 16px !important;
					font-weight: bolder !important;
				}
				.cost-dialog-form-title-text {
					position: relative;
				}
				.cost-dialog-form-title-text::before {
					content: "";
					position: absolute;
					left: -10px;
					top: -1px;
					width: 3px;
					height: 19px;
					background: #1989fa;
					opacity: 1;
				}
			}
		}
		/deep/ .el-form-item {
			display: flex;
			/dee/ .el-form-item__label {
				white-space: nowrap !important;
			}
			label {
				display: flex;
				align-items: center;
				justify-content: flex-end;
			}
		}
		/deep/ .el-form-item__content {
			margin-left: 0 !important;
			flex: 1;
		}
	}
}
.instrument-evidence {
	.btn {
		display: flex;
		justify-content: flex-end;
	}
}
.state {
	color: #f96a00;
	font-weight: bolder;
}
.money {
	color: #409eff;
	font-weight: bolder;
}
/deep/ .el-tabs__item {
	font-size: 14px;
}
.go-back-btn {
	position: absolute;
	right: 40px;
	top: 40px;
}
.info-dialog {
	/deep/ .el-dialog__body {
		background: #f5f5f5;
	}
}
.reject {
	.el-form-item {
		display: flex;
		/deep/ .el-form-item__content {
			flex: 1;
			margin-left: 0 !important;
		}
	}
}
.time-line-mian {
	flex: 1;
	display: flex;
	justify-content: space-between;
}
</style>
