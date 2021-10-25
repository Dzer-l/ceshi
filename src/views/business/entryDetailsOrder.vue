<template>
	<div class="entry-dateail-mian">
		<router-view />
		<div v-if="mainStatu" class="entry-dateail">
			<div class="go-back-btn">
				<el-button type="primary" size="small" style="width:80px" @click="goBack">返回</el-button>
			</div>
			<div class="basic-order-information">
				<h3>
					<i class="el-icon-s-order" style="color: #409eff; padding-right: 5px" />
					订单编号:{{ basicData.orderNum }}
					<el-button type="text" style="padding: 0 20px" class="copy-order-num" :disabled="jurisdiction"
						:data-clipboard-text="basicData.orderNum" @click="copyNum">复制</el-button>
					<span v-if="basicData.prodCode==='ysf'"
						style="padding-left:20px;border-left:solid 1px #999">合同状态：</span>
					<span class="contract_status">{{ contractStatus }}</span>
				</h3>
				<div class="basic-order-information-list">
					<ul>
						<li>
							<span class="info-title">用户账号：</span>
							<span>{{ basicData.prodCode==='ysf'?'-':basicData.userAccount }}</span>
							<el-button v-if="basicData.prodCode!=='ysf'" type="text" style="padding: 0 20px"
								@click="checkAccountInfo">查看</el-button>
						</li>
						<li>
							<span class="info-title">业务类型：</span>
							<span>{{ basicData.prodName }}</span>
						</li>
						<li>
							<span class="info-title">公证处：</span>
							<span>{{ basicData.orgName }}</span>
						</li>
						<li>
							<span class="info-title">提交时间：</span>
							<span>{{ basicData.createTime }}</span>
						</li>
						<li>
							<span class="info-title">审核时间：</span>
							<span>{{ basicData.auditTime }}</span>
						</li>
					</ul>
					<ul>
						<li>
							<span class="info-title">支付时间：</span>
							<span>{{ basicData.paymentTime }}</span>
						</li>
						<li>
							<span class="info-title">支付编号：</span>
							<span>{{ basicData.payNum }}</span>
							<el-button type="text" style="padding: 0 20px" class="copy-pay-num" :disabled="jurisdiction"
								:data-clipboard-text="basicData.payNum" @click="copyPayNum">复制</el-button>
						</li>
						<li>
							<span class="info-title">出证时间：</span>
							<span>{{ basicData.issuingTime }}</span>
						</li>
						<li>
							<span class="info-title">完成时间：</span>
							<span>{{ basicData.finishTime }}</span>
						</li>
					</ul>
					<ul :class="basicData.orderStatus == 305 ? 'move-up' : ''">
						<li>
							<span class="info-title" style="text-align: left">订单状态：</span>
							<span class="stress-text">{{
                basicData.orderStatus | orderState
              }}</span>
						</li>
						<li>
							<span v-if="basicData.orderStatus === 201">请在审核通过前完成订单信息的<br>修改（包括申请信息，申请材料
								<br>签署材料，费用信息）</span>
							<span v-if="basicData.orderStatus === 202">等待用户补充材料</span>
							<span v-if="basicData.orderStatus === 2 && basicData.prodCode == 'rfcw' ">
								请在审核通过前完成订单信息的<br>修改（包括申请信息，申请材料签署材料，费用信息）
							</span>
							<span v-if="basicData.orderStatus === 2 && basicData.prodCode == 'ysf' ">
								当前待公积金中心审核合同，审核完<br>成后将回传合同信息
							</span>
						</li>
						<li>
							<span class="info-title" style="text-align: left">总费用：</span>
							<span class="stress-text">{{ basicData.totalCost }}</span>
						</li>
					</ul>
				</div>
			</div>
			<!-- 点击查看账号信息 -->
			<div v-if="accountDialogVisible" class="account-dialog-main">
				<el-dialog title="用户账号信息" :visible.sync="accountDialogVisible" width="700px"
					:close-on-click-modal="false">
					<!-- 个人账号信息 -->
					<div v-if="accountData.userType === 1" class="account-dialog">
						<ul>
							<li>
								<span class="accpunt-dislog-list-title">用户名：</span>
								<span>{{ accountData.userAccount }}</span>
							</li>
							<li>
								<span class="accpunt-dislog-list-title">注册时间：</span>
								<span>{{ accountData.registerTime }}</span>
							</li>
							<li>
								<span class="accpunt-dislog-list-title">实名状态：</span>
								<span>{{
                  accountData.isRealName == 0 ? "未实名" : "已实名"
                }}</span>
							</li>
							<li>
								<span class="accpunt-dislog-list-title">证件类型：</span>
								<span>{{ accountData.cardType|filterCardType }}</span>
							</li>
							<li>
								<span class="accpunt-dislog-list-title">性别：</span>
								<span>{{ accountData.gender == 1 ? "男" : "女" }}</span>
							</li>
							<li>
								<span class="accpunt-dislog-list-title">出生日期：</span>
								<span>{{ accountData.userInfoDTO.birth }}</span>
							</li>
						</ul>
						<ul>
							<li>
								<span class="accpunt-dislog-list-title">用户类型：</span>
								<span>{{ accountData.userType | userType }}</span>
							</li>
							<li>
								<span class="accpunt-dislog-list-title">注册公证处：</span>
								<span>{{ accountData.orgName }}</span>
							</li>
							<li>
								<span class="accpunt-dislog-list-title">姓名：</span>
								<span>{{ accountData.userInfoDTO.userName }}</span>
							</li>
							<li>
								<span class="accpunt-dislog-list-title">证件号码：</span>
								<span>{{ accountData.userInfoDTO.cardNum }}</span>
							</li>
							<li>
								<span class="accpunt-dislog-list-title">手机号码：</span>
								<span>{{ accountData.userInfoDTO.mobile===null?accountData.mobile:accountData.userInfoDTO.mobile }}</span>
							</li>
							<li>
								<span class="accpunt-dislog-list-title">所在地区：</span>
								<span>{{ accountData.userInfoDTO.permanentAddress }}</span>
							</li>
						</ul>
					</div>
					<!-- 企业主账号信息 -->
					<div v-if="accountData.userType === 2">
						<div class="account-dialog">
							<ul style="display: flex;flex-wrap:wrap" class="privy-info-list">
								<li>
									<span class="accpunt-dislog-list-title">用户名：</span>
									<span>{{ accountData.userAccount }}</span>
								</li>
								<li>
									<span class="accpunt-dislog-list-title">用户类型：</span>
									<span>{{ accountData.userType | userType }}</span>
								</li>
								<li>
									<span class="accpunt-dislog-list-title">注册时间：</span>
									<span>{{ accountData.registerTime }}</span>
								</li>
								<li>
									<span class="accpunt-dislog-list-title">注册公证处：</span>
									<span>{{ accountData.orgName }}</span>
								</li>
								<li>
									<span class="accpunt-dislog-list-title">账号类型：</span>
									<span>{{
                    accountData.parentAccount == null ||
                      accountData.parentAccount == 0
                      ? "主账号"
                      : "子账号"
                  }}</span>
								</li>
								<li v-if=" parseInt(accountData.parentId)!==0&&accountData.parentId!==null ">
									<span class="accpunt-dislog-list-title">主账号：</span>
									<span>{{ accountData.parentAccount }}</span>
								</li>
								<li>
									<span class="accpunt-dislog-list-title">实名状态：</span>
									<span>{{
                    accountData.isRealName == 0 ? "未实名" : "已实名"
                  }}</span>
								</li>
								<li>
									<span class="accpunt-dislog-list-title">企业名称：</span>
									<span>{{ accountData.organizationName?accountData.organizationName:accountData.userName }}</span>
								</li>
								<li>
									<span class="accpunt-dislog-list-title">证件类型：</span>
									<span>{{ (accountData.organizationCardType? accountData.organizationCardType:accountData.cardType)|filterCardType }}</span>
								</li>
								<li>
									<span class="accpunt-dislog-list-title">统一社会信用代码：</span>
									<span>{{ accountData.organizationCardNum? accountData.organizationCardNum:accountData.cardNum }}</span>
								</li>
								<li>
									<span class="accpunt-dislog-list-title">所在地区：</span>
									<span>{{ accountData.organizationAddress }}</span>
								</li>
							</ul>
						</div>
						<p>企业联系人</p>
						<div class="account-dialog">
							<ul>
								<li>
									<span class="accpunt-dislog-list-title">联系人身份：</span>
									<span v-if="parseInt(accountData.companyRelation)===1">法定代表人</span>
									<span v-if="parseInt(accountData.companyRelation)===2">董事</span>
									<span v-if="parseInt(accountData.companyRelation)===3">企业联系人</span>
								</li>
								<li>
									<span class="accpunt-dislog-list-title">姓名：</span>
									<span>{{ privyData.userName }}</span>
								</li>
								<li>
									<span class="accpunt-dislog-list-title">证件号码：</span>
									<span>{{ privyData.cardNum }}</span>
								</li>
								<li>
									<span class="accpunt-dislog-list-title">出生日期：</span>
									<span>{{ privyData.birth }}</span>
								</li>
								<li>
									<span class="accpunt-dislog-list-title">所在地区：</span>
									<span>{{ privyData.permanentAddress }}</span>
								</li>
							</ul>
							<ul>
								<li>
									<span class="accpunt-dislog-list-title">证件类型：</span>
									<span>{{ privyData.cardType|filterCardType }}</span>
								</li>
								<li>
									<span class="accpunt-dislog-list-title">性别：</span>
									<span>{{ privyData.gender === 1 ? "男" : "女" }}</span>
								</li>
								<li>
									<span class="accpunt-dislog-list-title">手机号码：</span>
									<span>{{ privyData.mobile }}</span>
								</li>
							</ul>
						</div>
					</div>
				</el-dialog>
			</div>
			<!-- 卷宗信息 -->
			<div class="basic-order-information volume-information">
				<h3>
					<i class="el-icon-s-order" style="color: #409eff; padding-right: 5px" />
					卷宗信息
				</h3>
				<div class="volume-information-list">
					<el-form ref="volumeForm" label-position="right" :model="routineData" :rules="volumeRules">
						<el-form-item label="卷宗号:" prop="dossierNum">
							<el-input v-model="routineData.dossierNum" size="medium" :disabled="volumeNumStatu"
								maxlength="16" oninput="value=value.replace(/[^\d]/g,'')" />
						</el-form-item>
						<el-form-item v-if="basicData.prodCode==='ysf'" label="公证书编号:" prop="notaryNum">
							<el-input v-model="routineData.notaryNum" size="medium" :disabled="volumeNumStatu"
								maxlength="15" />
						</el-form-item>
						<el-form-item label="公证员:" prop="notaryPersonId">
							<!-- <el-input
                v-model.trim="basicData.notaryPersonName"
                size="medium"
                :disabled="volumeNumStatu"
                maxlength="15"
              /> -->
							<el-select v-model="routineData.notaryPersonId" placeholder="请选择公证员"
								:disabled="volumeNumStatu" size="medium" style="width:100%">
								<el-option v-for="item in listOfOrganizers" :key="item.id" :label="item.realName"
									:value="item.id" />
							</el-select>
						</el-form-item>
						<el-form-item label="助理:">
							<el-input v-model="routineData.assistantName" size="medium" :disabled="volumeNumStatu"
								maxlength="15" />
						</el-form-item>
						<!-- :disabled="jurisdiction||basicData.orderStatus!==201" -->
						<div class="el-form-item compile-button">
							<el-button type="primary" size="small" style="width: 80px"
								:disabled="basicData.orderStatus === 201&&!jurisdiction?false:true"
								@click="saveVolumeNum">{{ text }}</el-button>
						</div>
					</el-form>
				</div>
			</div>
			<!-- tab栏信息展示 -->
			<div v-if="tablesta" class="tab-main">
				<el-tabs v-model="tabActiveName" @tab-click="handleTabClick">
					<el-tab-pane label="申请信息" name="first">
						<applicationInfo v-if="tabActiveName === 'first'" />
					</el-tab-pane>
					<el-tab-pane v-if="basicData.prodCode === 'ysf'|| basicData.businessType === 11" name="seventh"
						label="事项信息">
						<propertyInfo @signStatusFinish="handleSignStatusFinish" v-if="tabActiveName==='seventh'" />
					</el-tab-pane>
					<el-tab-pane
						v-if="basicData.businessType === 4||basicData.businessType === 6||basicData.businessType === 7||basicData.businessType === 11||basicData.prodCode === 'ysf'"
						label="证据材料" name="second">
						<evidenceMaterial v-if="tabActiveName === 'second'" />
					</el-tab-pane>
					<el-tab-pane
						v-if="basicData.businessType === 4||basicData.businessType === 6||basicData.businessType === 7||basicData.businessType === 11||basicData.prodCode === 'ysf'"
						label="文书材料" name="third">
						<documentMaterial v-if="tabActiveName === 'third'" />
					</el-tab-pane>
					<el-tab-pane v-if="basicData.prodCode !== 'ysf'" label="领证信息" name="fourth">
						<receiverInfo
							v-if="tabActiveName === 'fourth'&& basicData.businessType!==6&& basicData.businessType!==7" />
						<willPayCertificateInfo
							v-if="tabActiveName==='fourth'&&(basicData.businessType===6|| basicData.businessType===7)&&basicData.prodCode !== 'ysf'" />
					</el-tab-pane>
					<el-tab-pane v-if="basicData.prodCode !== 'ysf'" label="物流信息" name="fifth">
						<logisticsInfo :expressId="expressId" v-if="tabActiveName === 'fifth'" />
					</el-tab-pane>
					<el-tab-pane
						v-if="basicData.businessType!==6&&basicData.businessType!==7&&basicData.businessType!==11&&basicData.prodCode !== 'ysf'"
						label="存证证据" name="sixth">
						<depositCertificate v-if="tabActiveName === 'sixth'" />
					</el-tab-pane>
					<el-tab-pane v-if="basicData.prodCode!='yzdl'&&basicData.businessType!==11" label="制证信息"
						name="eighth">
						<qualificationInfo v-if="tabActiveName==='eighth'" />
					</el-tab-pane>
				</el-tabs>
			</div>

			<!-- --------footer状态---------- -->
			<!-- 待审核状态 -->
			<div v-if="basicData.orderStatus === 201" class="statu-main">
				<div class="statu-title-describe">
					<div class="describe-text">
						<span style="line-height: 30px">状态</span>
						<span style="font-size: 18px; color: #f96a00">待审核</span>
					</div>
					<div class="describe-text">
						<span style="line-height: 30px">订单总额</span>
						<span style="font-size: 18px; color: #409eff">￥{{ basicData.totalCost }}</span>
					</div>
					<el-button class="describe-button" style="background-color: #ff7272" :disabled="jurisdiction"
						@click="refusedAccept">
						<span>拒绝受理</span>
					</el-button>
					<!-- @click="setUpAContractor" -->
					<el-button v-if="basicData.prodCode==='ysf'||basicData.prodCode==='rfcw'" class="describe-button"
						style="background-color: #67C23A" :disabled="jurisdiction" @click="setUpAContractor">
						<span>{{ orderOperation?'订单移交':'设置承办人' }}</span>
					</el-button>
					<el-button class="describe-button" style="background-color: #409eff" :disabled="jurisdiction"
						@click="operateSuccessfully">
						<span>通过审核</span>
					</el-button>
				</div>
			</div>
			<!-- 待视频 -->
			<div v-if="basicData.orderStatus === 103" class="statu-main">
				<div class="statu-title-describe">
					<div class="describe-text">
						<span style="line-height: 30px">状态</span>
						<span style="font-size: 18px; color: #f96a00">待视频</span>
					</div>
					<div class="describe-text">
						<span style="line-height: 30px">订单总额</span>
						<span style="font-size: 18px; color: #409eff">￥{{ basicData.totalCost }}</span>
					</div>
					<el-button class="describe-button" style="background-color: #ff7272" :disabled="jurisdiction"
						@click="termination">
						<span>终止办理</span>
					</el-button>
					<el-button v-if="basicData.prodCode==='ysf'" class="describe-button"
						style="background-color: #67C23A" :disabled="jurisdiction" @click="setUpAContractor">
						<span>{{ orderOperation?'订单移交':'设置承办人' }}</span>
					</el-button>
					<el-button v-if="basicData.prodCode!=='ysf'" class="describe-button"
						style="background-color: #3eb88b" :disabled="jurisdiction" @click="copySignCode">
						<span>签署/视频二维码</span>
					</el-button>
					<div v-else style="height:100%;position: relative;">
						<transition name="el-zoom-in-bottom">
							<div v-show="personnelQRCodeList" class="transition-box">
								<div class="qr-code-type" @click="getQRCode(2)">用户签署/视频二维码</div>
								<div class="qr-code-type" @click="getQRCode(1)">公证员视频二维码</div>
							</div>
						</transition>
						<!-- :disabled="jurisdiction" -->
						<el-button class="describe-button" style="background-color: #3eb88b;height:100%"
							:disabled="jurisdiction" @click="personnelQRCodeList=!personnelQRCodeList">
							<span>签署/视频二维码</span>
						</el-button>
					</div>
					<el-button class="describe-button" style="background-color: #0782d1" :disabled="jurisdiction"
						@click="enterVideo">
						<span>进入视频</span>
					</el-button>
					<el-button class="describe-button" style="background-color: #409eff;" :disabled="jurisdiction"
						@click="confirmVideoCompletion">
						<!-- :disabled="jurisdiction" -->
						<span>确认视频完成</span>
					</el-button>
				</div>
			</div>
			<div class="refused-accept">
				<el-dialog title="拒绝受理" :visible.sync="refusedAcceptDialogFormVisible" :close-on-click-modal="false">
					<el-form ref="refusedAccept" :model="refusedAcceptForm" :rules="refusedAcceptRules">
						<el-form-item label="拒绝理由" label-width="100" prop="reason">
							<el-input v-model="refusedAcceptForm.reason" autocomplete="off" type="textarea"
								maxlength="120" placeholder="请输入5 - 120个字" :rows="5" />
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click="refusedAcceptDialogFormVisible = false">取 消</el-button>
						<el-button type="primary" @click="refusedAcceptReasonSubimt">确 定</el-button>
					</div>
				</el-dialog>
			</div>
			<div class="supplementary-materials">
				<el-dialog title="补充材料" :visible.sync="materialsDialogVisible" width="50%"
					:close-on-click-modal="false">
					<el-tabs v-model="activeName">
						<el-tab-pane label="材料选择" name="first">
							<div class="select-material">
								<div class="search">
									<el-input v-model="searchMaterial" placeholder="请输入材料名称" size="medium"
										@input="blankReset(searchMaterial)" />
									<el-button type="primary" size="medium" @click="searchMaterialName">搜索</el-button>
								</div>
								<div class="material-list">
									<div v-for="(item, index) in materialData" :key="index" style="display: flex">
										<span style="padding-right: 30px">{{
                      item.firstLetter
                    }}</span>
										<el-checkbox-group v-model="checkList">
											<el-checkbox v-for="(items, indexs) in item.orgMaterialDTOS" :key="indexs"
												:label="items.id">{{ items.materialName }}</el-checkbox>
										</el-checkbox-group>
									</div>
								</div>
							</div>
						</el-tab-pane>
						<el-tab-pane label="添加临时材料" name="second">
							<div class="add-material">
								<el-alert title="临时材料不会保存至材料库。" type="warning" show-icon />
								<div class="from-list">
									<div v-for="(item, index) in addMaterialData" :key="index" class="from-list-buttom">
										<el-form label-position="right" label-width="120px">
											<el-form-item :label="item.newName" required>
												<el-input v-model="item.model.name" size="medium" maxlength="50"
													placeholder="请输入材料名称" />
											</el-form-item>
											<el-form-item :label="item.newRemark">
												<el-input v-model="item.model.remark" type="textarea" maxlength="100"
													placeholder="请输入备注" />
											</el-form-item>
										</el-form>
										<span :class="
                        item.btn === '添加'
                          ? 'add-text-button'
                          : 'reduce-text-button'
                      " @click="addForm(item, index)">
											<i :class="
                          item.btn === '添加' ? 'el-icon-plus' : 'el-icon-minus'
                        " style="padding-right: 2px; font-size: 8px" />
											<span>{{ item.btn }}</span>
										</span>
									</div>
								</div>
							</div>
						</el-tab-pane>
					</el-tabs>
					<span slot="footer" class="dialog-footer">
						<el-button @click="materialsDialogVisible = false">取 消</el-button>
						<el-button type="primary" @click="supplementMaterial">确 定</el-button>
					</span>
				</el-dialog>
			</div>
			<div class="termination-dialog">
				<el-dialog title="提示" :visible.sync="terminationDialogVisible" width="50%"
					:close-on-click-modal="false">
					<el-form ref="terminationForm" label-position="right" label-width="80px" :model="terminationData"
						:rules="terminationRules">
						<el-form-item label="终止原因" prop="terminationCause">
							<el-input v-model="terminationData.terminationCause" type="textarea" :rows="4" />
						</el-form-item>
					</el-form>
					<span slot="footer" class="dialog-footer">
						<el-button @click="terminationDialogVisible = false">取 消</el-button>
						<el-button type="primary" @click="confirmTermination">确 定</el-button>
					</span>
				</el-dialog>
			</div>

			<!-- 待拟合同 -->
			<div v-if="basicData.orderStatus === 104" class="statu-main">
				<div class="statu-title-describe">
					<div class="describe-text">
						<span style="line-height: 30px">状态</span>
						<span style="font-size: 18px; color: #f96a00">待拟合同</span>
					</div>
					<div class="describe-text">
						<span style="line-height: 30px">订单总额</span>
						<span style="font-size: 18px; color: #409eff">￥{{ basicData.totalCost }}</span>
					</div>
				</div>
			</div>

			<!-- 需补材料 -->
			<div v-if="basicData.orderStatus === 202" class="statu-main">
				<div class="statu-title-describe">
					<div class="describe-text">
						<span style="line-height: 30px">状态</span>
						<span style="font-size: 18px; color: #f96a00">需补材料</span>
					</div>
					<div class="describe-text">
						<span style="line-height: 30px">订单总额</span>
						<span style="font-size: 18px; color: #409eff">￥{{ basicData.totalCost }}</span>
					</div>
				</div>
			</div>

			<!-- 待支付 -->
			<div v-if="basicData.orderStatus === 101" class="statu-main">
				<div class="statu-title-describe">
					<div class="describe-text">
						<span style="line-height: 30px">状态</span>
						<span style="font-size: 18px; color: #f96a00">待支付</span>
					</div>
					<div class="describe-text">
						<span style="line-height: 30px">订单总额</span>
						<span style="font-size: 18px; color: #409eff">￥{{ basicData.totalCost }}</span>
					</div>
					<el-button
						v-if="basicData.businessType===4||basicData.businessType===6||basicData.businessType===7||basicData.businessType===9||basicData.prodCode==='ysf'"
						:disabled="jurisdiction" class="describe-button" style="background-color: #ff7272"
						@click="termination">
						<span>终止办理</span>
					</el-button>
					<el-button v-if="basicData.prodCode==='ysf'" class="describe-button"
						style="background-color: #67C23A" :disabled="jurisdiction" @click="setUpAContractor">
						<span>{{ orderOperation?'订单移交':'设置承办人' }}</span>
					</el-button>
					<el-button v-if="basicData.businessType!==6&&basicData.businessType!==7" class="describe-button"
						:disabled="jurisdiction" style="background-color: #409eff" @click="offlinePayment">
						<span>{{ basicData.prodCode!=='ysf'?'线下支付':'确认已支付' }}</span>
					</el-button>
					<!-- <el-button
            v-if="basicData.prodCode==='ysf'"
            class="describe-button"
            :disabled="jurisdiction"
            style="background-color: #409eff"
            @click="offlinePayment"
          >
            <span>确认已支付</span>
          </el-button> -->
				</div>
			</div>

			<!-- 待签署 -->
			<div v-if="basicData.orderStatus === 102 || basicData.orderStatus === 105 && (basicData.businessType !== 6||basicData.businessType !== 7)"
				class="statu-main">
				<div class="statu-title-describe">
					<div class="describe-text">
						<span style="line-height: 30px">状态</span>
						<span style="font-size: 18px; color: #f96a00">{{ basicData.orderStatus | orderState }}</span>
					</div>
					<div class="describe-text">
						<span style="line-height: 30px">订单总额</span>
						<span style="font-size: 18px; color: #409eff">￥{{ basicData.totalCost }}</span>
					</div>
					<el-button :disabled="jurisdiction" class="describe-button" style="background-color: #ff7272"
						@click="termination">
						<span>终止办理</span>
					</el-button>
					<el-button v-if="basicData.businessType!==5" class="describe-button" :disabled="jurisdiction"
						style="background-color: #409eff" @click="copySignCode">
						<span>{{ basicData.businessType | textComputed }}</span>
					</el-button>
				</div>
			</div>
			<!--  v-if="basicData.orderStatus === 102&&basicData.businessType === 6"  v-if="basicData.orderStatus === 102&&(basicData.businessType === 6||basicData.businessType===7)"-->
			<div v-if="basicData.orderStatus === 102&&(basicData.businessType === 6||basicData.businessType===7)"
				class="statu-main">
				<div class="statu-title-describe">
					<!-- <div v-if="basicData.paymentStatus===2" class="describe-text">
            <span style="line-height: 30px">备注：{{ basicData.orderRemark }}</span>
          </div> -->
					<div class="describe-text">
						<span style="line-height: 30px">状态</span>
						<span style="font-size: 18px; color: #f96a00">待签署</span>
					</div>
					<div class="describe-text">
						<span style="line-height: 30px">订单总额</span>
						<span style="font-size: 18px; color: #409eff">￥{{ basicData.totalCost }}</span>
					</div>
					<el-button :disabled="jurisdiction" class="describe-button" style="background-color: #ff7272"
						@click="termination">
						<span>终止办理</span>
					</el-button>
					<div style="height:100%;position: relative;">
						<transition name="el-zoom-in-bottom">
							<div v-show="personnelQRCodeList" class="transition-box">
								<div class="qr-code-type" @click="getQRCode(2)">用户签署/视频二维码</div>
								<div class="qr-code-type" @click="getQRCode(1)">公证员视频二维码</div>
							</div>
						</transition>
						<el-button class="describe-button" :disabled="jurisdiction"
							style="background-color: #3eb88b;height:100%"
							@click="personnelQRCodeList=!personnelQRCodeList">
							<span>签署/视频二维码</span>
						</el-button>
					</div>
					<el-button class="describe-button" :disabled="jurisdiction" style="background-color: #0782d1"
						@click="enterVideo">
						<span>进入视频</span>
					</el-button>
				</div>
			</div>

			<div class="code-dialog">
				<el-dialog title="保存签署码" :visible.sync="codeDialogVisible" width="30%" :close-on-click-modal="false">
					<el-image id="QR-code" style="width: 200px; height: 200px" :src="codeUrl" />
					<span slot="footer" class="dialog-footer">
						<el-button @click="codeDialogVisible = false">关闭</el-button>
					</span>
				</el-dialog>
			</div>

			<!-- 制证中 -->
			<div v-if="basicData.orderStatus === 301" class="statu-main">
				<div class="statu-title-describe">
					<!-- <div v-if="basicData.paymentStatus===2" class="describe-text">
            <span style="line-height: 30px">备注：{{ basicData.orderRemark }}</span>
          </div> -->
					<div class="describe-text">
						<span style="line-height: 30px">状态</span>
						<span style="font-size: 18px; color: #f96a00">制证中</span>
					</div>
					<div class="describe-text">
						<span style="line-height: 30px">订单总额</span>
						<span style="font-size: 18px; color: #409eff">￥{{ basicData.totalCost }}</span>
					</div>
					<el-button :disabled="jurisdiction" class="describe-button" style="background-color: #ff7272;"
						@click="termination">
						<span>终止办理</span>
					</el-button>
					<el-button v-if="basicData.prodCode==='ysf'" class="describe-button"
						style="background-color: #67C23A" :disabled="jurisdiction" @click="setUpAContractor">
						<span>{{ orderOperation?'订单移交':'设置承办人' }}</span>
					</el-button>
					<el-button :disabled="jurisdiction" class="describe-button" style="background-color: #409eff"
						@click="certificateIssued">
						<span>{{ basicData.prodCode==='ysf'?'发送电子公证书':'出具证书' }}</span>
					</el-button>
				</div>
			</div>

			<!-- 待邮寄 -->
			<div v-if="basicData.orderStatus === 302" class="statu-main">
				<div class="statu-title-describe">
					<!-- <div v-if="basicData.paymentStatus===2" class="describe-text">
            <span style="line-height: 30px">备注：{{ basicData.orderRemark }}</span>
          </div> -->
					<div class="describe-text">
						<span style="line-height: 30px">状态</span>
						<span style="font-size: 18px; color: #f96a00">待邮寄</span>
					</div>
					<div class="describe-text">
						<span style="line-height: 30px">订单总额</span>
						<span style="font-size: 18px; color: #409eff">￥{{ basicData.totalCost }}</span>
					</div>
					<el-button :disabled="jurisdiction" class="describe-button" style="background-color: #409eff"
						@click="callCourier">
						<span>呼叫快递揽收</span>
					</el-button>
				</div>
			</div>

			<!-- 待预约 -->
			<div v-if="basicData.orderStatus === 303" class="statu-main">
				<div class="statu-title-describe">
					<!-- <div v-if="basicData.paymentStatus===2" class="describe-text">
            <span style="line-height: 30px">备注：{{ basicData.orderRemark }}</span>
          </div> -->
					<div class="describe-text">
						<span style="line-height: 30px">状态</span>
						<span style="font-size: 18px; color: #f96a00">待预约</span>
					</div>
					<div class="describe-text">
						<span style="line-height: 30px">订单总额</span>
						<span style="font-size: 18px; color: #409eff">￥{{ basicData.totalCost }}</span>
					</div>
					<el-button :disabled="jurisdiction" class="describe-button" style="background-color: #409eff"
						@click="setLicenseInfo">
						<span>设置领证信息</span>
					</el-button>
				</div>
			</div>

			<div class="make-an-appointment">
				<el-dialog title="设置领证信息" :visible.sync="appointmentDialogVisible" width="30%"
					:close-on-click-modal="false">
					<el-form ref="setForm" label-position="right" :rules="setRulse" :model="setData">
						<el-form-item label="领证时间" prop="time">
							<el-date-picker v-model="setData.time" type="date" placeholder="选择领证时间" size="medium"
								style="width: 100%" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"
								:picker-options="pickerOptions0" />
						</el-form-item>
						<el-form-item label="领证地点" prop="site">
							<el-select v-model="setData.site" placeholder="请选择领证地点" size="medium">
								<el-option v-for="item in options" :key="parseInt(item.id)" :label="item.officeName"
									:value="item.orgAddress" />
							</el-select>
						</el-form-item>
						<el-form-item label="领证号" prop="num">
							<el-input v-model="setData.num" size="medium" placeholder="请填写领证号" maxlength="10" />
						</el-form-item>
					</el-form>
					<span slot="footer" class="dialog-footer">
						<el-button @click="appointmentDialogVisible = false">取 消</el-button>
						<el-button type="primary" @click="submitSetData">确 定</el-button>
					</span>
				</el-dialog>
			</div>

			<!-- 已邮寄 -->
			<div v-if="basicData.orderStatus === 304" class="statu-main">
				<div class="statu-title-describe">
					<!-- <div v-if="basicData.paymentStatus===2" class="describe-text">
            <span style="line-height: 30px">备注：{{ basicData.orderRemark }}</span>
          </div> -->
					<div class="describe-text">
						<span style="line-height: 30px">状态</span>
						<span style="font-size: 18px; color: #f96a00">已邮寄</span>
					</div>
					<div class="describe-text">
						<span style="line-height: 30px">订单总额</span>
						<span style="font-size: 18px; color: #409eff">￥{{ basicData.totalCost }}</span>
					</div>
					<el-button v-if="basicData.businessType!==5" :disabled="jurisdiction" class="describe-button"
						style="background-color: #409eff" @click="completedThe">
						<span>完成办理</span>
					</el-button>
				</div>
			</div>

			<!-- 已预约 -->
			<div v-if="basicData.orderStatus === 305" class="statu-main">
				<div class="statu-title-describe">
					<!-- <div v-if="basicData.paymentStatus===2" class="describe-text">
            <span style="line-height: 30px">备注：{{ basicData.orderRemark }}</span>
          </div> -->
					<div class="describe-text">
						<span style="line-height: 30px">状态</span>
						<span style="font-size: 18px; color: #f96a00">已预约</span>
					</div>
					<div class="describe-text">
						<span style="line-height: 30px">订单总额</span>
						<span style="font-size: 18px; color: #409eff">￥{{ basicData.totalCost }}</span>
					</div>
					<el-button class="describe-button" :disabled="jurisdiction"
						style="background-color: #409eff; opacity: 0.6" @click="SMSReminder">
						<span>短信提醒领证</span>
					</el-button>
					<el-button :disabled="jurisdiction" class="describe-button" style="background-color: #409eff"
						@click="completedThe">
						<span>完成办理</span>
					</el-button>
				</div>
			</div>

			<!-- 受理中 -->
			<div v-if="basicData.orderStatus === 2" class="statu-main">
				<div class="statu-title-describe">
					<!-- <div v-if="basicData.paymentStatus===2" class="describe-text">
            <span style="line-height: 30px">备注：{{ basicData.orderRemark }}</span>
          </div> -->
					<div class="describe-text">
						<span style="line-height: 30px">状态</span>
						<span style="font-size: 18px; color: #f96a00">受理中</span>
					</div>
					<div class="describe-text">
						<span style="line-height: 30px">订单总额</span>
						<span style="font-size: 18px; color: #409eff">￥{{ basicData.totalCost }}</span>
					</div>
					<el-button :disabled="jurisdiction" class="describe-button" style="background-color: #ff7272;"
						@click="termination">
						<span>终止办理</span>
					</el-button>
					<el-button v-if="basicData.prodCode==='ysf'" class="describe-button"
						style="background-color: #409eff" :disabled="jurisdiction" @click="setUpAContractor">
						<span>{{ orderOperation?'订单移交':'设置承办人' }}</span>
					</el-button>
				</div>
			</div>

			<!-- 已完成 -->
			<div v-if="basicData.orderStatus === 306" class="statu-main">
				<div class="statu-title-describe">
					<!-- <div v-if="basicData.paymentStatus===2" class="describe-text">
            <span style="line-height: 30px">备注：{{ basicData.orderRemark }}</span>
          </div> -->
					<div class="describe-text">
						<span style="line-height: 30px">状态</span>
						<span style="font-size: 18px; color: #f96a00">已完成</span>
					</div>
					<div class="describe-text">
						<span style="line-height: 30px">订单总额</span>
						<span style="font-size: 18px; color: #409eff">￥{{ basicData.totalCost }}</span>
					</div>
				</div>
			</div>

			<!-- 拒绝受理 -->
			<div v-if="basicData.orderStatus === 401" class="statu-main">
				<div class="statu-title-describe">
					<div class="reasons-text" style="flex: 1">
						<div style="padding-left: 20px">拒绝原因：</div>
						<div>{{ basicData.orderRemark }}</div>
					</div>
					<!-- <div v-if="basicData.paymentStatus===2" class="describe-text">
            <span style="line-height: 30px">备注：{{ basicData.orderRemark }}</span>
          </div> -->
					<div class="describe-text">
						<span style="line-height: 30px">状态</span>
						<span style="font-size: 18px; color: #f96a00">拒绝受理</span>
					</div>
					<div class="describe-text">
						<span style="line-height: 30px">订单总额</span>
						<span style="font-size: 18px; color: #409eff">￥{{ basicData.totalCost }}</span>
					</div>
				</div>
			</div>

			<!-- 已撤销 -->
			<div v-if="basicData.orderStatus === 403" class="statu-main">
				<div class="statu-title-describe">
					<div class="reasons-text" style="flex: 1">
						<div style="padding-left: 20px">取消原因：</div>
						<div>用户主动撤销</div>
					</div>
					<!-- <div v-if="basicData.paymentStatus===2" class="describe-text">
            <span style="line-height: 30px">备注：{{ basicData.orderRemark }}</span>
          </div> -->
					<div class="describe-text">
						<span style="line-height: 30px">状态</span>
						<span style="font-size: 18px; color: #f96a00">已撤销</span>
					</div>
					<div class="describe-text">
						<span style="line-height: 30px">订单总额</span>
						<span style="font-size: 18px; color: #409eff">￥{{ basicData.totalCost }}</span>
					</div>
				</div>
			</div>

			<!-- 已终止 -->
			<div v-if="basicData.orderStatus === 402" class="statu-main">
				<div class="statu-title-describe">
					<div class="reasons-text" style="flex: 1">
						<div style="padding-left: 20px">终止原因：</div>
						<div>{{ basicData.orderRemark }}</div>
					</div>
					<!-- <div v-if="basicData.paymentStatus===2" class="describe-text">
            <span style="line-height: 30px">备注：{{ basicData.orderRemark }}</span>
          </div> -->
					<div class="describe-text">
						<span style="line-height: 30px">状态</span>
						<span style="font-size: 18px; color: #f96a00">已终止</span>
					</div>
					<div class="describe-text">
						<span style="line-height: 30px">订单总额</span>
						<span style="font-size: 18px; color: #409eff">￥{{ basicData.totalCost }}</span>
					</div>
				</div>
			</div>
			<div v-if="sendSms" class="send-sms-button">
				<el-button type="primary" round @click="sendSmsLink">发送短信链接</el-button>
			</div>
			<div class="set-up-a-contractor">
				<el-dialog :title="orderOperation?'订单移交':'设置承办人'" :visible.sync="setUpAContractorDialogVisible"
					:close-on-click-modal="false" width="30%">
					<div class="set-up-main">
						<el-radio-group v-model="organizer">
							<el-radio v-for="item in listOfOrganizers" :key="item.id" :label="item.id">
								{{ item.realName }}</el-radio>
						</el-radio-group>
					</div>
					<span slot="footer" class="dialog-footer">
						<el-button @click="setUpAContractorDialogVisible = false">取 消</el-button>
						<el-button type="primary" @click="determineTheSettings">确 定</el-button>
					</span>
				</el-dialog>
			</div>
		</div>
	</div>
