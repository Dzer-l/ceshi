<template>
	<div class="application-info-main">
		<div class="parties-info">
			<h3>
				<span>当事人信息</span>
				<span>
					<el-button v-if="basicData.prodCode==='ysf'&&basicData.orderStatus===201" type="primary"
						size="small" style="margin-right:20px" :disabled="jurisdiction" @click="newPersone">新增当事人
					</el-button>
				</span>
			</h3>
			<div class="parties-table">
				<el-table :data="partiesTableData" style="width: 100%" border
					:header-cell-style="{ color: '#333', background: '#e6f6fe' }">
					<el-table-column prop="" label="" width="140">
						<template slot-scope="scope">
							<span class="proposer">
								<el-tag style="border-radius: 20px;padding: 0 20px;">{{ scope.row.type }}</el-tag>
							</span>
						</template>
					</el-table-column>
					<el-table-column prop="" label="当事人名称">
						<template slot-scope="scope">
							<span>
								{{ scope.row.name }}
							</span>
						</template>
					</el-table-column>
					<el-table-column label="证件类型">
						<template slot-scope="scope">
							<span>
								{{ scope.row.cradType|filterCardType }}
							</span>
						</template>
					</el-table-column>
					<el-table-column prop="" label="证件号码">
						<template slot-scope="scope">
							<span>
								{{ scope.row.idCrad }}
							</span>
						</template>
					</el-table-column>
					<el-table-column prop="" label="手机号码">
						<template slot-scope="scope">
							<span>
								{{ scope.row.phone }}
							</span>
						</template>
					</el-table-column>
					<el-table-column prop="" label="操作">
						<template slot-scope="scope">
							<el-button type="text" :disabled="jurisdiction" @click="compileInfo(scope.row)">
								{{ (basicData.orderStatus===201&&basicData.businessType!==5)?'编辑':'查看' }}</el-button>
							<el-button v-if="basicData.prodCode==='ysf'&&basicData.orderStatus===201" type="text"
								:disabled="jurisdiction" @click="deleteProposer(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<h3 style="margin-top: 40px">
				<span>费用信息</span>
				<div>
					<el-button v-if="basicData.prodCode==='ysf'&&basicData.orderStatus===201" type="primary"
						size="small" style="margin-right:30px" :disabled="jurisdiction" @click="payQrCode"> 支付二维码
					</el-button>
					<el-button v-if="basicData.orderStatus === 201" type="primary" size="small"
						style="margin-right: 20px" :disabled="jurisdiction" @click="compileCost">编辑费用</el-button>
				</div>
			</h3>
			<div class="parties-table">
				<!-- 4, "邮寄送达出证"  11,"人防车位转让合同公证" -->
				<el-table v-if="basicData.businessType===4||basicData.businessType===11||basicData.prodCode === 'ysf'"
					:data="costTableData" style="width: 100%" border
					:header-cell-style="{ color: '#333', background: '#e6f6fe' }">
					<el-table-column prop="notaryName" label="公证事项" />
					<el-table-column prop="notaryNum" label="公证书份数" />
					<el-table-column prop="orderNotaryCostDetailDTO.cost" label="公证费(元)" />
					<el-table-column prop="orderNotaryCostDetailDTO.copyCost" label="副本费(元)" />
					<el-table-column prop="orderNotaryCostDetailDTO.transCost" label="公证书翻译费(元)" />
					<el-table-column prop="orderNotaryCostDetailDTO.transTextCost" label="文书翻译费(元)" />
					<el-table-column prop="orderNotaryCostDetailDTO.notaryTotalCost" label="总费用(元)" />
				</el-table>

				<el-table v-if="basicData.businessType===6||basicData.businessType===7" :data="costTableData"
					style="width: 100%" border :header-cell-style="{ color: '#333', background: '#e6f6fe' }">
					<el-table-column prop="notaryName" label="公证事项" />
					<el-table-column prop="notaryNum" label="公证书份数" />
					<el-table-column prop="notaryCost" label="公证费(元)" />
					<el-table-column prop="copyCost" label="副本费(元)" />
					<el-table-column label="公证书翻译费(元)">
						<template slot-scope="scope">
							<span>{{ scope.row.transCost }}</span>
						</template>
					</el-table-column>
					<el-table-column label="文书翻译费(元)">
						<template slot-scope="scope">
							<span>{{ scope.row.transTextCost }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="itemTotal" label="总费用(元)" />
				</el-table>

				<el-table v-if="basicData.businessType===5" :data="costTableData" style="width: 100%" border
					:header-cell-style="{ color: '#333', background: '#e6f6fe' }">
					<el-table-column prop="notaryName" label="公证事项" />
					<el-table-column prop="notaryNum" label="保管证书份数" />
					<el-table-column prop="orderNotaryCostDetailDTO.cost" label="纸质保管证书费用(元)" />
					<el-table-column prop="orderNotaryCostDetailDTO.notaryTotalCost" label="总费用(元)" />
				</el-table>
				<div class="cost-statistics">
					<ul>
						<li>
							<span class="cost-title">公证处费用总额：</span>
							<span style="padding-left: 10px">
								￥{{ basicData.businessType===6||basicData.businessType===7?multipleCost.notaryCost: basicData.notaryCost }}
							</span>
						</li>
						<li>
							<span class="cost-title">平台服务费：</span>
							<span style="padding-left: 10px">
								￥{{ basicData.businessType===6||basicData.businessType===7?multipleCost.platformCost:basicData.platformCost }}
							</span>
						</li>
						<li class="cost-total">
							<p>
								<span class="cost-title">费用合计：</span>
								<span style="padding-left: 10px; color: #ec7413">
									￥{{ basicData.businessType===6||basicData.businessType===7?multipleCost.totalCost:basicData.totalCost }}
								</span>
							</p>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="compile-parties">
			<el-dialog title="编辑当事人" :visible.sync="compileParties" width="600px" :close-on-click-modal="false">
				<div v-if="partiesInfo.organizationType !== 0&&partiesInfo.organizationType !== null">
					<el-form ref="enterprise" :model="partiesInfo" label-position="left" :rules="enterprise"
						:disabled="basicData.businessType===5">
						<el-form-item label="企业名称" prop="organizationName">
							<el-input v-model="partiesInfo.organizationName" size="medium" autocomplete="off"
								maxlength="16" placeholder="请输入企业名称" />
						</el-form-item>
						<el-form-item label="证件类型" prop="organizationCardType">
							<el-select ref="organizationCardType" v-model="partiesInfo.organizationCardType"
								size="medium" placeholder="请选择证件类型">
								<el-option label="营业执照注册号" value="121" />
								<el-option label="组织机构代码" value="122" />
								<el-option label="统一社会信用代码" value="126" />
								<el-option label="企业注册编码" value="127" />
								<el-option label="其他" value="000" />
							</el-select>
						</el-form-item>
						<el-form-item label="证件号码" prop="organizationCardNum">
							<el-input v-model="partiesInfo.organizationCardNum" size="medium" autocomplete="off"
								maxlength="18" placeholder="请输入证件号码" />
						</el-form-item>

						<el-form-item label="联系电话" prop="organizationPhone">
							<el-input v-model="partiesInfo.organizationPhone" size="medium" autocomplete="off"
								placeholder="请输入手机号码" maxlength="11" oninput="value=value.replace(/[^\d]/g,'')" />
						</el-form-item>
						<el-form-item label="所在地区" prop="" class="no-required">
							<el-cascader ref="enterpriseCascader" v-model="partiesInfo.enterpriseModelAddres"
								size="medium" :options="options"
								:props="{value: 'name',label: 'name',children: 'children',}" placeholder="请选择省/市/区"
								@change="handleChangeEnterprise" />
						</el-form-item>
						<el-form-item label="详细地址" prop="" class="no-required">
							<el-input v-model="partiesInfo.organizationDetailAddress" size="medium" autocomplete="off"
								placeholder="请输入详细地址" />
						</el-form-item>
						<el-divider />
					</el-form>
				</div>

				<el-form ref="personage" :model="partiesInfo" label-position="left" :rules="personage"
					:disabled="basicData.businessType===5">
					<el-form-item :label="`${partiesInfo.organizationType === 0 ? '姓名' : '法定代表人'}`" prop="realName">
						<el-input v-model="partiesInfo.realName" size="medium" autocomplete="off"
							:placeholder="`${partiesInfo.organizationType === 0 ? '请输入姓名' : '请输入法定代表人姓名'}`" />
					</el-form-item>
					<el-form-item label="证件类型" prop="cardType">
						<el-select ref="cardType" v-model="partiesInfo.cardType" size="medium" placeholder="请选择证件类型">
							<el-option v-for="(item, index) in cardType" :key="index" :label="item.label"
								:value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item label="证件号码" prop="cardNum">
						<el-input v-model="partiesInfo.cardNum" size="medium" placeholder="请输入证件号码"
							autocomplete="off" />
					</el-form-item>
					<el-form-item label="性别" prop="gender">
						<el-radio-group v-model="partiesInfo.gender">
							<el-radio label="1">男</el-radio>
							<el-radio label="2">女</el-radio>
						</el-radio-group>
					</el-form-item>

					<el-form-item label="出生日期" prop="birthday">
						<el-date-picker v-model="partiesInfo.birthday" type="date" size="medium" placeholder="请选择出生日期"
							format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" />
					</el-form-item>

					<!-- <el-form-item label="证件有效期">
						<el-date-picker
						v-model="partiesInfo.expiryDate"
						type="date"
						size="medium"
						placeholder="请选择证件有效期"
						format="yyyy 年 MM 月 dd 日"
						value-format="yyyy-MM-dd"
						/>
					</el-form-item> -->
					<el-form-item label="手机号码" prop="mobile">
						<el-input v-model="partiesInfo.mobile" size="medium" autocomplete="off" maxlength="11"
							placeholder="请输入手机号" oninput="value=value.replace(/[^\d]/g,'')" />
					</el-form-item>
					<el-form-item label="地址" class="no-required" prop="modeAddress">
						<el-cascader ref="personageCascader" v-model="partiesInfo.modeAddress" size="medium"
							:options="options" :props="{value: 'name',label: 'name',children: 'children',}"
							placeholder="请选择省/市/区" @change="handleChangePersonageAddres" />
					</el-form-item>
					<el-form-item label=" ">
						<el-input v-model="partiesInfo.detailAddress" size="medium" autocomplete="off"
							placeholder="请输入详细地址" />
					</el-form-item>
				</el-form>

				<div v-if="basicData.businessType!==5" slot="footer" class="dialog-footer">
					<el-button @click="compileParties = false">取 消</el-button>
					<el-button type="primary" :disabled="basicData.orderStatus===201?false:true"
						@click="savePartiesInfo">确 定</el-button>
				</div>
			</el-dialog>
		</div>
		<div class="cost-dialog">
			<el-dialog title="编辑费用" :visible.sync="costDialogVisible" width="650px" :close-on-click-modal="false">
				<el-form v-if="basicData.businessType===4||basicData.prodCode==='ysf'||basicData.businessType===11"
					ref="costForm" label-position="right" :model="formLabelAlign" :rules="costRulse">

					<h3>公证事项：{{ costData.notaryName }}</h3>
					<el-form-item label="公证书份数" class="number" prop="num">
						<el-input-number v-model="formLabelAlign.num" :max="10" :min="2" size="medium" label="描述文字"
							style="width: 120px" />
					</el-form-item>
					<div class="cost-item">

						<el-form-item label="公证费" prop="notaryCost">
							<el-input v-model="formLabelAlign.notaryCost" size="medium"
								oninput="if(value.length>0)value=value.replace(/^\.+|[^\d.]/g,'').replace(/\.{2,}/g, '').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');if(value.indexOf('.')>0)value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').slice(0,9);if(value.indexOf('.')<0)value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').slice(0,6);if(value.indexOf('.')>6)value=value.substring(0,value.length-3)" />
						</el-form-item>
						<el-form-item label="副本费" prop="subheadCost">
							<el-input v-model="formLabelAlign.subheadCost" size="medium"
								oninput="if(value.length>0)value=value.replace(/^\.+|[^\d.]/g,'').replace(/\.{2,}/g, '').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');if(value.indexOf('.')>0)value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').slice(0,9);if(value.indexOf('.')<0)value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').slice(0,6);if(value.indexOf('.')>6)value=value.substring(0,value.length-3)" />
						</el-form-item>
						<el-form-item label="公证书翻译费" prop="notaryTranslateCost">
							<el-input v-model="formLabelAlign.notaryTranslateCost" size="medium"
								oninput="if(value.length>0)value=value.replace(/^\.+|[^\d.]/g,'').replace(/\.{2,}/g, '').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');if(value.indexOf('.')>0)value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').slice(0,9);if(value.indexOf('.')<0)value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').slice(0,6);if(value.indexOf('.')>6)value=value.substring(0,value.length-3)" />
						</el-form-item>
						<el-form-item label="文书翻译费" prop="fileTranslateCost">
							<el-input v-model="formLabelAlign.fileTranslateCost" size="medium"
								oninput="if(value.length>0)value=value.replace(/^\.+|[^\d.]/g,'').replace(/\.{2,}/g, '').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');if(value.indexOf('.')>0)value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').slice(0,9);if(value.indexOf('.')<0)value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').slice(0,6);if(value.indexOf('.')>6)value=value.substring(0,value.length-3)" />
						</el-form-item>
					</div>
				</el-form>
				<el-form v-if="basicData.businessType===5" ref="costForm" label-position="right" label-width="160px"
					:model="LGdata" :rules="LGRulse" class="column-from">

					<h3>公证事项：{{ costData.notaryName }}</h3>
					<el-form-item label="保管函份数" class="number" prop="num">
						<el-input-number v-model="LGdata.num" :max="20" :min="1" size="medium" disabled label="描述文字"
							style="width: 120px" />
					</el-form-item>
					<el-form-item label="纸质保管证书费用" prop="notaryCost">
						<el-input v-model="LGdata.notaryCost" size="medium"
							oninput="if(value.length>0)value=value.replace(/^\.+|[^\d.]/g,'').replace(/\.{2,}/g, '').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');if(value.indexOf('.')>0)value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').slice(0,9);if(value.indexOf('.')<0)value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').slice(0,6);if(value.indexOf('.')>6)value=value.substring(0,value.length-3)" />
					</el-form-item>
					<el-form-item label="费用合计" prop="allCost">
						<el-input v-model="LGdata.allCost" size="medium"
							oninput="if(value.length>0)value=value.replace(/^\.+|[^\d.]/g,'').replace(/\.{2,}/g, '').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');if(value.indexOf('.')>0)value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').slice(0,9);if(value.indexOf('.')<0)value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').slice(0,6);if(value.indexOf('.')>6)value=value.substring(0,value.length-3)" />
					</el-form-item>
				</el-form>

				<el-form v-if="basicData.businessType===6||basicData.businessType===7" ref="multipCostForm"
					class="multiple-cost-list" :model="multipleCostFromData" :rules="multipleCostRules">
					<div v-for="(item,index) in multipleCostFromData.orgNotaryInfoDTOList" :key="index">
						<h3>公证事项：{{ item.notaryName }}</h3>
						<el-form-item label="公证书份数" class="number-multip-cost">
							<el-input-number v-model="item.notaryNum" :max="10" :min="2" size="medium" label="描述文字"
								style="width: 120px" @change="costChange(item.notaryNum)" />
						</el-form-item>

						<div class="cost-item">
							<el-form-item label="公证费" :prop="'orgNotaryInfoDTOList[' + index + '].notaryCost'"
								:rules="multipleCostRules.notaryCost">
								<el-input v-model="item.notaryCost" size="medium"
									oninput="if(value.length>0)value=value.replace(/^\.+|[^\d.]/g,'').replace(/\.{2,}/g, '').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');if(value.indexOf('.')>0)value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').slice(0,9);if(value.indexOf('.')<0)value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').slice(0,6);if(value.indexOf('.')>6)value=value.substring(0,value.length-3)" />
							</el-form-item>
							<el-form-item label="副本费" :prop="'orgNotaryInfoDTOList[' + index + '].copyCost'"
								:rules="multipleCostRules.copyCost">
								<el-input v-model="item.copyCost" size="medium"
									oninput="if(value.length>0)value=value.replace(/^\.+|[^\d.]/g,'').replace(/\.{2,}/g, '').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');if(value.indexOf('.')>0)value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').slice(0,9);if(value.indexOf('.')<0)value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').slice(0,6);if(value.indexOf('.')>6)value=value.substring(0,value.length-3)" />
							</el-form-item>
							<el-form-item label="公证书翻译费" :prop="'orgNotaryInfoDTOList[' + index + '].transCost'"
								:rules="multipleCostRules.transCost">
								<el-input v-model="item.transCost" size="medium"
									oninput="if(value.length>0)value=value.replace(/^\.+|[^\d.]/g,'').replace(/\.{2,}/g, '').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');if(value.indexOf('.')>0)value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').slice(0,9);if(value.indexOf('.')<0)value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').slice(0,6);if(value.indexOf('.')>6)value=value.substring(0,value.length-3)" />
							</el-form-item>
							<el-form-item label="文本翻译费" :prop="'orgNotaryInfoDTOList[' + index + '].transTextCost'"
								:rules="multipleCostRules.transTextCost">
								<el-input v-model="item.transTextCost" size="medium"
									oninput="if(value.length>0)value=value.replace(/^\.+|[^\d.]/g,'').replace(/\.{2,}/g, '').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');if(value.indexOf('.')>0)value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').slice(0,9);if(value.indexOf('.')<0)value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').slice(0,6);if(value.indexOf('.')>6)value=value.substring(0,value.length-3)" />
							</el-form-item>
						</div>
					</div>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="costDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="costDataSubmit">确 定</el-button>
				</span>
			</el-dialog>
		</div>
		<div class="pay-qrcode-contractor">
			<el-dialog title="支付二维码" :visible.sync="qrcodeDialogVisible" :close-on-click-modal="false" width="30%">
				<div class="qrcode-main">
					<div class="qr-code-image">
						<el-upload v-if="basicData.orderStatus === 201" class="avatar-uploader" action=""
							:show-file-list="false" :http-request="upLoaQRCode" :before-upload="beforeUpload">
							<img v-if="payQrCodeShow" :src="payQrCodeShow" class="avatar"
								style="height:100%;width:100%;border-radius:6px">
							<div v-else>
								<i class="el-icon-plus avatar-uploader-icon" />
								<div style="font-size:12px;color:#999;padding:10px 0">上传二维码图片</div>
							</div>

						</el-upload>
						<img v-else :src="payQrCodeShow" class="avatar"
							style="height:100%;width:100%;border-radius:6px">
					</div>
				</div>
				<span slot="footer" class="dialog-footer">
					<!-- <el-upload
						class="upload-demo"
						action=""
						:http-request="upLoaQRCode"
						:before-upload="beforeUpload"
						:file-list="fileList"
					>
						<el-button type="primary">上传二维码</el-button>
					</el-upload> -->
					<el-button type="primary" style="width:98px" :disabled="!payQrCodeShow"
						:class="!payQrCodeShow?'confirmation':''" @click="determineUpload">确 定</el-button>
				</span>
			</el-dialog>
		</div>
		<div class="new-person">
			<el-dialog :title="operatingType==='add'?'新增当事人':'编辑当事人'" :visible.sync="newPersoneDialogVisible"
				:close-on-click-modal="false" width="600px">
				<div class="new-person-main">
					<newRelationalPerson v-if="newPersoneDialogVisible" ref="newRelationalruleForm"
						:parties-info="partiesInfo" :type="operatingType" :city-arr="cityArr" />
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button @click="newPersoneDialogVisible = false">取 消</el-button>
					<el-button type="primary" :disabled="basicData.orderStatus!==201" @click="confirmNew">确 定
					</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
import {
	getEntryDateil,
	getProposeInfo,
	getProposeDateailInfo,
	getCityData,
	modificationCostInfo, modificationPartiesInfo
} from '../../api/cloudMail'
import { getReplaceJson, replaceVariable } from "../../api/parkingSpace";
import * as newHouse from '../../api/newhouse'
import newRelationalPerson from '../../components/newHouse/newRelationalPerson'
import { filterCardType } from '@/filters/index'
export default {
	components: { newRelationalPerson },
	filters: {
		filterCardType
	},
	data() {
		var validPhone = (rule, value, callback) => {
			if (!value) {
				callback(new Error('请输入手机号'))
			} else if (!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(value)) {
				callback(new Error('请输入正确的手机号'))
			} else {
				callback()
			}
		}
		var validIdcard = (rule, value, callback) => {
			// const reg = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$/
			// var regs = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
			const reg = /^[0-9a-zA-Z]{15,18}$/
			if (!value) {
				callback(new Error('请输入证件号'))
			} else {
				if (parseInt(this.partiesInfo.cardType) === 111) {
					if (reg.test(value)) {
						callback()
					} else {
						callback(new Error('请输入正确的证件号'))
					}
				} else {
					callback()
				}
			}
		}
		var validAddr = (rule, value, callback) => {
			if (this.partiesInfo.modeAddress.length === 0) {
				if (!this.partiesInfo.detailAddress) {
					callback()
				} else {
					callback(new Error('请选择省/市/区'))
				}
			} else {
				callback()
			}
		}
		return {
			cardType: [
				{ value: '111', label: '居民身份证' },
				{ value: '112', label: '临时居民身份证' },
				{ value: '113', label: '户口簿' },
				{ value: '114', label: '中国人民解放军军官证' },
				{ value: '132', label: '普通护照(中国)' },
				{ value: '133', label: '外国护照' },
				{ value: '130', label: '港澳居民居住证' },
				{ value: '118', label: '港澳居民通行证' },
				{ value: '119', label: '台湾居民通行证' },
				{ value: '123', label: '士兵证' },
				{ value: '131', label: '台湾居民居住证' },
				{ value: '125', label: '律师证' },
				{ value: '128', label: '驾驶证' },
				{ value: '129', label: '回乡证' },
				{ value: '000', label: '其他' }
			],
			basicData: {},
			partiesTableData: [],
			costTableData: [],
			compileParties: false,
			partiesInfo: {
				// organizationName:'',
				// organizationCardType:'',
			},
			options: [],
			personage: {
				cardNum: [{ required: true, validator: validIdcard, trigger: 'blur' }],
				realName: [{ required: true, message: '请填写名字', trigger: 'blur' }],
				cardType: [
					{ required: true, message: '请选择证件类型', trigger: 'change' }
				],
				gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
				birthday: [
					{ required: true, message: '请选择出生日期', trigger: 'change' }
				],
				mobile: [{ required: true, validator: validPhone, trigger: 'blur' }],
				modeAddress: [{ required: false, validator: validAddr, trigger: 'change' }]
			},
			LGdata: { num: 1, notaryCost: '', allCost: '' },
			enterprise: {
				organizationCardNum: [
					{ required: true, message: '请填写证件号', trigger: 'blur' }
				],
				organizationName: [
					{ required: true, message: '请填写企业名字', trigger: 'blur' }
				],
				organizationCardType: [
					{ required: true, message: '请选择证件类型', trigger: 'change' }
				],
				organizationPhone: [
					{ required: true, validator: validPhone, trigger: 'blur' }
				],
				enterpriseModelAddres: [
					{ required: true, message: '请选择地区', trigger: 'change' }
				],
				organizationDetailAddress: [
					{ required: true, message: '请填写详细地址', trigger: 'blur' }
				]
			},
			costDialogVisible: false,
			formLabelAlign: {
				notaryCost: '',
				subheadCost: '',
				notaryTranslateCost: '',
				num: '',
				fileTranslateCost: ''
			},
			costRulse: {
				notaryCost: [{ required: true, message: '该费用不能为空', trigger: 'blur' }],
				subheadCost: [{ required: true, message: '该费用不能为空', trigger: 'blur' }],
				notaryTranslateCost: [
					{ required: true, message: '该费用不能为空', trigger: 'blur' }
				],
				num: [{ required: true, message: '该费用不能为空', trigger: 'blur' }],
				fileTranslateCost: [
					{ required: true, message: '该费用不能为空', trigger: 'blur' }
				]
			},
			LGRulse: {
				num: [{ required: true, message: '该费用不能为空', trigger: 'blur' }], notaryCost: [{ required: true, message: '该费用不能为空', trigger: 'blur' }], allCost: [{ required: true, message: '该费用不能为空', trigger: 'blur' }]
			},
			multipleCostRules: {
				notaryCost: [{ required: true, message: '该费用不能为空', trigger: 'blur' }],
				copyCost: [{ required: true, message: '该费用不能为空', trigger: 'blur' }],
				transCost: [{ required: true, message: '该费用不能为空', trigger: 'blur' }],
				transTextCost: [{ required: true, message: '该费用不能为空', trigger: 'blur' }]
			},
			costData: {},
			orderId: '',
			payQrCodeShow: null,
			jurisdiction: false,
			multipleCost: {},
			multipleCostFromData: {},
			qrcodeDialogVisible: false,
			fileList: [],
			newPersoneDialogVisible: false,
			qrCodeFromData: new FormData(),
			cityArr: [], // 传递子组件的城市三级联动数据,
			operatingType: 'add'// 操作类型
		}
	},
	mounted() {
		this.jurisdiction = this.$parent.$parent.$parent.jurisdiction
	},
	// watch:{
	//   $parent.$parent.$parent.basicData
	// },
	created() {
		if (this.$route.query.orderId) {
			this.orderId = this.$route.query.orderId
		} else {
			this.orderId = this.$store.state.app.orderId
			var url = `/#${this.$route.path}?orderId=${this.orderId}`
			history.pushState(null, null, url)
		}
		this.initializationData()
	},
	methods: {
		initializationData() {
			var data = { orderId: this.orderId }
			getEntryDateil(data).then((res) => {
				// console.log(res, '基本信息')
				this.basicData = res.data
				getProposeInfo(data).then((res) => {
					// console.log(res, '申请信息当事人信息')
					this.partiesTableData = this.dispose(res.data)
					const apiurl = this.basicData.businessType === 6 || this.basicData.businessType === 7 ? `org/order-notary-cost-detail?orderId=${this.orderId}` : `org/mail-order-notary-info-cost/${this.orderId}`

					this.$axios(apiurl, { orderId: this.orderId }).then(res => {
						// console.log(res, '申请人信息费用信息')
						if (res.data !== null) {
							if (this.basicData.businessType === 6 || this.basicData.businessType === 7) {
								// console.log('000000000000000000')
								this.costTableData = res.data.orgNotaryInfoDTOList
								this.multipleCost = res.data
							} else {
								this.costTableData.push(res.data)
								this.costData = res.data
								this.formLabelAlign.notaryCost = res.data.orderNotaryCostDetailDTO.cost
								this.formLabelAlign.subheadCost =
									res.data.orderNotaryCostDetailDTO.copyCost
								this.formLabelAlign.notaryTranslateCost =
									res.data.orderNotaryCostDetailDTO.transCost
								this.formLabelAlign.fileTranslateCost =
									res.data.orderNotaryCostDetailDTO.transTextCost
								this.formLabelAlign.num = res.data.notaryNum
								if (this.basicData.businessType === 5) {
									// this.LGdata.num = res.data.notaryNum
									this.LGdata.notaryCost = res.data.orderNotaryCostDetailDTO.cost
									this.LGdata.allCost = res.data.orderNotaryCostDetailDTO.notaryTotalCost
								}
							}
						}
					})
					// getMailCostInfo(data).then((res) => {
					//   console.log(res, '申请人信息费用信息')
					//   if (res.data !== null) {
					//     this.costTableData.push(res.data)
					//     this.costData = res.data
					//     this.formLabelAlign.notaryCost = res.data.orderNotaryCostDetailDTO.cost
					//     this.formLabelAlign.subheadCost =
					//       res.data.orderNotaryCostDetailDTO.copyCost
					//     this.formLabelAlign.notaryTranslateCost =
					//       res.data.orderNotaryCostDetailDTO.transCost
					//     this.formLabelAlign.fileTranslateCost =
					//       res.data.orderNotaryCostDetailDTO.transTextCost
					//     this.formLabelAlign.num = res.data.notaryNum
					//     if (this.basicData.businessType === 5) {
					//       // this.LGdata.num = res.data.notaryNum
					//       this.LGdata.notaryCost = res.data.orderNotaryCostDetailDTO.cost
					//       this.LGdata.allCost = res.data.orderNotaryCostDetailDTO.notaryTotalCost
					//     }
					//   }
					// })
				})
			})
		},
		dispose(array) {
			var list = []
			let t = 0
			for (let index = 0; index < array.length; index++) {
				var uo = { id: '', type: '', name: '', cradType: '', idCrad: '', phone: '', organizationType: '', cradTypeDsc: '' }
				uo.id = array[index].id
				if (this.basicData.prodCode === 'ysf') {
					uo.type = array[index].roleCode === 'cmr' ? '卖方' : '买方'
				} else {
					if (this.basicData.businessType === 6 || this.basicData.businessType === 7) {
						uo.type = array[index].roleCode === 'lyzr' ? '立遗嘱人' : (array[index].roleCode === 'zbls' ? '主办律师' : '协办律师/助理')
					} else {
						uo.type = array[index].proposerTypeDesc
					}
				}

				if (parseInt(array[index].organizationType) === 0) {
					uo.organizationType = array[index].organizationType
					uo.name = array[index].realName
					uo.cradType = array[index].cardType
					uo.cradTypeDsc = array[index].cardTypeDesc
					uo.idCrad = array[index].cardNum
					uo.phone = array[index].mobile
					if (parseInt(array[index].proposerType) === 0 && (array[index].roleCode !== 'zbls' && array[index].roleCode !== 'xbls')) {
						t++
						if (t === 1) {
							list.unshift(uo)
						} else {
							list.push(uo)
						}
					} else {
						list.push(uo)
					}
				} else {
					if (parseInt(array[index].proposerType) === 0) {
						uo.organizationType = array[index].organizationType
						uo.name = array[index].organizationName
						uo.cradType = array[index].organizationCardType
						uo.idCrad = array[index].organizationCardNum
						uo.phone = array[index].organizationPhone
						uo.cradTypeDsc = array[index].cardTypeDesc
						list.unshift(uo)
					} else {
						uo.organizationType = 0
						uo.name = array[index].realName
						uo.cradType = array[index].cardType
						uo.idCrad = array[index].cardNum
						uo.phone = array[index].mobile
						uo.cradTypeDsc = array[index].cardTypeDesc
						list.push(uo)
					}
				}
			}
			return list
		},

		compileInfo(val) {
			var data = { orderProposeId: val.id }
			getProposeDateailInfo(data).then((res) => {
				res.data.enterpriseModelAddres = []
				if (res.data.gender !== null) {
					res.data.gender = res.data.gender.toString()
				} else {
					res.data.gender = ''
				}

				this.partiesInfo = res.data

				var modeAddress = []
				if (
					res.data.province != null &&
					res.data.city !== null &&
					res.data.county !== null
				) {
					modeAddress.push(res.data.province)
					modeAddress.push(res.data.city)
					modeAddress.push(res.data.county)
				}
				var enterpriseModelAddres = []
				if (
					res.data.organizationProvince != null &&
					res.data.organizationCity !== null &&
					res.data.organizationCounty !== null
				) {
					enterpriseModelAddres.push(res.data.organizationProvince)
					enterpriseModelAddres.push(res.data.organizationCity)
					enterpriseModelAddres.push(res.data.organizationCounty)
				}
				this.partiesInfo.enterpriseModelAddres = enterpriseModelAddres
				this.partiesInfo.modeAddress = modeAddress
				if (this.basicData.prodCode === 'ysf') {
					newHouse.getUrbanAreaTree().then(res => {
						if (res.success) {
							this.cityArr = res.data[0].children
							this.operatingType = 'edit'
							this.newPersoneDialogVisible = true
						}
					})
				} else {
					getCityData().then((res) => {
						this.options = res.data[0].children
						if (this.basicData.businessType === 6 || this.basicData.businessType === 7) {
							const code = val.type === '立遗嘱人' ? 'lyzr' : (val.type === '协办律师' ? 'xbls' : 'zbls')
							this.$axios(`org/org-production-role-cert/by-role-code/${this.basicData.prodCode}/${this.basicData.orgId}/${code}`).then(res => {
								const arr = []
								for (let index = 0; index < res.data.length; index++) {
									const obj = { value: res.data[index].certCode, label: res.data[index].certName }
									arr.push(obj)
									this.cardType = arr
								}
							})
						}
						this.compileParties = true
					})
				}
			})
		},
		handleChangeEnterprise() {
			this.partiesInfo.organizationProvince = this.partiesInfo.enterpriseModelAddres[0]
			this.partiesInfo.organizationCity = this.partiesInfo.enterpriseModelAddres[1]
			this.partiesInfo.organizationCounty = this.partiesInfo.enterpriseModelAddres[2]
		},
		handleChangePersonageAddres() {
			this.partiesInfo.province = this.partiesInfo.modeAddress[0]
			this.partiesInfo.county = this.partiesInfo.modeAddress[2]
			this.partiesInfo.city = this.partiesInfo.modeAddress[1]
		},
		// 保存当事人信息
		savePartiesInfo() {
			// console.log(this.partiesInfo.organizationType)
			this.$confirm('<div">更改当事人信息需要<b>重新生成公证文书、公证书证词及重新审核合同类文书</b>,确定继续操作？</div>', '重要提示', {
				dangerouslyUseHTMLString: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				customClass: 'confirm__Class', // 需要写在没有scope的style里面才会生效
			}).then(() => {
				var p1 = new Promise((resolve, reject) => {
					this.$refs['personage'].validate((valid, obj) => {
						if (valid) {
							resolve(true)
						} else {
							reject(false)
						}
					})
				})
				if (this.partiesInfo.organizationType === 0 || this.partiesInfo.organizationType === null) {
					Promise.all([p1]).then((res) => {
						this.Submitodification()
					})
				} else {
					var p2 = new Promise((resolve, reject) => {
						this.$refs['enterprise'].validate((valid, obj) => {
							if (valid) {
								resolve(true)
							} else {
								reject(false)
							}
						})
					})
					Promise.all([p1, p2]).then((res) => {
						this.Submitodification()
					})
				}
			}).catch(() => {
				console.log("cancle");
			})
		},
		Submitodification() {
			var data = JSON.parse(JSON.stringify(this.partiesInfo))

			if (this.partiesInfo.modeAddress.length > 0) {
				data.detailAddress = this.partiesInfo.modeAddress ? (this.partiesInfo.modeAddress.length === 3 ? this.partiesInfo.modeAddress[0] + this.partiesInfo.modeAddress[1] + this.partiesInfo.modeAddress[2] + this.partiesInfo.detailAddress : this.partiesInfo.modeAddress[0] + this.partiesInfo.modeAddress[1] + this.partiesInfo.detailAddress) : ''
				if (this.partiesInfo.enterpriseModelAddres.indexOf(null) < 0) {
					var tu = this.partiesInfo.enterpriseModelAddres ? (this.partiesInfo.enterpriseModelAddres.length === 3 ? this.partiesInfo.enterpriseModelAddres[0] + this.partiesInfo.enterpriseModelAddres[1] + this.partiesInfo.enterpriseModelAddres[2] : this.partiesInfo.enterpriseModelAddres[0] + this.partiesInfo.enterpriseModelAddres[1]) : ''

					data.organizationAddress = tu + data.organizationDetailAddress
				}
			}
			modificationPartiesInfo(data).then((res) => {
				if (res.success) {
					if (this.basicData.businessType === 11) {	// 人防车位
						this.paparkingSpaceReplaceVariable()
					} else {
						this.$fun.replaceInstrument(this.orderId)
					}
				}
			})
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
					this.$router.go(0)
				}
			}
		},
		compileCost() {
			this.multipleCostFromData = JSON.parse(JSON.stringify(this.multipleCost))
			this.costDialogVisible = true
			const form = this.basicData.businessType === 6 || this.basicData.businessType === 7 ? 'multipCostForm' : 'costForm'
			this.$nextTick(() => {
				this.$refs[form].clearValidate()
			})
		},
		costDataSubmit() {
			if (this.basicData.businessType === 6 || this.basicData.businessType === 7) {
				this.$refs['multipCostForm'].validate((valid, obj) => {
					if (valid) {
						const data = this.multipleCostFromData.orgNotaryInfoDTOList
						for (let index = 0; index < data.length; index++) {
							data[index].notaryTotalCost = parseFloat(data[index].notaryCost) + parseFloat(data[index].transCost) + parseFloat(data[index].transTextCost) + parseFloat(data[index].copyCost)
							data[index].itemTotal = parseFloat(data[index].notaryCost) + parseFloat(data[index].transCost) + parseFloat(data[index].transTextCost) + parseFloat(data[index].copyCost)
							data[index].cost = data[index].notaryCost
							data[index].itemTotal = parseFloat(data[index].notaryCost) + parseFloat(data[index].transCost) + parseFloat(data[index].transTextCost) + parseFloat(data[index].copyCost)
						}
						this.$axios(`org/order-notary-costs-detail`, data, { method: 'PUT' }).then(res => {
							this.$router.go(0)
						})
					}
				})
			} else {
				this.$refs['costForm'].validate((valid, obj) => {
					if (valid) {
						var data = {
							id: this.costData.orderNotaryCostDetailDTO.id,
							orderNotaryId: this.costData.orderNotaryCostDetailDTO.orderNotaryId,
							orderId: this.orderId,
							costType: this.costData.orderNotaryCostDetailDTO.costType,
							costPrice: this.costData.orderNotaryCostDetailDTO.costPrice,
							copyCost: this.formLabelAlign.subheadCost,
							transCost: this.formLabelAlign.notaryTranslateCost,
							transTextCost: this.formLabelAlign.fileTranslateCost,
							notaryNum: this.basicData.businessType === 4 || this.basicData.prodCode === 'ysf' || this.basicData.businessType === 11 ? this.formLabelAlign.num : this.LGdata.num,
							cost: this.basicData.businessType === 4 || this.basicData.prodCode === 'ysf' || this.basicData.businessType === 11 ? this.formLabelAlign.notaryCost : this.LGdata.notaryCost
						}
						modificationCostInfo(data).then((res) => {
							if (res.success) {
								// this.$router.go(0)
								if (this.basicData.businessType === 5) {
									this.$router.go(0)
								} else {
									if (this.basicData.businessType === 11) {	// 人防车位
										this.paparkingSpaceReplaceVariable()
									} else {
										this.$fun.replaceInstrument(this.orderId)
									}
								}
							}
						})
					}
				})
			}
		},
		deleteProposer(val) {
			// this.$confirm('确定删除该当事人？', '提示', {
			//   confirmButtonText: '确定',
			//   cancelButtonText: '取消',
			//   type: 'warning'
			// }).then(() => {
			//   newHouse.deleteProposer({ orderProposerId: val.id }).then(res => {
			//     if (res.success) {
			//       this.$message({ type: 'success', message: '删除关系人成功' })
			//       this.$fun.replaceInstrument(this.orderId)
			//     }
			//   })
			// }).catch(() => {
			//   this.$message({
			//     type: 'info',
			//     message: '已取消删除'
			//   })
			// })

			const h = this.$createElement
			const that = this
			this.$msgbox({
				title: '',
				message: h('p', null, [
					h('span', null, '确定删除该当事人？ '),
					h('p', { style: 'color: #E6A23C' }, '删除后，无法恢复')
				]),
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				beforeClose: (action, instance, done) => {
					if (action === 'confirm') {
						newHouse.deleteProposer({ orderProposerId: val.id }).then(res => {
							if (res.success) {
								that.$message({ type: 'success', message: '删除关系人成功' })
								if (that.basicData.businessType === 11) {	// 人防车位
									that.paparkingSpaceReplaceVariable()
								} else {
									that.$fun.replaceInstrument(that.orderId)
								}
							}
						})
					} else {
						done()
					}
				}
			}).then(action => {
				this.$message({
					type: 'info',
					message: 'action: ' + action
				})
			}).catch(() => { })
		},
		payQrCode() {
			newHouse.getOrderPayQrCode({ orderId: this.orderId }).then(res => {
				this.payQrCodeShow = res.data ? 'data:image/jpeg;base64,' + res.data.qrCodeFile : null
				this.qrcodeDialogVisible = true
			})
		},
		upLoaQRCode(e) {
			const file = e.file
			this.qrCodeFromData.append('file', file)
			const URL = window.URL || window.webkitURL
			this.payQrCodeShow = URL.createObjectURL(file)
		},
		determineUpload() {
			const data = {
				orderId: this.orderId,
				formData: this.qrCodeFromData
			}
			newHouse.uploadPaymentQrCode(data).then(res => {
				if (res.success) {
					this.$message({ type: 'success', message: '上传成功' })
					this.qrCodeFromData.delete('file')
				}
			})
		},
		beforeUpload(e) {
			this.fileList = []
			if (this.getFileType(e.name) !== 'image') {
				this.$message.error('上传的文件只能为图片格式。')
				return false
			}
		},
		getFileType(fileName) {
			// 后缀获取
			let suffix = ''
			// 获取类型结果
			let result = ''
			try {
				const flieArr = fileName.split('.')
				suffix = flieArr[flieArr.length - 1]
			} catch (err) {
				suffix = ''
			}
			// fileName无后缀返回 false
			if (!suffix) {
				return false
			}
			suffix = suffix.toLocaleLowerCase()
			// 图片格式
			const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif']
			// 进行图片匹配
			result = imglist.find((item) => item === suffix)
			if (result) {
				return 'image'
			}
			// 匹配txt
			const txtlist = ['txt']
			result = txtlist.find((item) => item === suffix)
			if (result) {
				return 'txt'
			}
			// 匹配 excel
			const excelist = ['xls', 'xlsx']
			result = excelist.find((item) => item === suffix)
			if (result) {
				return 'excel'
			}
			// 匹配 word
			const wordlist = ['doc', 'docx']
			result = wordlist.find((item) => item === suffix)
			if (result) {
				return 'word'
			}
			// 匹配 pdf
			const pdflist = ['pdf']
			result = pdflist.find((item) => item === suffix)
			if (result) {
				return 'pdf'
			}
			// 匹配 ppt
			const pptlist = ['ppt', 'pptx']
			result = pptlist.find((item) => item === suffix)
			if (result) {
				return 'ppt'
			}
			// 匹配 视频
			const videolist = [
				'mp4',
				'm2v',
				'mkv',
				'rmvb',
				'wmv',
				'avi',
				'flv',
				'mov',
				'm4v'
			]
			result = videolist.find((item) => item === suffix)
			if (result) {
				return 'video'
			}
			// 匹配 音频
			const radiolist = ['mp3', 'wav', 'wmv']
			result = radiolist.find((item) => item === suffix)
			if (result) {
				return 'radio'
			}
			// 其他 文件类型
			return 'other'
		},
		newPersone() {
			this.operatingType = 'add'
			newHouse.getUrbanAreaTree().then(res => {
				if (res.success) {
					this.cityArr = res.data[0].children
					this.newPersoneDialogVisible = true
					// this.$nextTick(() => {
					//   this.$refs.newRelationalruleForm.resetForm()
					// })
				}
			})
		},
		confirmNew() {
			// console.log(this.$refs.newRelationalruleForm.verifyForm())
			this.$refs.newRelationalruleForm.verifyForm()
		}
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
.parties-info {
	h3 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
		padding-left: 10px;
	}
	h3::before {
		content: "";
		width: 3px;
		height: 19px;
		background: #1989fa;
		position: absolute;
		left: 2px;
	}
	.parties-table {
		.el-table {
			.el-button {
				padding: 0;
			}
		}
	}
	.proposer {
		display: block;
		text-align: center;
		border-radius: 10px;
		width: 80%;
	}
	.cost-statistics {
		ul {
			display: flex;
			flex-flow: column;
			align-items: flex-end;
			padding: 10px 0;
			li {
				width: 17%;
				display: flex;
				span {
					line-height: 30px;
					display: block;
					white-space: nowrap;
				}
				.cost-title {
					color: #999;
					width: 120px;
					text-align: right;
				}
			}
			.cost-total {
				margin-top: 10px;
				width: 100%;
				background: #f2f2f2;
				display: flex;
				justify-content: flex-end;
				& > p {
					display: flex;
					width: 17%;
					span {
						line-height: 30px;
						display: block;
						white-space: nowrap;
					}
				}
			}
		}
	}
}
.compile-parties {
	.el-form {
		width: 70%;
		margin: auto;
		.el-form-item {
			display: flex;
			margin-bottom: 20px;
			/deep/ & > label {
				width: 100px;
			}
			/deep/ .el-form-item__content {
				flex: 1;
			}
		}
	}
	.el-dialog__wrapper {
		/deep/ .el-dialog__body {
			padding-bottom: 10px;
		}
	}
}
.cost-dialog {
	h3 {
		position: relative;
		margin-left: 20px;
	}
	h3::before {
		content: "";
		width: 3px;
		height: 19px;
		background: #1989fa;
		opacity: 1;
		left: -10px;
		position: absolute;
	}
	/deep/ .el-dialog__body {
		padding-right: 40px;
	}
	.el-form {
		display: flex;

		flex-wrap: wrap;
		.el-form-item {
			width: 50%;
		}
		.number {
			width: 100%;
		}
	}
	/deep/ label::before {
		display: none;
	}
}
.column-from {
	display: flex;
	flex-flow: column;
}
/deep/ .no-required {
	.el-form-item__label {
		padding-left: 10px;
	}
}
/deep/ .el-select,
/deep/ .el-date-editor,
/deep/ .el-cascader {
	width: 100%;
}
.multiple-cost-list {
	display: flex;
	flex-flow: column;
}
.cost-item {
	display: flex;
	flex-wrap: wrap;
	.el-form-item {
		width: 50%;
		display: flex;
		/deep/ .el-form-item__label {
			width: 160px;
		}
		/deep/ .el-form-item__content {
			flex: 1;
		}
	}
}
/deep/ .el-dialog__footer {
	padding-top: 20px;
}

