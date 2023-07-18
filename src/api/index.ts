import useAxiosApi from '/@/utils/useAxiosApi';

/**
 * 代理产品列表
 * @returns UseAxiosReturn
 */
export function agentProductList() {
  return useAxiosApi(`/rpt/agent/api/v1/productList`, {
    method: 'POST',
  });
}

/**
 * 代理人我的信息
 * @returns UseAxiosReturn
 */
export function agentMy(params) {
  return useAxiosApi(`/rpt/agent/api/v1/my`, {
    method: 'GET',
    params,
  });
}

/**
 * 可查看报告列表
 * @returns UseAxiosReturn
 */
export function agentReportList() {
  return useAxiosApi(`/rpt/agent/api/v1/reportList`, {
    method: 'POST',
  });
}

/**
 * 我的收益
 * @returns UseAxiosReturn
 */
export function agentIncome() {
  return useAxiosApi(`/rpt/agent/api/v1/income`, {
    method: 'GET',
  });
}

/**
 * 收益明细
 * @returns UseAxiosReturn
 */
export function agentIncomeDetail(params) {
  return useAxiosApi(`/rpt/agent/api/v1/incomeDetail`, {
    method: 'GET',
    params,
  });
}

/**
 * 更新代理产品信息
 * @returns UseAxiosReturn
 */
export function agentUpdateProduct(data) {
  return useAxiosApi(`/rpt/agent/api/v1/updateProduct`, {
    method: 'POST',
    data,
  });
}

/**
 * 注册代理
 * @returns UseAxiosReturn
 */
export function agentRegister(data) {
  return useAxiosApi(`/rpt/agent/api/v1/register`, {
    method: 'POST',
    data,
  });
}

/**
 * 获取产品价格
 * @returns UseAxiosReturn
 */
export function agentProductAmt(data) {
  return useAxiosApi(`/rpt/agent/api/v1/productAmt`, {
    method: 'POST',
    data,
  });
}

/**
 * 密码登陆
 * @returns UseAxiosReturn
 */
export function agentLoginByPwd(data) {
  return useAxiosApi(`/rpt/agent/api/v1/loginByPwd`, {
    method: 'POST',
    data,
  });
}

/**
 * 短信登陆
 * @returns UseAxiosReturn
 */
export function agentLoginBySms(data) {
  return useAxiosApi(`/rpt/agent/api/v1/loginBySms`, {
    method: 'POST',
    data,
  });
}

/**
 * 获取链接
 * @returns UseAxiosReturn
 */
export function agentPromoLink(params) {
  return useAxiosApi(`/rpt/agent/api/v1/promoLink`, {
    method: 'GET',
    params,
  });
}

/**
 * 下载报告
 * @returns UseAxiosReturn
 */
export function custReportDownload(data) {
  return useAxiosApi(`/rpt/cust/api/v1/report-download`, {
    method: 'POST',
    data,
    responseType: 'arraybuffer',
  });
}

/**
 * 共享报告
 * @returns UseAxiosReturn
 */
export function custReportShare(data) {
  return useAxiosApi(`/rpt/cust/api/v1/report-share`, {
    method: 'POST',
    data,
  });
}

/**
 * 失败报告重试
 * @returns UseAxiosReturn
 */
export function custReportRetry(params) {
  return useAxiosApi(`/rpt/cust/api/v1/report-retry`, {
    method: 'GET',
    params,
  });
}

/**
 * 客户短信登陆
 * @returns UseAxiosReturn
 */
export function custLoginBySms(data) {
  return useAxiosApi(`/rpt/cust/api/v1/loginBySms`, {
    method: 'POST',
    data,
  });
}

/**
 * 查询用户申请记录列表
 * @returns UseAxiosReturn
 */
export function custApplyList() {
  return useAxiosApi(`/rpt/cust/api/v1/apply-List`, {
    method: 'GET',
  });
}

/**
 * 查询用户申请记录状态
 * @returns UseAxiosReturn
 */
export function custApplyDetail(params) {
  return useAxiosApi(`/rpt/cust/api/v1/apply-detail`, {
    method: 'GET',
    params,
  });
}

/**
 * 用户获取报告
 * @returns UseAxiosReturn
 */
export function custReport(data) {
  return useAxiosApi(`/rpt/cust/api/v1/report`, {
    method: 'POST',
    data,
  });
}

/**
 * 预览报告
 * @returns UseAxiosReturn
 */
export function custReportView(data) {
  return useAxiosApi(`/rpt/cust/api/v1/report-view`, {
    method: 'POST',
    data,
  });
}

/**
 * 获取验证码
 * @returns UseAxiosReturn
 */
export function getSmsCode(data) {
  return useAxiosApi(`/common/getSmsCode`, {
    method: 'POST',
    data,
  });
}

/**
 * 客服信息
 * @returns UseAxiosReturn
 */
export function customerService() {
  return useAxiosApi(`/common/customerService`, {
    method: 'GET',
  });
}

/**
 * 代理状态
 * @returns UseAxiosReturn
 */
export function agentStatus() {
  return useAxiosApi(`/rpt/agent/api/v1/agentStatus`, {
    method: 'GET',
  });
}

/**
 * 代理状态
 * @returns UseAxiosReturn
 */
export function agentOrderList() {
  return useAxiosApi(`/rpt/agent/api/v1/orderList`, {
    method: 'POST',
  });
}

/**
 * binding
 * @returns UseAxiosReturn
 */
export function wechatBinding(data) {
  return useAxiosApi(`/api/wechat/binding`, {
    method: 'POST',
    data,
  });
}

/**
 * binding
 * @returns UseAxiosReturn
 */
export function getAgentInfo(params) {
  return useAxiosApi(`/rpt/agent/api/v1/agentInfo`, {
    method: 'GET',
    params,
  });
}