</template>

<script>
import Clipboard from 'clipboard'
import {
	getEntryDateil,
	getAllAddress,
	getAccountInfo,
	getMaterialDepot,
	modificationOrderInfo,
	determineWhether,
	addDetermine,
	addNeedDetermine,
	getReceiverInfo,
	SignedCodeCopy,
	sendTextMessage,
	modificationReceiveInfo, getProposeInfo, sendSmsToTheParties,
	getEnterprisePrivyInfo,
	getRecipientsInfo,
	sendNotaryPaper,
} from '../../api/cloudMail'
import { appointmentTime } from '../../api/mailManage'
import { getReplaceJson, replaceVariable, saveDefenseParkingHolderInfo } from "../../api/parkingSpace";
import * as newHouse from '../../api/newhouse'
import applicationInfo from '../../components/entryTab/applicationInfo'
import documentMaterial from '../../components/entryTab/documentMaterial'
import logisticsInfo from '../../components/entryTab/logisticsInfo'
import depositCertificate from '../../components/entryTab/depositCertificate'
import receiverInfo from '../../components/entryTab/receiverInfo'
import evidenceMaterial from '../../components/entryTab/evidenceMaterial'
import willPayCertificateInfo from '../../components/entryTab/willPayCertificateInfo'
import propertyInfo from '../../components/entryTab/propertyInfo'
import qualificationInfo from '../../components/entryTab/qualificationInfo'
import html2canvas from 'html2canvas'
import { filterCardType } from '@/filters/index'
export default {
	components: {
		applicationInfo,
		documentMaterial,
		logisticsInfo,
		depositCertificate,
		receiverInfo,
		evidenceMaterial,
		willPayCertificateInfo,
		propertyInfo,
		qualificationInfo,
	},
	filters: {
		filterCardType,
		// certificateType(val) {
		//   var str = ''
		//   switch (true) {
		//     case parent(val) === 111:str = '居民身份证'
		//       return str
		//     case parent(val) === 112:str = '临时居民身份证'
		//       return str
		//     case parent(val) === 113:str = '户口簿'
		//       return str
		//     case parent(val) === 114:str = '中国人民解放军军官证'
		//       return str
		//     case parent(val) === 116:str = '香港居民身份证'
		//       return str
		//     case parent(val) === 117:str = '澳门居民身份证'
		//       return str
		//     case parent(val) === 118:str = '港澳居民来往内地通行证'
		//       return str
		//     case parent(val) === 119:str = '台湾居民来往内地通行证'
		//       return str
		//     case parent(val) === 121:str = '营业执照注册号'
		//       return str
		//     case parent(val) === 122:str = '机构组织代码'
		//       return str
		//     case parent(val) === 123:str = '士兵证'
		//       return str
		//     case parent(val) === 124:str = '台湾居民身份证'
		//       return str
		//     case parent(val) === 126:str = '统一社会信用代码'
		//       return str
		//     case parent(val) === 125:str = '律师证'
		//       return str
		//     case parent(val) === 127:str = '企业注册编码'
		//       return str
		//     case parent(val) === 128:str = '驾驶证'
		//       return str
		//     case parent(val) === 130:str = '港澳居民居住证'
		//       return str
		//     case parent(val) === 131:str = '台湾居民居住证'
		//       return str
		//     case parent(val) === 133:str = '外国护照'
		//       return str
		//     case parent(val) === 132:str = '普通护照（中国）'
		//       return str
		//   }
		//   return str
		// },
		userType(val) {
			var str = ''
			if (parseInt(val) === 1) {
				str = '个人用户'
			} else if (parseInt(val) === 2) {
				str = '企业用户'
			}
			return str
		},
		orderState(val) {
			var str = ''
			switch (true) {
				case val === 1:
					str = '待提交'
					return str
				case val === 104:
					str = '待拟合同'
					return str
				case val === 105:
					str = '待录制'
					return str
				case val === 2:
					str = '受理中'
					return str
				case val === 201:
					str = '待审核'
					return str
				case val === 202:
					str = '需补材料'
					return str
				case val === 301:
					str = '制证中'
					return str
				case val === 302:
					str = '待邮寄'
					return str
				case val === 303:
					str = '待预约'
					return str
				case val === 304:
					str = '已邮寄'
					return str
				case val === 305:
					str = '已预约'
					return str
				case val === 306:
					str = '已完成'
					return str
				case val === 401:
					str = '拒绝受理'
					return str
				case val === 103:
					str = '待视频'
					return str
				case val === 402:
					str = '已终止'
					return str
				case val === 102:
					str = '待签署'
					return str
				case val === 403:
					str = '已撤销'
					return str
				case val === 404:
					str = '已删除'
					return str
				case val === 101:
					str = '待支付'
					return str
				default:
					return val
			}
		},
		textComputed(val) {
			const text = {
				4: "签署码",
				default: "签署/视频码"
			}
			if (text[val]) return text[val]
			return text.default
		}
	},
	data() {
		return {
			sendSms: false,
			pickerOptions0: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7// 如果没有后面的-8.64e7就是不可以选择今天的
				}
			},
			jurisdiction: false,
			personnelQRCodeList: false,
			submitStatu: false,
			tablesta: false,
			orderId: '',
			mainStatu: true,
			basicData: {},
			// volumeData: {
			//   volumeNum: '',
			//   name: '',
			//   assistant: ''
			// },
			volumeRules: {
				dossierNum: [
					{ required: true, message: '请输入正确的卷宗号', trigger: 'blur' }
				],
				notaryPersonId: [
					{
						required: true,
						message: '允许输入汉字、数字、字母或（）-',
						trigger: 'blur'
					}
				],
				assistantName: [
					{
						required: true,
						message: '允许输入汉字、数字、字母或（）-',
						trigger: 'blur'
					}
				],
				notaryNum: [
					{
						required: true,
						message: '允许输入汉字、数字、字母或（）-',
						trigger: 'blur'
					}
				]
			},
			volumeNumStatu: true,
			accountDialogVisible: false,
			accountData: {},
			refusedAcceptDialogFormVisible: false,
			refusedAcceptForm: { reason: '' },
			refusedAcceptRules: {
				reason: [
					{ required: true, message: '请输入拒绝理由', trigger: 'blur' },
					{
						min: 5,
						max: 120,
						message: '请输入 5 到 120 个字',
						trigger: 'blur'
					}
				]
			},
			materialsDialogVisible: false,
			activeName: 'first',
			searchMaterial: '',
			checkList: [],
			addMaterial: {
				name: '',
				remark: ''
			},
			addMaterialData: [
				{
					id: 1,
					newName: '新材料名称',
					newRemark: '材料备注',
					btn: '添加',
					model: { name: '', remark: '' }
				}
			],
			tabActiveName: 'first',
			materialData: [],
			terminationDialogVisible: false,
			terminationData: {
				terminationCause: ''
			},
			terminationRules: {
				terminationCause: [
					{ required: true, message: '请输入终止原因', trigger: 'blur' },
					{
						min: 5,
						max: 120,
						message: '长度在 3 到 120 个字',
						trigger: 'blur'
					}
				]
			},
			appointmentDialogVisible: false,
			setData: {
				time: '',
				site: '',
				num: ''
			},
			options: [],
			setRulse: {
				time: [
					{
						required: true,
						message: '请选择领证日期',
						trigger: 'change'
					}
				],
				site: [
					{
						required: true,
						message: '请选择领证地点',
						trigger: 'change'
					}
				],
				num: [{ required: true, message: '请填写领证号', trigger: 'blur' }]
			},
			codeDialogVisible: false,
			codeUrl: '',
			privyData: {},
			setUpAContractorDialogVisible: false,
			listOfOrganizers: [],
			organizer: '',
			routineData: { dossierNum: '', notaryNum: '', notaryPersonName: '', assistantName: '', notaryPersonId: '' },
			orderOperation: false,
			contractStatus: "",
			expressId: '',
			signStatusFinish: false,	// 可出具证书状态
		}
	},
	computed: {
		text() {
			var str = ''
			if (this.volumeNumStatu) {
				str = '编辑'
			} else {
				str = '保存'
			}
			return str
		},
	},
	watch: {
		// 路由监听：监听路由的变化，从而做出相应操作
		$route: {
			immediate: true, // 一旦监听到路由的变化立即执行
			handler(to, from) {
				// 回调函数，两个参数，to：当前的组件，from：上一个组件
				if (to.name !== 'entryDetailsOrder') {
					this.mainStatu = false
				}
			}
		},
		'$store.state.app.mask': function (newVal, oldVal) {
			if (newVal) {
				this.sendSms = false
			}
		}
	},
	beforeCreate() { },
	created() {
		if (this.$route.query.orderId) {
			this.orderId = this.$route.query.orderId
		} else {
			this.orderId = this.$store.state.app.orderId
			var url = `/#${this.$route.path}?orderId=${this.orderId}`
			history.pushState(null, null, url)
		}
		var data = { orderId: this.orderId }

		// getJurisdiction({ orderId: this.orderId }).then((res) => {
		// if (res.success) {
		// this.jurisdiction = !res.data
		this.getData(data)
		// }
		// })
	},
	methods: {
		// 可出具证书状态
		handleSignStatusFinish(val) {
			this.signStatusFinish = val
		},
		setUpAContractor() {
			// newHouse.getAListOfOrganizers().then(res => {
			//   if (res.success) {
			//     this.listOfOrganizers = res.data
			this.organizer = ''// this.basicData.prodCode === 'ysf' ? this.routineData.notaryPersonId : this.basicData.acceptSysUserId === null ? '' : this.basicData.acceptSysUserId
			this.setUpAContractorDialogVisible = true
			// newHouse.setTheOrderHandler({orderId:this.orderId,orgUserId:this.organizer}).then(res=>{
			// })
			// }
			// })
		},
		determineTheSettings() {
			newHouse.setTheOrderHandler({ orderId: this.orderId, orgUserId: this.organizer }).then(res => {
				if (res.success) {
					this.$router.go(0)
				}
			})
		},
		getData(data) {
			newHouse.getAListOfOrganizers().then(res => {
				if (res.success) {
					this.listOfOrganizers = res.data
				}
			})
			getEntryDateil({ orderId: this.orderId }).then(async (res) => {
				this.basicData = res.data

				if (res.data.prodCode === 'ysf') {
					let contractStatus = await newHouse.contractStatus(this.orderId)
					this.contractStatus = contractStatus.success ? contractStatus.data : ""
					const sta = await newHouse.getOrderOperationPermissions({ orderId: this.orderId })
					if (sta.code === 20006) {
						this.jurisdiction = true
						this.$message.error(sta.msg)
						// setTimeout(() => {
						//   this.$router.go(-1)
						// }, 2000)
					} else {
						this.orderOperation = sta.code === 2
						newHouse.getVolumeInformation({ orderId: this.orderId }).then(val => {
							this.routineData.dossierNum = val.data.dossierNum
							this.routineData.notaryNum = val.data.notaryNum
							this.routineData.notaryPersonName = val.data.dossierNum
							this.routineData.assistantName = val.data.assistantUserName
							this.routineData.notaryPersonId = val.data.notaryUserId
						})
					}

				} else if (res.data.prodCode === 'rfcw') {
					this.orderOperation = true
					newHouse.getVolumeInformation({ orderId: this.orderId }).then(val => {
						this.routineData.dossierNum = val.data.dossierNum
						this.routineData.notaryNum = val.data.notaryNum
						this.routineData.notaryPersonName = val.data.dossierNum
						this.routineData.assistantName = val.data.assistantUserName
						this.routineData.notaryPersonId = val.data.notaryUserId
					})
					
				} else {
					this.routineData.dossierNum = res.data.dossierNum
					this.routineData.notaryNum = res.data.notaryNum
					this.routineData.assistantName = res.data.assistantName
					for (let index = 0; index < this.listOfOrganizers.length; index++) {
						if (this.basicData.notaryPersonName === this.listOfOrganizers[index].realName) {
							this.routineData.notaryPersonId = this.listOfOrganizers[index].id
						}
					}
				}
				// this.volumeData.volumeNum = res.data.dossierNum
				// this.volumeData.name = res.data.notaryPersonName
				// this.volumeData.assistant = res.data.assistantName
				if (this.basicData.businessType !== 5) {
					if (sessionStorage.getItem('tabActiveName')) {
						this.tabActiveName = sessionStorage.getItem('tabActiveName')
					} else {
						this.tabActiveName = 'first'
					}
				} else {
					if (this.basicData.prodCode === 'ysf') {
						if (sessionStorage.getItem('tabActiveName')) {
							if (sessionStorage.getItem('tabActiveName') === 'fourth' || sessionStorage.getItem('tabActiveName') === 'fifth' || sessionStorage.getItem('tabActiveName') === 'sixth') {
								this.tabActiveName = 'first'
							} else {
								this.tabActiveName = sessionStorage.getItem('tabActiveName')
							}
						} else {
							this.tabActiveName = 'first'
						}
					} else {
						if (sessionStorage.getItem('tabActiveName')) {
							if (sessionStorage.getItem('tabActiveName') === 'second' || sessionStorage.getItem('tabActiveName') === 'third') {
								this.tabActiveName = 'first'
							} else {
								this.tabActiveName = sessionStorage.getItem('tabActiveName')
							}
						} else {
							this.tabActiveName = 'first'
						}
					}
				}
				this.tablesta = true
				this.getExpressId({ orderNum: res.data.orderNum })
			})
		},
		getExpressId(data) {
			getRecipientsInfo(data).then((res) => {
				if (res.success && res.data) {
					this.expressId = res.data.id
				}
			}).catch((err) => {
				console.log(err);
			})
		},
		// 点击复制订单编号
		copyNum() {
			this.copy('.copy-order-num')
		},
		// 点击复制支付编号
		copyPayNum() {
			this.copy('.copy-pay-num')
		},
		copy(val) {
			// eslint-disable-next-line no-undef
			const clipboard = new Clipboard(val) // 这里括号里填写上面点击事件绑定的class名
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
		// 修改卷宗号
		async saveVolumeNum() {
			if (!this.volumeNumStatu) {
				if (this.routineData.notaryPersonId) {
					for (let index = 0; index < this.listOfOrganizers.length; index++) {
						if (this.routineData.notaryPersonId === this.listOfOrganizers[index].id) {
							this.routineData.notaryPersonName = this.listOfOrganizers[index].realName
						}
					}
				}
				// const fuData = this.basicData.prodCode === 'ysf' || this.basicData.prodCode === 'rfcw' ? { orderId: this.orderId, dossierNum: this.routineData.dossierNum, notaryNum: this.routineData.notaryNum, notaryUserId: this.routineData.notaryPersonId, notaryUserName: this.routineData.notaryPersonName, assistantUserName: this.routineData.assistantName } : this.basicData
				const fuData = {
					orderId: this.orderId,
					dossierNum: this.routineData.dossierNum,
					notaryNum: this.routineData.notaryNum, notaryUserId:
						this.routineData.notaryPersonId,
					notaryUserName: this.routineData.notaryPersonName,
					assistantUserName: this.routineData.assistantName
				}

				if (this.basicData.prodCode !== 'ysf') {
					this.basicData.dossierNum = this.routineData.dossierNum
					this.basicData.acceptSysUserId = this.routineData.notaryPersonId
					this.basicData.notaryPersonName = this.routineData.notaryPersonName
					this.basicData.assistantName = this.routineData.assistantName
				}
				// const url = this.basicData.prodCode === 'ysf' || this.basicData.prodCode === 'rfcw'? `org/update-order-dossier` : `org/update-order-info`
				const url = `org/update-order-dossier`
				const sta = this.basicData.prodCode !== 'ysf' && this.basicData.prodCode !== 'rfcw' ? true : await this.verifyTheVolumeForm()
				console.log(sta)
				if (!sta) {
					this.$message.error('请填写完整卷宗信息')
					return false
				}
				let ret = await this.$axios(url, fuData, { method: 'POST' })
				// .then(res => {
				if (ret.success) {
					this.volumeNumStatu = !this.volumeNumStatu
					// if (this.basicData.businessType === 11) {	// 人防车位
					// 		this.paparkingSpaceReplaceVariable()
					// } else {
					// 	this.$fun.replaceInstrument(this.orderId)
					// }
				}
				// })
				this.routineData.notaryNum = this.basicData.assistantUserName
				this.routineData.notaryPersonName = this.basicData.dossierNum
				this.routineData.assistantName = this.basicData.assistantName
				this.routineData.notaryPersonId = this.basicData.notaryUserId
				modificationOrderInfo(this.basicData).then((res) => {
					if (res.success) {
						this.volumeNumStatu = !this.volumeNumStatu
						if (this.basicData.businessType === 11) {	// 人防车位
							this.paparkingSpaceReplaceVariable()
						} else {
							this.$fun.replaceInstrument(this.orderId)
						}
					}
				})
			} else {
				this.volumeNumStatu = !this.volumeNumStatu
			}
		},
		async paparkingSpaceReplaceVariable() {
			let res = await getReplaceJson(this.orderId)
			if (res) {
				let variable = {
					orgId: this.basicData.orgId,
					proCode: "rfcw",
					orderId: this.orderId,
					templateType: 0,
					type: "",
					json: JSON.stringify(res),
					idDelete: 0
				}
				console.log(variable);

				let result = await replaceVariable(variable)
				console.log('替换结果', result);
				if (result.success) {
					setTimeout(() => {
						this.$router.go(0)
					}, 50);
				}
			}
		},
		verifyTheVolumeForm() {
			return new Promise((resolve, reject) => {
				this.$refs['volumeForm'].validate((valid) => {
					if (valid) {
						resolve(true)
					} else {
						resolve(false)
					}
				})
			})
		},
		// 查看账号信息
		checkAccountInfo() {
			getAccountInfo({ accountId: this.basicData.userAccountInfoId }).then((res) => {
				this.accountData = res.data
				if (res.data.userType !== 1) {
					// getEnterprisePrivyInfo({ accountId: res.data.id }).then(data => {
					this.privyData = res.data.userInfoDTO
					this.privyData.mobile = res.data.mobile
					this.accountDialogVisible = true
					// })
					// } else {
					// }
				}
				this.accountDialogVisible = true
			})
		},
		// 拒绝受理
		refusedAccept() {
			this.refusedAcceptDialogFormVisible = true
			this.submitStatu = false
			this.$nextTick(() => {
				this.$refs['refusedAccept'].resetFields()
			})
		},
		// 补充材料
		rejectedMaterial() {
			this.submitStatu = false
			getMaterialDepot({
				orderId: this.orderId,
				materialName: ''
			}).then((res) => {
				// if (res.data.length > 0) {
				//   for (let index = 0; index < res.data.length; index++) {
				//     if (res.data[index].orgMaterialDTOS.length > 0) {
				//       for (let i = 0; i < res.data[index].orgMaterialDTOS.length; i++) {
				//         if (res.data[index].orgMaterialDTOS[i].isFlag === 1) {
				//           this.checkList.push(res.data[index].orgMaterialDTOS[i].id)
				//         }
				//       }
				//     }
				//   }
				// }
				this.materialData = res.data
				this.searchMaterial = ''
				this.checkList = []
				this.addMaterialData = [
					{
						id: 1,
						newName: '新材料名称',
						newRemark: '材料备注',
						btn: '添加',
						model: { name: '', remark: '' }
					}
				]
				this.materialsDialogVisible = true
			})
		},
		supplementMaterial() {
			if (this.activeName === 'first') {
				if (this.checkList.length < 1) {
					this.$message({
						message: '请至少选择一项',
						type: 'warning'
					})
				} else {
					if (this.submitStatu) {
						return
					}
					this.submitStatu = true
					var arr = []
					for (let j = 0; j < this.checkList.length; j++) {
						for (let index = 0; index < this.materialData.length; index++) {
							for (
								let i = 0;
								i < this.materialData[index].orgMaterialDTOS.length;
								i++
							) {
								if (
									this.checkList[j] ===
									this.materialData[index].orgMaterialDTOS[i].id
								) {
									arr.push(this.materialData[index].orgMaterialDTOS[i])
								}
							}
						}
					}
					for (let index = 0; index < arr.length; index++) {
						arr[index].orderId = this.orderId
					}

					addDetermine(arr).then((res) => {
						if (res.success) {
							const tdata = JSON.parse(JSON.stringify(this.basicData))
							tdata.orderStatus = 202
							modificationOrderInfo(tdata).then((res) => {
								if (res.success) {
									this.$router.go(0)
								}
							})
						}
					})
				}
			} else {
				for (let index = 0; index < this.addMaterialData.length; index++) {
					if (this.addMaterialData[index].model.name.length > 0) {
						var data = {
							orderId: this.orderId,
							materialName: this.addMaterialData[index].model.name,
							type: 2,
							status: 0,
							content: this.addMaterialData[index].model.remark
						}
						arr.push(data)
					}
				}
				if (arr.length > 0) {
					if (this.submitStatu) {
						return
					}
					this.submitStatu = true
					addNeedDetermine(arr).then((res) => {
						if (res.success) {
							const tdata = JSON.parse(JSON.stringify(this.basicData))
							tdata.orderStatus = 202
							modificationOrderInfo(tdata).then((res) => {
								if (res.success) {
									this.$router.go(0)
								}
							})
						}
					})
				} else {
					this.$message({
						message: '请添加临时材料',
						type: 'warning'
					})
				}
			}
		},
		blankReset(val) {
			if (val.length === 0) {
				this.rejectedMaterial()
			}
		},
		// 通过审核
		operateSuccessfully() {
			const h = this.$createElement
			if (this.submitStatu) {
				return
			}
			this.submitStatu = true
			determineWhether({ orderId: this.orderId }).then((res) => {
				if (res.success) {
					// const tdata = JSON.parse(JSON.stringify(this.basicData))
					// tdata.orderStatus = this.basicData.prodCode === 'yzdl' ? 102 : 101

					this.$msgbox({
						title: '提示',
						showCancelButton: true,
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
						message: h('p', null, [
							h('p', null, '确认审核通过该订单？'),
							h(
								'span',
								{ style: 'color: #E6A23C' },
								'审核通过后，无法再次审核。'
							)
						])
					})
						.then(() => {
							const tdata = JSON.parse(JSON.stringify(this.basicData))
							if (this.basicData.prodCode === 'yzdl' || this.basicData.prodCode === 'rfcw') {
								tdata.orderStatus = 102	// 102, "待签署"
							} else if (this.basicData.prodCode === 'ysf') {
								tdata.orderStatus = 103	// 103, "待视频"
							} else {
								tdata.orderStatus = 101	// 101, "待支付"
							}
							// tdata.orderStatus = this.basicData.prodCode === 'yzdl' ? 102 : (this.basicData.prodCode === 'ysf' ? 103 : 101)

							modificationOrderInfo(tdata).then((res) => {
								if (res.success) {
									this.$router.go(0)
								}
							})
						})
						.catch(() => {
							this.$message({
								type: 'info',
								message: '已取消操作'
							})
							this.submitStatu = false
						})
				} else {
					this.submitStatu = false
					if (res.code === 20509) {
						this.$msgbox({
							title: '提示',
							confirmButtonText: '好的',
							type: 'warning',
							message: h('p', null, [
								h('p', null, '您未审核材料，请先审核材料')
								// h(
								//   'span',
								//   { style: 'color: #E6A23C' },
								//   '审核通过后，无法再次审核。'
								// )
							])
						})
							.then(() => {

							})
							.catch(() => {
								this.$message({
									type: 'info',
									message: '已取消操作'
								})
							})
					} else {
						this.$msgbox({
							title: '提示',
							confirmButtonText: '好的',
							type: 'warning',
							message: h('p', null, [h('p', null, res.msg)])
						})
							.then(() => { })
							.catch(() => {
								this.$message({
									type: 'info',
									message: '已取消操作'
								})
							})
					}
				}
			})
		},
		// 填写完拒绝理由后的提交
		refusedAcceptReasonSubimt() {
			this.$refs['refusedAccept'].validate((valid, obj) => {
				if (valid) {
					if (this.submitStatu) {
						return
					}
					this.submitStatu = true
					this.refusedAcceptDialogFormVisible = false
					const tdata = JSON.parse(JSON.stringify(this.basicData))
					tdata.orderStatus = 401
					tdata.orderRemark = this.refusedAcceptForm.reason
					modificationOrderInfo(tdata).then((res) => {
						if (res.success) {
							this.$router.go(0)
						}
					})
					// basicData
				}
			})
		},
		// 动态添加表单
		addForm(val, index) {
			if (val.btn === '添加') {
				var data = {
					id: this.addMaterialData.length + 1,
					newName: '新材料名称',
					newRemark: '材料备注',
					btn: '删除',
					model: { name: '', remark: '' }
				}
				this.addMaterialData.push(data)
			} else {
				this.addMaterialData.splice(index, 1)
			}
		},
		// 终止办理
		termination() {
			this.terminationDialogVisible = true
		},
		confirmTermination() {
			this.$refs['terminationForm'].validate((valid, obj) => {
				if (valid) {
					const tdata = JSON.parse(JSON.stringify(this.basicData))
					tdata.orderStatus = 402
					tdata.orderRemark = this.terminationData.terminationCause
					modificationOrderInfo(tdata).then((res) => {
						if (res.success) {
							this.$router.go(0)
						}
					})
				}
			})
		},
		// 复制签署码
		copySignCode() {
			var data = {
				orderId: this.orderId,
				qrCodeName: '签署码',
				// userType: 0
			}
			if (this.basicData.prodCode === "rfcw") {
				data.userType = "10,11,16"
			} else {
				data.userType = 0
			}
			SignedCodeCopy(data).then((res) => {
				if (res.success) {
					this.codeUrl = 'data:image/png;base64,' + res.data
					this.codeDialogVisible = true
					setTimeout(() => {
						html2canvas(document.getElementById('QR-code')).then(async (canvas) => {
							var imgUrl = canvas.toDataURL()
							const data = await fetch(imgUrl)
							const blob = await data.blob()
							this.blobFile(blob, '签署码')
							// await navigator.clipboard.write([
							// // eslint-disable-next-line no-undef
							//   new ClipboardItem({
							//     [blob.type]: blob
							//   })
							// ])
						})
					}, 1000)
				}
			})
		},
		blobFile(blob, fileName) {
			if (window.navigator.msSaveOrOpenBlob) {
				navigator.msSaveBlob(blob, fileName)
			} else {
				const link = document.createElement('a')
				const body = document.querySelector('body')
				// link.setAttribute('target', 'view_window')
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
		// 出具证书
		certificateIssued() {
			if (this.basicData.prodCode === 'rfcw' && !this.signStatusFinish) {
				this.$confirm('<p">请先将公证书进行盖章签署后，再发送电子公证书</p>', '操作提示', {
					dangerouslyUseHTMLString: true,
					confirmButtonText: '好 的',
					showCancelButton: false,
					type: 'warning',
				})
				return
			}

			const tdata = JSON.parse(JSON.stringify(this.basicData))
			if (this.basicData.obtainCertType === 1) {	// 邮寄送达
				tdata.orderStatus = 302					// 302, "待邮寄"
			} else {									// 线上领证
				tdata.orderStatus = 303					// 303, "待预约"
			}
			const oData = this.basicData.prodCode === 'ysf' ? { orderId: this.orderId } : tdata
			const apiUrl = this.basicData.prodCode === 'ysf' ? `org/send-notary-paper?orderId=${this.orderId}&orderStatus=${this.basicData.orderStatus}` : `org/update-order-info`
			const meth = this.basicData.prodCode === 'ysf' ? 'GET' : 'POST'
			if (this.basicData.prodCode === 'ysf') {
				this.$axios(apiUrl, oData, { method: meth }).then(res => {
					if (res.success) {
						this.$router.go(0)
					} else {
						this.$alert('<span style="display: flex;align-items: center;">' + '<i class="el-icon-warning" style="color:#E6A23C;font-size:30px;line-height:50px"></i>' + '<span style="line-height:50px">' + res.msg + '</span>' + '</span>', '', {
							dangerouslyUseHTMLString: true
						})
					}
				})
			} else {
				this.$confirm('公证书已制作完成？确定后需发证。', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				})
					.then(() => {
						this.$axios(apiUrl, oData, { method: meth }).then(res => {
							if (res.success) {
								saveDefenseParkingHolderInfo(this.orderId).then(res => {
									console.log("出具证书--", res);
									if (res.success) {
										this.$router.go(0)
									}
								})
							} // else {
							// this.$alert('<i class="el-icon-warning" style="color:#E6A23C"></i>' + res.msg, '', {
							//   confirmButtonText: '确定',
							//   callback: action => {
							//   }
							// })
							// this.$alert('<span style="display: flex;align-items: center;">' + '<i class="el-icon-warning" style="color:#E6A23C;font-size:30px;line-height:50px"></i>' + '<span style="line-height:50px">' + res.msg + '</span>' + '</span>', '', {
							//   dangerouslyUseHTMLString: true
							// })
							// }
						})
						// modificationOrderInfo(tdata).then((res) => {
						//   if (res.success) {
						//     this.$router.go(0)
						//   }
						// })
					})
					.catch(() => {
						this.$message({
							type: 'info',
							message: '已取消操作'
						})
					})
			}
		},
		// 线下支付按钮
		offlinePayment() {
			const text = this.basicData.prodCode === 'ysf' ? '确认订单费用已支付？' : '确认变更为线下支付？'
			this.$confirm(text, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					var tdata = JSON.parse(JSON.stringify(this.basicData))
					// tdata.orderStatus = this.basicData.prodCode === 'ysf' ? 2 : (this.basicData.businessType !== 5 ? 102 : 302)
					if (this.basicData.prodCode === 'ysf') {
						tdata.orderStatus = 2
					} else if (this.basicData.prodCode === 'rfcw') {
						tdata.orderStatus = 301
					} else if (this.basicData.businessType === 5) {
						tdata.orderStatus = 302
					} else {
						tdata.orderStatus = 102
					}

					// if (this.basicData.businessType !== 5) {
					//   tdata.orderStatus = 102
					// } else {
					//   tdata.orderStatus = 302
					// }
					tdata.paymentStatus = 1
					// tdata.orderRemark = value
					modificationOrderInfo(tdata).then((res) => {
						if (res.success) {
							if (this.basicData.prodCode === 'ysf') {	// 一手房发送电子公证书
								sendNotaryPaper({
									orderId: this.orderId,
									orderStatus: this.basicData.orderStatus,
								}).then((ret) => {
									if (ret.success) {
										this.$router.go(0)
									}
								})
							} else {
								this.$router.go(0)
							}
						}
					})
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消操作'
					})
				})
			// this.$prompt('备注：', '确定客户进行线下支付费用？', {
			//   confirmButtonText: '确定',
			//   inputType: 'textarea',
			//   cancelButtonText: '取消',
			//   closeOnClickModal: false
			// }).then(({ value }) => {
			//   var tdata = JSON.parse(JSON.stringify(this.basicData))
			//   if (this.basicData.businessType !== 5) {
			//     tdata.orderStatus = 102
			//   } else {
			//     tdata.orderStatus = 302
			//   }
			//   tdata.paymentStatus = 1
			//   tdata.orderRemark = value
			//   modificationOrderInfo(tdata).then((res) => {
			//     if (res.success) {
			//       this.$router.go(0)
			//     }
			//   })
			// }).catch(() => {
			//   this.$message({
			//     type: 'info',
			//     message: '取消输入'
			//   })
			// })
		},
		// 呼叫快递揽收
		callCourier() {
			var str = "'" + this.basicData.orderNum + "'"
			// this.$router.push({
			//   name: 'mailList',
			//   query: { orderNum: str, userType: 1 }
			// })
			this.$router.push({
				name: "expressDelivery",
				query: {
					from: "entryDetailsOrder",
					ids: [this.expressId],
					fromOrderId: this.$route.query.orderId
				}
			})
		},
		// 设置领证信息
		setLicenseInfo() {
			getAllAddress().then((res) => {
				if (res.success) {
					this.options = res.data
					this.appointmentDialogVisible = true
					this.$nextTick(() => {
						this.$refs['setForm'].resetFields()
					})
				}
			})
		},
		submitSetData() {
			this.$refs['setForm'].validate((valid, obj) => {
				if (valid) {
					getReceiverInfo({ orderNum: this.basicData.orderNum }).then(async (res) => {
						if (res.success) {
							var data = res.data
							let obj = {}
							obj = this.options.find((item) => {
								// 这里的userList就是上面遍历的数据源
								return item.orgAddress === this.setData.site // 筛选出匹配数据
							})
							data.receiveNumber = this.setData.num
							data.receiveTime = this.setData.time
							data.receiveAddress = this.setData.site
							data.receivePointName = obj.officeName
							data.receiveStatus = 1    // 0, "未预约" 1, "已预约"
							data.orderNum = this.basicData.orderNum

							if (this.basicData.businessType === 11) {	// 人防车位用新物流的设置领证
								let res = await appointmentTime(data)
								console.log("预约-----", res);
								if (res.success) {
									this.$message.success("预约成功")
									this.$router.go(0)
									return
								}

								this.$message.error(res.msg || "预约失败，请稍后再试")
							} else {
								modificationReceiveInfo(data).then((res) => {
									if (res.success) {
										sendTextMessage({ orderId: this.orderId }).then((res) => {
											if (res.success) {
												const tdata = JSON.parse(JSON.stringify(this.basicData))
												tdata.orderStatus = 305
												modificationOrderInfo(tdata).then((res) => {
													if (res.success) {
														this.$router.go(0)
													}
												})
											}
										})
									}
								})
							}
						}
					})
				}

			})
		},
		// 短信提
		async SMSReminder() {
			this.$confirm('发送短信提醒用户领取公证书', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'info'
			}).then(() => {
				if (this.basicData.businessType === 11) {
					getReceiverInfo({ orderNum: this.basicData.orderNum }).then(async (res) => {
						console.log(res);
						if (res.success) {
							let ret = await appointmentTime(res.data)
							if (ret.success) {
								this.$message.success("发送短信提醒成功")
								return
							}

							this.$message.error("发送短信提醒失败，请稍后再试")
						}
					})
				} else {
					sendTextMessage({ orderId: this.orderId }).then((res) => {
						res.success && this.$message.success("发送短信提醒成功")
					})
				}
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消发送'
				})
			})
		},
		// 完成办理
		completedThe() {
			const h = this.$createElement
			this.$msgbox({
				title: '提示',
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				message: h('p', null, [
					h('p', null, '点击后，办理订单将结束。'),
					h('span', { style: 'color: #E6A23C' }, '确定后，无法撤回！')
				])
			})
				.then(() => {
					const tdata = JSON.parse(JSON.stringify(this.basicData))
					tdata.orderStatus = 306
					modificationOrderInfo(tdata).then((res) => {
						if (res.success) {
							this.$router.go(0)
						}
					})
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消操作'
					})
				})
		},
		enterVideo() {
			this.$axios(`org/sign-region-exist?orderId=${this.orderId}`).then(res => {
				if (!res.data) {
					this.$message.error('有文件尚未设置签署区域')
				} else {
					this.$router.push({ name: 'delegateVideo', query: { orderId: this.orderId } })
				}
			})
		},
		async confirmVideoCompletion() {
			const sta = this.basicData.prodCode === 'ysf' ? await this.determineIfTheVideoIsCompleted() : true
			// if (this.basicData.prodCode === 'ysf') {
			//   if (await this.determineIfTheVideoIsCompleted()) {
			//     return false
			//   }
			// }
			if (!sta) {
				return false
			}
			const h = this.$createElement
			const tip = this.basicData.prodCode === 'ysf' ? '确定视频已完成？' : '确定视频已完成？确定后不可再进行视频'
			this.$msgbox({
				title: '提示',
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				message: h('p', null, [
					h('p', null, tip)
				])
			})
				.then(() => {
					const tdata = JSON.parse(JSON.stringify(this.basicData))
					tdata.orderStatus = 101
					const apiUrl = this.basicData.prodCode === 'ysf' ? `org/confirm-Video-Complete/${this.orderId}` : `org/confirm-is-video?orderId=${this.basicData.id}`
					const meth = this.basicData.prodCode === 'ysf' ? 'GET' : 'PUT'
					this.$axios(apiUrl, {}, { method: meth }).then((res) => {
						if (res.success) {
							// modificationOrderInfo(tdata).then((val) => {
							// if (val.success) {
							this.$router.go(0)
							// }
							// })
						}
					})
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消操作'
					})
				})
		},
		async determineIfTheVideoIsCompleted() {
			const isVideo = await this.$axios(`org/check-Video-Complete/${this.orderId}`)

			console.log(isVideo)
			return new Promise((resolve, reject) => {
				if (isVideo.success) {
					resolve(true)
				} else {
					this.$alert(isVideo.msg, '提示', {
						confirmButtonText: '确定',
						callback: action => {
							resolve(false)
						}
					})
				}
			})
		},
		async getQRCode(type) {
			this.personnelQRCodeList = false
			const data = {
				orderId: this.orderId,
				userType: type === 1 ? 2 : 0,
				qrCodeName: type === 1 ? '公证员视频二维码' : '用户签署/视频二维码'
			}
			let qrcodeSuc = type !== 1
			if (type === 1) {
				qrcodeSuc = await this.sendMessages()
			}
			if (qrcodeSuc) {
				this.$axios(`org/QRCode`, data).then(res => {
					if (res.success) {
						this.personnelQRCodeList = false
						this.$store.commit('app/CHANGE_IMAGE', ['data:image/png;base64,' + res.data])
						if (type !== 1) {
							this.sendSms = true
							this.$store.commit('app/MASK_CHANGE', null)
						}
					} else {
						this.$message.error('获取二维码失败')
					}
				})
			}
		},
		sendSmsLink() {
			getProposeInfo({ orderId: this.orderId }).then(res => {
				if (res.success) {
					const array = res.data
					const phoneList = []
					for (let index = 0; index < array.length; index++) {
						if (array[index].roleCode == 'msr') {
							if (array[index].organizationType === 1) {
								phoneList.push(array[index].organizationPhone)
							} else {
								phoneList.push(array[index].mobile)
							}
						}

					}
					const tip = '将对手机号' + phoneList.join('、') + '发送含有小程序跳转链接的短信，请通知当事人，并约定双方进行视频通话的时间。'
					this.$confirm(tip, '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					}).then(() => {
						sendSmsToTheParties({ orderId: this.orderId }).then(val => {
							if (val.success) {
								this.$message({ type: 'success', message: '短信发送成功' })
								// this.$store.commit('app/CHANGE_IMAGE', [])
								// this.sendSms = false
							} else {
								this.$message.error('短信发送失败')
							}
						})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消发送'
						})
					})
				} else {
					this.$message.error('获取订单当事人信息失败')
				}
			})
		},
		async sendMessages() {
			const that = this
			const phone = await that.$axios(`org/select-order-notary-user-mobile`, { orderId: that.orderId })
			const gzyId = phone.data !== null ? phone.data.id : ''
			return new Promise((resolve, reject) => {
				this.$prompt('', '填写公证员手机号', {
					inputPlaceholder: '请输入填写公证员手机号',
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputErrorMessage: '输入不能为空',
					inputValue: phone.data !== null ? phone.data.notaryUserMobile : '',
					closeOnClickModal: false,
					inputValidator: (value) => { // 点击按钮时，对文本框里面的值进行验证
						if (!value) {
							return '输入不能为空'
						} else if (!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(value)) {
							return '输入正确的手机号'
						}
					},
					callback: async function (action, instance) {
						if (action === 'confirm') {
							const suc = await that.$axios(`org/order-notary-user-mobile`, { orderId: that.orderId, notaryUserMobile: instance.inputValue, id: gzyId }, { method: 'post' })
							resolve(suc.success)
						} else {
							resolve(false)
						}
					}
				})
			})
		},
		// 搜索材料
		searchMaterialName() {
			var data = { orderId: this.orderId, materialName: this.searchMaterial }
			getMaterialDepot(data).then((res) => {
				this.materialData = res.data
			})
		},
		handleTabClick() {
			sessionStorage.setItem('tabActiveName', this.tabActiveName)
		},
		goBack() {
			// this.$router.go(-1)
			this.$router.push({ name: 'businessList' })
		},
		getProductType(val) {
			const tabNameList = {
				"rfcw": "事项信息",
				"ysf": "房产信息",
			}
			if (Object.hasOwnProperty.call(tabNameList, val)) {
				return tabNameList[val]
			}
			return "其他"
		},
	}
}
</script>

