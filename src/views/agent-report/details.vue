<template>
  <div class="agent-report-details">
    <div class="header"><div class="p1">您的评分指数</div><div class="div1"> 10 </div></div>

    <div class="score">
      <div class="basic_info">
        <span>评分解读</span>
      </div>
      <div class="score_tab">
        <div class="score_tab_div" style="color: rgb(255, 106, 0)"><div>0 ~ 20</div><div>极差</div></div
        ><div class="score_tab_div" style="color: rgb(82, 168, 255)"><div>20 ~ 40</div><div>较差</div></div
        ><div class="score_tab_div" style="color: rgb(82, 168, 255)"><div>40 ~ 60</div><div>一般</div></div
        ><div class="score_tab_div" style="color: rgb(82, 168, 255)"><div>60 ~ 80</div><div>良好</div></div
        ><div class="score_tab_div" style="color: rgb(82, 168, 255)"><div>80 ~ 100</div><div>优秀</div></div></div
      ><div class="score_p"
        >评分仅供参考，分数越低信用越好0（通过）80（拒绝）0&lt值&lt80（复议）。本报告包含身 份校验、借贷风险、失信等多个维度，是根据网络行为综合评估的，不包含个人隐私爬虫数据。</div
      ></div
    >

    <div class="score">
      <div class="basic_info">
        <span>基本信息</span>
      </div>
      <div class="person"
        ><div><img src="../../assets/user.png" alt="" />张三 35岁 男</div><div><img src="../../assets/phone.png" alt="" />185****4715</div
        ><div>身份证号：47154********5478</div><div>身份证归属地：湖北武汉</div><div>报告生成时间：2019-10-18 14:33:44</div
        ><div>报告失效时间：2019-10-23 14:33:44</div></div
      >
    </div>

    <div class="title"
      ><img src="../../assets/title-left.png" alt="" /><span>多头申请数据</span><img src="../../assets/title-right.png" alt=""
    /></div>

    <div class="echarts"><div class="title_p">多头数据走势</div></div>

    <div class="basic_info1"><span>多头借贷次数</span></div>

    <div class="bank"
      ><div class="bank_p">银行类机构申请次数汇总(次)</div
      ><div class="bank_tab"
        ><div class="bank_tab_box"><div>2</div><div>近15天</div></div
        ><div class="bank_tab_box"><div>4</div><div>近1个月</div></div
        ><div class="bank_tab_box"><div>5</div><div>近3个月</div></div
        ><div class="bank_tab_box"><div>6</div><div>近6个月</div></div
        ><div class="bank_tab_box"><div>7</div><div>近12个月</div></div></div
      ><div class="bank_p">非银行类机构申请次数汇总(次)</div
      ><div class="bank_tab"
        ><div class="bank_tab_box"><div>9</div><div>近15天</div></div
        ><div class="bank_tab_box"><div>11</div><div>近1个月</div></div
        ><div class="bank_tab_box"><div>35</div><div>近3个月</div></div
        ><div class="bank_tab_box"><div>39</div><div>近6个月</div></div
        ><div class="bank_tab_box"><div>45</div><div>近12个月</div></div></div
      ></div
    >

    <div class="tabbox"
      ><div class="tabbox-div"
        ><div class="pactive">近15天</div><div class="">近1个月</div><div class="">近3个月</div><div class="">近6个月</div
        ><div class="">近12个月</div></div
      ><div class="banking"
        ><div class="titles">银行类</div><div><span>传统银行</span><span>2</span></div
        ><div><span>网络零售银行</span><span>0</span></div
        ><div class="titles">非银行类</div><div><span>p2p机构</span><span>1</span></div
        ><div><span>小贷机构</span><span>3</span></div
        ><div><span>现金类分期</span><span>2</span></div
        ><div><span>消费类分期</span><span>1</span></div
        ><div><span>代偿类分期</span><span>1</span></div
        ><div><span>其他</span><span>0</span></div></div
      ></div
    >

    <div class="bluRay2"><span>多头借贷机构数</span></div>

    <div class="bank banks"
      ><div class="bank_p">银行类机构申请次数汇总(次)</div
      ><div class="bank_tab"
        ><div class="bank_tab_box"><div>2</div><div>近15天</div></div
        ><div class="bank_tab_box"><div>4</div><div>近1个月</div></div
        ><div class="bank_tab_box"><div>5</div><div>近3个月</div></div
        ><div class="bank_tab_box"><div>6</div><div>近6个月</div></div
        ><div class="bank_tab_box"><div>7</div><div>近12个月</div></div></div
      ><div class="bank_p">非银行类机构申请次数汇总(次)</div
      ><div class="bank_tab"
        ><div class="bank_tab_box"><div>9</div><div>近15天</div></div
        ><div class="bank_tab_box"><div>11</div><div>近1个月</div></div
        ><div class="bank_tab_box"><div>35</div><div>近3个月</div></div
        ><div class="bank_tab_box"><div>39</div><div>近6个月</div></div
        ><div class="bank_tab_box"><div>45</div><div>近12个月</div></div></div
      ></div
    >

    <div class="tabbox"
      ><div class="tabbox-div tabbox-divs"
        ><div class="pactive">近15天</div><div class="">近1个月</div><div class="">近3个月</div><div class="">近6个月</div
        ><div class="">近12个月</div></div
      ><div class="banking"
        ><div class="titles">银行类</div><div><span>传统银行</span><span>2</span></div
        ><div><span>网络零售银行</span><span>0</span></div
        ><div class="titles">非银行类</div><div><span>p2p机构</span><span>1</span></div
        ><div><span>小贷机构</span><span>3</span></div
        ><div><span>现金类分期</span><span>2</span></div
        ><div><span>消费类分期</span><span>1</span></div
        ><div><span>代偿类分期</span><span>1</span></div
        ><div><span>其他</span><span>0</span></div></div
      ></div
    >

    <div class="basic_info1"><span>多头借贷异常时间段</span></div>
    <div class="duotoutable"
      ><div class="duotoutable-p">次数</div
      ><table border="1"
        ><tr><td></td><td>近15天</td><td>近1个月</td><td>近3个月</td><td>近6个月</td><td>近12个月</td></tr
        ><tr
          ><td>夜间-银行</td><td style="color: rgb(242, 83, 57)">0</td><td style="color: rgb(242, 83, 57)">0</td
          ><td style="color: rgb(242, 83, 57)">0</td><td style="color: rgb(242, 83, 57)">0</td
          ><td style="color: rgb(242, 83, 57)">0</td></tr
        ><tr
          ><td>夜间-非银</td><td style="color: rgb(242, 83, 57)">0</td><td style="color: rgb(242, 83, 57)">0</td
          ><td style="color: rgb(242, 83, 57)">0</td><td style="color: rgb(242, 83, 57)">0</td
          ><td style="color: rgb(242, 83, 57)">0</td></tr
        ><tr
          ><td>周末-银行</td><td style="color: rgb(242, 83, 57)">0</td><td style="color: rgb(242, 83, 57)">0</td
          ><td style="color: rgb(242, 83, 57)">0</td><td style="color: rgb(242, 83, 57)">0</td
          ><td style="color: rgb(242, 83, 57)">0</td></tr
        ><tr
          ><td>周末-非银</td><td style="color: rgb(242, 83, 57)">0</td><td style="color: rgb(242, 83, 57)">0</td
          ><td style="color: rgb(242, 83, 57)">1</td><td style="color: rgb(242, 83, 57)">2</td
          ><td style="color: rgb(242, 83, 57)">3</td></tr
        ></table
      ></div
    >
    <div class="duotoutable" style="margin-bottom: 0"
      ><div class="duotoutable-p">机构数</div
      ><table border="1"
        ><tr><td></td><td>近15天</td><td>近1个月</td><td>近3个月</td><td>近6个月</td><td>近12个月</td></tr
        ><tr
          ><td>夜间-银行</td><td style="color: rgb(242, 83, 57)">0</td><td style="color: rgb(242, 83, 57)">0</td
          ><td style="color: rgb(242, 83, 57)">0</td><td style="color: rgb(242, 83, 57)">0</td
          ><td style="color: rgb(242, 83, 57)">0</td></tr
        ><tr
          ><td>夜间-非银</td><td style="color: rgb(242, 83, 57)">0</td><td style="color: rgb(242, 83, 57)">0</td
          ><td style="color: rgb(242, 83, 57)">0</td><td style="color: rgb(242, 83, 57)">0</td
          ><td style="color: rgb(242, 83, 57)">0</td></tr
        ><tr
          ><td>周末-银行</td><td style="color: rgb(242, 83, 57)">0</td><td style="color: rgb(242, 83, 57)">0</td
          ><td style="color: rgb(242, 83, 57)">0</td><td style="color: rgb(242, 83, 57)">0</td
          ><td style="color: rgb(242, 83, 57)">0</td></tr
        ><tr
          ><td>周末-非银</td><td style="color: rgb(242, 83, 57)">0</td><td style="color: rgb(242, 83, 57)">0</td
          ><td style="color: rgb(242, 83, 57)">1</td><td style="color: rgb(242, 83, 57)">2</td
          ><td style="color: rgb(242, 83, 57)">3</td></tr
        ></table
      ></div
    >

    <div class="bluRay2"><span>高风险命中查询</span></div>

    <div class="highRisk"
      ><div class="ovps"><span>银行及法院类高风险</span></div
      ><div class="hrbox"
        ><div class="hrboxp1"
          ><span>银行高风险 <span style="font-style: italic; margin-left: 20px">否</span></span
          ><span style="color: rgb(221, 82, 77); font-size: 12px">命中风险：0</span></div
        ></div
      ><div class="hrbox"
        ><div class="hrboxp1"
          ><span>法院失信人<span style="font-style: italic; margin-left: 20px">否</span></span
          ><span style="color: rgb(221, 82, 77); font-size: 12px">命中风险：0</span></div
        ></div
      ><div class="hrbox"
        ><div class="hrboxp1"
          ><span>法院被执行人<span style="font-style: italic; margin-left: 20px">否</span></span
          ><span style="color: rgb(221, 82, 77); font-size: 12px">命中风险：0</span></div
        ></div
      ></div
    >

    <div class="highRisk" style="margin-bottom: 0"
      ><div class="ovps"><span>非银类高风险</span></div
      ><div class="hrbox"
        ><div class="hrboxp1"
          ><span>持牌网络小贷高风险 <span style="font-style: italic; margin-left: 20px">否</span></span
          ><span style="color: rgb(221, 82, 77); font-size: 12px">命中风险：0</span></div
        ></div
      ><div class="hrbox"
        ><div class="hrboxp1"
          ><span>持牌小贷高风险<span style="font-style: italic; margin-left: 20px">否</span></span
          ><span style="color: rgb(221, 82, 77); font-size: 12px">命中风险：0</span></div
        ></div
      ><div class="hrbox"
        ><div class="hrboxp1"
          ><span>持牌消费金融高风险<span style="font-style: italic; margin-left: 20px">否</span></span
          ><span style="color: rgb(221, 82, 77); font-size: 12px">命中风险：0</span></div
        ></div
      ><div class="hrbox"
        ><div class="hrboxp1"
          ><span>持牌融资租赁高风险 <span style="font-style: italic; margin-left: 20px">否</span></span
          ><span style="color: rgb(221, 82, 77); font-size: 12px">命中风险：0</span></div
        ></div
      ><div class="hrbox"
        ><div class="hrboxp1"
          ><span>持牌汽车金融高风险<span style="font-style: italic; margin-left: 20px">否</span></span
          ><span style="color: rgb(221, 82, 77); font-size: 12px">命中风险：0</span></div
        ></div
      ><div class="hrbox"
        ><div class="hrboxp1"
          ><span>其他高风险<span style="font-style: italic; margin-left: 20px">否</span></span
          ><span style="color: rgb(221, 82, 77); font-size: 12px">命中风险：0</span></div
        ></div
      ></div
    >

    <div class="bluRay2"><span>借贷风险勘测</span></div>

    <div class="duotoutable mid"
      ><div class="duotoutable-p">基础信息命中详情</div
      ><table border="1"
        ><tr><td>命中借贷风险勘测信息</td><td>按身份证号查询</td><td>按身份证号查询 按手机号查询</td></tr
        ><tr><td>最近申请距今天数</td><td style="color: rgb(242, 83, 57)">0</td><td style="color: rgb(242, 83, 57)">0</td></tr
        ><tr><td>最早申请距今天数</td><td style="color: rgb(242, 83, 57)">0</td><td style="color: rgb(242, 83, 57)">0</td></tr></table
      ></div
    >

    <div class="duotoutable big" style="margin-bottom: 0"
      ><div class="duotoutable-p">机构数、次数命中详情</div
      ><table border="1"
        ><tr
          ><td>命中借贷风险勘 测信息</td><td>近7天</td><td>近15天</td><td>近1个月</td><td>近3个月</td><td>近6个月</td><td>近12个月</td
          ><td>近12个月</td><td>1 年以前</td></tr
        ><tr
          ><td>身份证号查询的 申请次数</td><td style="color: rgb(242, 83, 57)">0</td><td style="color: rgb(242, 83, 57)">0</td
          ><td style="color: rgb(242, 83, 57)">0</td><td style="color: rgb(242, 83, 57)">0</td><td style="color: rgb(242, 83, 57)">0</td
          ><td style="color: rgb(242, 83, 57)">0</td><td style="color: rgb(242, 83, 57)">0</td
          ><td style="color: rgb(242, 83, 57)">0</td></tr
        ><tr
          ><td>身份证号查询的 申请机构数</td><td style="color: rgb(242, 83, 57)">0</td><td style="color: rgb(242, 83, 57)">0</td
          ><td style="color: rgb(242, 83, 57)">0</td><td style="color: rgb(242, 83, 57)">0</td><td style="color: rgb(242, 83, 57)">0</td
          ><td style="color: rgb(242, 83, 57)">0</td><td style="color: rgb(242, 83, 57)">0</td
          ><td style="color: rgb(242, 83, 57)">0</td></tr
        ></table
      ></div
    >

    <div class="highRisk" style="margin-bottom: 0"
      ><div class="ovps"><span>风险预警</span></div
      ><div class="hrbox"
        ><div class="hrboxp1"><span>在非银机构申请次数较多</span><span style="color: rgb(221, 82, 77); font-size: 12px">0</span></div></div
      ><div class="hrbox"
        ><div class="hrboxp1"><span>在非银机构申请次数极多</span><span style="color: rgb(221, 82, 77); font-size: 12px">0</span></div></div
      ><div class="hrbox"
        ><div class="hrboxp1"><span>在银行机构申请次数较多</span><span style="color: rgb(221, 82, 77); font-size: 12px">0</span></div></div
      ><div class="hrbox"
        ><div class="hrboxp1"><span>在银行机构申请次数极多</span><span style="color: rgb(221, 82, 77); font-size: 12px">0</span></div></div
      ><div class="hrbox"
        ><div class="hrboxp1"><span>近两年命中银行高风险</span><span style="color: rgb(221, 82, 77); font-size: 12px">0</span></div></div
      ><div class="hrbox"
        ><div class="hrboxp1"><span>两年前命中银行高风险</span><span style="color: rgb(221, 82, 77); font-size: 12px">0</span></div></div
      ><div class="hrbox"
        ><div class="hrboxp1"><span>近两年命中银行中风险</span><span style="color: rgb(221, 82, 77); font-size: 12px">0</span></div></div
      ><div class="hrbox"
        ><div class="hrboxp1"><span>两年前命中银行中风险</span><span style="color: rgb(221, 82, 77); font-size: 12px">0</span></div></div
      ><div class="hrbox"
        ><div class="hrboxp1"><span>近两年命中银行一般风险</span><span style="color: rgb(221, 82, 77); font-size: 12px">0</span></div></div
      ><div class="hrbox"
        ><div class="hrboxp1"
          ><span>命中非银一般风险次数较多</span><span style="color: rgb(221, 82, 77); font-size: 12px">0</span></div
        ></div
      ><div class="hrbox"
        ><div class="hrboxp1"><span>为法院失信被执行人</span><span style="color: rgb(221, 82, 77); font-size: 12px">0</span></div></div
      ></div
    >

    <div class="basic_info1"><span>失信情况总览</span></div>

    <div class="overview"
      ><p class="ovp"><span>失信被执行人</span></p
      ><div class="implement_info"><span>张三</span><span>47154********5478</span></div
      ><p class="listp"><span class="listp_l">执行案号：</span><span class="listp_r">（2016）安执字第00175号</span></p
      ><p class="listp"><span class="listp_l">立案时间</span><span class="listp_r">2016年04月05日</span></p
      ><p class="listp"><span class="listp_l">发布时间</span><span class="listp_r">2016年08月19日</span></p
      ><p class="listp"><span class="listp_l">执行法院</span><span class="listp_r">游仙区人民法院</span></p
      ><p class="listp"><span class="listp_l">做出执行依据单位：</span><span class="listp_r">游仙区人民法院</span></p
      ><p class="listp"><span class="listp_l">失信案件执行依据文号:</span><span class="listp_r">（2018）安执字第00175号</span></p
      ><p class="listp"><span class="listp_l">被执行人的履行情况：</span><span class="listp_r">全部未履行</span></p
      ><p class="listp"
        ><span class="listp_l">生效法律文书确定的义务：</span
        ><span class="listp_r">其他有履行能力而拒不履<br />行生效法律文书确定义务</span></p
      ><p class="listp"
        ><span class="listp_l">失信被执行人行为具体情形：</span
        ><span class="listp_r">其他有履行能力而拒不履<br />行生效法律文书确定义务</span></p
      ></div
    >

    <div class="overview"
      ><p class="ovp"><span>法院被执行人</span></p
      ><div class="implement_info"><span>张三</span><span>47154********5478</span></div
      ><p class="listp"><span class="listp_l">执行案号：</span><span class="listp_r">（2016）安执字第00175号</span></p
      ><p class="listp"><span class="listp_l">执行标的：</span><span class="listp_r">20000</span></p
      ><p class="listp"><span class="listp_l">立案时间</span><span class="listp_r">2016年04月05日</span></p
      ><p class="listp"><span class="listp_l">执行法院</span><span class="listp_r">游仙区人民法院</span></p
      ><p class="listp"><span class="listp_l">案件状态：</span><span class="listp_r">执行中</span></p
      ><div class="oneborders"></div><div class="implement_info"><span>张三</span><span>47154********5478</span></div
      ><p class="listp"><span class="listp_l">执行案号：</span><span class="listp_r">（2016）安执字第00175号</span></p
      ><p class="listp"><span class="listp_l">执行标的：</span><span class="listp_r">20000</span></p
      ><p class="listp"><span class="listp_l">立案时间</span><span class="listp_r">2016年04月05日</span></p
      ><p class="listp"><span class="listp_l">执行法院</span><span class="listp_r">游仙区人民法院</span></p
      ><p class="listp"><span class="listp_l">案件状态：</span><span class="listp_r">执行中</span></p></div
    >
  </div>