.el-form-item__label {
	width: 100px !important;
}
.pay-qrcode-contractor {
	/deep/ .el-dialog__footer {
		.dialog-footer {
			display: flex;
			justify-content: flex-end;
			.upload-demo {
				margin-right: 40px;
			}
		}
	}
}
.qrcode-main {
	display: flex;
	justify-content: center;
	.qr-code-image {
		width: 300px;
		height: 300px;
		display: flex;
		justify-content: center;
		align-items: center;
		span {
			color: #999;
		}
	}
}
.avatar-uploader {
	width: 100%;
	height: 100%;
	/deep/ .el-upload {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #fbfdff;
		border: 1px dashed #c0ccda;
		border-radius: 6px;
	}
	/deep/ .el-upload:hover {
		border-color: #409eff;
	}
	.avatar-uploader-icon {
		padding: 10px;
		font-size: 40px;
		background: #409eff;
		border-radius: 50%;
		color: #fff;
		font-weight: bolder;
	}
}
.confirmation {
	background: #999;
	border-color: #999;
}
.confirmation:hover {
	background: #999;
	border-color: #999;
}
.el-message-box__message {
	& > p {
		span {
			position: relative;
			line-height: 30px;
		}
		span::before {
			content: "\e7a3";
			font-family: element-icons !important;
			font-size: 30px;
			position: relative;
			top: 5px;
			color: #e6a23c;
		}
		p {
			text-indent: 2em;
		}
	}
}
</style>
<style>
.confirm__Class {
	width: 450px;
}
</style>