<style lang="less" scoped>
ul {
	margin: 0;
	padding: 0;
	li {
		list-style: none;
	}
}
/deep/ .el-dialog__body {
	border-top: solid 1px #eee;
	border-bottom: solid #eee 1px;
}
.entry-dateail-mian {
	background: #f7f7f7;
	min-height: calc(100vh - 50px);
	padding: 20px;
	padding-bottom: 0;
	position: relative;
	display: flex;
	flex-flow: column;
	font-size: 14px;
	color: #333;

	.entry-dateail {
		min-height: calc(100vh - 70px);
		padding-bottom: 90px;
		position: relative;
	}
	.basic-order-information {
		background: #fff;
		padding: 20px;
		h3 {
			margin: 0;
			display: flex;
			align-items: center;
		}
		.basic-order-information-list {
			display: flex;
			margin-top: 20px;
			.move-up {
				margin-top: -30px;
			}
			ul {
				flex: 1;
				li {
					display: flex;
					align-items: center;
					span {
						line-height: 30px;
					}
					.info-title {
						display: block;
						width: 100px;
						text-align: right;
					}
					.stress-text {
						font-size: 20px;
						color: yellowgreen;
						font-weight: bold;
						line-height: 40px;
					}
				}
			}
		}
	}
	.volume-information {
		margin-top: 20px;
		.volume-information-list {
			padding-top: 20px;
			.el-form {
				display: flex;
				align-items: center;
				.el-form-item {
					width: 32%;
					margin-bottom: 10px;
					// /deep/ label::before {
					// 	display: none;
					// }
					/deep/ .el-form-item__content {
						width: 70%;
					}
				}
				.compile-button {
					flex: 1;
					padding-left: 20px;
					display: flex;
					justify-content: flex-end;
					padding-right: 20px;
				}
			}
		}
	}
	.statu-main {
		height: 80px;
		position: absolute;
		bottom: 0;
		background: #fff;
		width: calc(100%);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		.statu-title-describe {
			display: flex;
			justify-content: flex-end;
			height: 100%;
			& > div {
				width: 180px;
				height: 100%;
			}
			.describe-text,
			.describe-button {
				display: flex;
				flex-flow: column;
				justify-content: center;
				align-items: center;
			}
			.describe-text {
				width: auto;
				padding-right: 20px;
				align-items: flex-end;
			}
			.describe-button {
				width: 180px;
				color: #fff;
				border-radius: 0;
				margin-left: 0;
				border: none;
			}
		}
	}
	.account-dialog-main {
		/deep/ .el-dialog__body {
			padding-top: 10px;
		}
		/deep/ .el-dialog__header {
			border-bottom: solid #eee 1px;
			padding-bottom: 20px;
		}
		.account-dialog {
			display: flex;
			align-items: center;
			ul {
				flex: 1;
				li {
					display: flex;
					padding: 10px 0;
					.accpunt-dislog-list-title {
						display: block;
						width: 125px;
						text-align: right;
						color: #999;
						white-space: nowrap;
					}
				}
			}
		}
	}
	.refused-accept {
		.el-form {
			width: 90%;
			margin: auto;
		}
		.el-form-item {
			display: flex;
			/deep/ .el-form-item__content {
				flex: 1;
			}
		}
	}
	.supplementary-materials {
		.select-material {
			.search {
				display: flex;
				/deep/ .el-input,
				/deep/ .el-input__inner {
					width: 400px;
					border-top-right-radius: 0;
					border-bottom-right-radius: 0;
				}
				.el-button {
					border-top-left-radius: 0;
					border-bottom-left-radius: 0;
				}
			}
		}
		.material-list {
			height: 400px;
			border: solid 1px #eee;
			margin-top: 20px;
			padding: 20px;
			overflow: auto;
		}
		.add-material {
			height: 470px;
			overflow: auto;
			.el-alert--warning {
				/deep/ .el-alert__closebtn {
					display: none;
				}
			}
			.from-list {
				.from-list-buttom {
					width: 100%;
					padding-top: 20px;
					display: flex;
					align-items: flex-end;
				}
				.add-text-button {
					margin-left: 20px;
					color: #8a2ee6;
					cursor: pointer;
				}
				.reduce-text-button {
					margin-left: 20px;
					color: red;
					cursor: pointer;
				}
				.el-form {
					width: 60%;
					border-bottom: solid 1px #eee;
				}
			}
		}
	}
	.tab-main {
		background: #fff;
		margin: 20px 0;
		padding: 20px;
	}
	.reasons-text {
		flex: 1;
		display: flex;
		flex-flow: row !important;
		align-items: center;
	}
	.make-an-appointment {
		.el-form {
			.el-form-item {
				display: flex;
				/deep/ .el-form-item__content {
					flex: 1;
				}
				.el-date-editor,
				.el-select {
					width: 100%;
				}
			}
		}
	}
}
.code-dialog {
	/deep/ .el-dialog__body {
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
/deep/ .el-tabs__item {
	font-size: 14px;
}
.privy-info-list {
	li {
		width: 50%;
	}
}
.go-back-btn {
	position: absolute;
	right: 20px;
	top: 20px;
}
.termination-dialog {
	.el-form-item {
		display: flex;
		/deep/ .el-form-item__content {
			margin-left: 0 !important;
			flex: 1;
		}
	}
}
.set-up-main {
	/deep/ .el-radio-group {
		width: 100%;
		margin-top: -20px;
		max-height: 300px;
		overflow-y: scroll;
		.el-radio {
			display: block;
			height: 60px;
			margin: 0;
			border-bottom: #eee 1px solid;
			display: flex;
			align-items: center;
			padding-left: 10px;
		}
	}
}
/deep/ .el-form-item__label {
	white-space: nowrap !important;
}
</style>
<style lang="less">
.el-message-box__content {
	display: flex;
}
.el-message-box__input {
	padding: 0;
	flex: 1;
}
.el-message-box__title {
	position: relative;
	font-size: 16px;
	color: #333;
}
.volume-information {
	.volume-information-list {
		.el-form-item {
			display: flex;
		}
	}
}
.transition-box {
	position: absolute;
	bottom: 100%;
	width: 100%;
	background: #fff;
	z-index: 3333;
}
.qr-code-type {
	width: 100%;
	height: 80px;
	display: flex;
	justify-content: center;
	align-items: center;
	border: solid 1px #ddd;
	cursor: pointer;
}
.qr-code-type:hover {
	background: #eee;
}
.send-sms-button {
	position: fixed;
	z-index: 2001;
	left: 50%;
	bottom: 90px;
	transform: translate(-50%, 0);
}
.contract_status {
	font-size: 18px;
	font-weight: bold;
	color: yellowgreen;
}
</style>