</template>

<script lang="ts" setup name="AgentReportDetailsPage"></script>

<style scoped lang="scss">
  p {
    margin: 0;
    padding: 0;
  }
  .agent-report-details {
    width: 100%;
    //height: 100%;
    background-color: #f5f5f5;
    padding-bottom: 24px;

    .header {
      width: 100%;
      height: 502px;
      background-image: linear-gradient(141deg, #9455b9 6%, #7266c3 52%, #5076cd), linear-gradient(#283094, #283094);
      background-blend-mode: normal, normal;
      display: flex;
      flex-direction: column;
      align-items: center;

      .p1 {
        font-size: 28px;
        color: #fff;
        line-height: 135px;
      }

      .div1 {
        width: 208px;
        height: 208px;
        text-align: center;
        line-height: 208px;
        color: #34a0ff;
        font-size: 68px;
        background-image: url(../../assets/top-img.png);
        background-position: 100% 100%;
        background-size: contain;
      }
    }

    .score {
      width: 92%;
      min-height: 460px;
      background: #fff;
      margin: -104px auto 135px;
      border-radius: 20px;
      font-size: 26px;
      box-sizing: border-box;
      overflow: hidden;

      .basic_info {
        display: inline-block;
        height: 55px;
        background: #ff7643;
        color: #fff;
        line-height: 56px;
        padding-left: 32px;
        margin-top: 49px;
        position: relative;
        font-size: 32px;

        span:after {
          content: '';
          width: 0;
          height: 0;
          border-width: 28px;
          border-style: solid;
          border-color: #ff7643 transparent #ff7643 #ff7643;
          position: absolute;
          top: 0;
        }
      }

      .score_tab {
        width: 100%;
        height: 124px;
        margin-top: 28px;
        display: flex;
        align-items: center;
        justify-content: space-evenly;

        .score_tab_div {
          display: flex;
          flex-direction: column;
          text-align: center;
          font-size: 28px;
        }
      }

      .score_p {
        font-size: 26px;
        width: 90%;
        margin: 36px auto 0;
      }

      .person {
        width: 90%;
        margin: 42px auto;
        padding-bottom: 20px;

        div {
          padding-bottom: 12px;
          display: flex;
          align-items: center;
        }

        img {
          width: 37px;
          margin-right: 10px;
        }
      }
    }

    .title {
      width: 100%;
      height: 68px;
      font-size: 40px;
      color: #0d92ff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: -90px auto 40px;
    }

    .echarts {
      width: 92%;
      height: 552px;
      background: #fff;
      border-radius: 20px;
      margin: 0 auto;
      padding: 20px;
      box-sizing: border-box;

      .title_p {
        width: 100%;
        height: 68px;
        font-size: 27px;
        line-height: 68px;
      }
    }

    .basic_info1 {
      display: inline-block;
      height: 55px;
      background: #ff7643;
      color: #fff;
      line-height: 56px;
      padding-left: 32px;
      position: relative;
      font-size: 32px;
      margin: 49px 0;

      span:after {
        content: '';
        width: 0;
        height: 0;
        border-width: 28px;
        border-style: solid;
        border-color: #ff7643 transparent #ff7643 #ff7643;
        position: absolute;
        top: 0;
      }
    }

    .bank {
      width: 92%;
      height: 416px;
      margin: 0 auto;
      border-radius: 20px;
      background-image: linear-gradient(-85deg, #f32121, #df823e), linear-gradient(#7c95d5, #7c95d5);
      background-blend-mode: normal, normal;
      opacity: 0.75;
      padding: 50px 20px 20px;
      box-sizing: border-box;

      &.banks {
        background-image: linear-gradient(88deg, #6680c3, #2252cb 99%), linear-gradient(#7c95d5, #7c95d5);
      }

      .bank_p {
        width: 100%;
        height: 32px;
        line-height: 32px;
        font-size: 32px;
        text-align: center;
        color: #fff;
      }
      .bank_tab {
        width: 100%;
        height: 104px;
        display: flex;
        font-size: 28px;
        align-items: center;
        justify-content: space-around;
        line-height: 42px;
        text-align: center;
        margin: 22px 0 32px 0;

        .bank_tab_box {
          div:first-child {
            color: #ffe241;
          }

          div:nth-child(2) {
            color: #fff;
          }
        }
      }
    }

    .tabbox {
      width: 92%;
      height: 860px;
      background: #fff;
      border-radius: 20px;
      margin: 42px auto 0;

      .tabbox-div {
        width: 92%;
        height: 52px;
        line-height: 52px;
        display: flex;
        justify-content: center;
        margin: 0 auto;
        padding: 20px 0;
        font-size: 24px;

        &.tabbox-divs {
          div {
            text-align: center;
            width: 124px;
            height: 42px;
            border: 1px solid #305bc9;
            color: #305bc9;
          }

          .pactive {
            color: #fff;
            background: #305bc9;
          }
        }

        div {
          text-align: center;
          width: 124px;
          height: 42px;
          border: 1px solid #ff7545;
          color: #ff7545;
        }

        .pactive {
          color: #fff;
          background: #ff7545;
        }
      }

      .banking {
        padding: 20px 42px;

        div {
          display: flex;
          justify-content: space-between;
          font-size: 27px;
          margin-bottom: 32px;
        }

        .titles {
          font-size: 32px;
          font-weight: 600;
        }
      }
    }

    .bluRay2 {
      display: inline-block;
      height: 56px;
      font-size: 32px;
      color: #fff;
      line-height: 56px;
      position: relative;
      background: #7c95d5;
      padding-left: 32px;
      margin: 52px 0;

      span {
        background-color: #7c95d5;
        padding: 0 12px 0 4px;
        display: inline-block;
        height: 55px;
        font-size: 32px;
        color: #fff;
        line-height: 56px;
        position: relative;

        &:after {
          content: '';
          width: 0;
          height: 0;
          border-width: 28px;
          border-style: solid;
          border-color: transparent transparent transparent #7c95d5;
          position: absolute;
          right: -55px;
          top: 0;
        }
      }
    }

    .duotoutable {
      width: 92%;
      height: 438px;
      border-radius: 20px;
      margin: 0 auto;
      background: #ff7643;
      margin-bottom: 42px;

      &.big {
        background-color: #7c95d5;
        height: 538px;

        table {
          height: 400px;
        }
      }

      &.mid {
        background-color: #7c95d5;
      }

      .duotoutable-p {
        width: 100%;
        height: 83px;
        line-height: 83px;
        text-align: center;
        color: #fff;
        font-size: 32px;
        font-weight: 600;
      }

      table {
        width: 92%;
        height: 300px;
        border: 1px solid #debfb1;
        margin: 0 auto;
        background: #fff;
        border-collapse: collapse;
        text-align: center;
        font-size: 24px;
      }
    }

    .highRisk {
      padding: 20px 20px 34px;
      box-sizing: border-box;
      width: 92%;
      min-height: 344px;
      background: #fff;
      margin: 0 auto;
      border-radius: 20px;
      margin-bottom: 42px;

      .ovps {
        width: 100%;
        min-height: 72px;
        font-size: 28px;
        line-height: 72px;

        span {
          width: 343px;
          display: flex;
          border-bottom: 1px solid #333;
        }
      }

      .hrbox {
        width: 100%;
        height: 38px;
        margin-top: 28px;

        .hrboxp1 {
          display: flex;
          justify-content: space-between;
          font-size: 26px;
        }

        .hrboxp2 {
          font-size: 22px;
          color: #85b3ff;
        }
      }
    }

    .overview {
      width: 92%;
      min-height: 692px;
      background: #fff;
      border-radius: 20px;
      margin: 0 auto;
      padding: 20px;
      box-sizing: border-box;
      margin-bottom: 40px;

      .ovp {
        width: 100%;
        min-height: 72px;
        font-size: 28px;
        line-height: 72px;

        span {
          width: 187px;
          display: flex;
          border-bottom: 1px solid #333;
        }
      }

      .implement_info {
        display: flex;
        margin-top: 25px;
        padding-bottom: 4px;

        span {
          display: block;
          background: #f59631;
          color: #fff;
          padding: 5px 30px;
          border-radius: 26px;
          margin-right: 20px;
          font-size: 28px;
        }
      }

      .listp {
        width: 100%;
        min-height: 42px;
        margin-top: 20px;
        font-size: 28px;
        display: flex;
        justify-content: space-between;

        .listp_l {
          color: #999;
        }

        .listp_r {
          color: #333;
        }
      }
    }
  }
</style>
