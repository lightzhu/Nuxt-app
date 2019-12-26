<template>
  <div ref="container" class="container">
    <Input
      :data-type="selected"
      :search-name="searchName"
      @doSearch="doSearch"
    />
    <el-radio-group v-model="selected">
      <div
        v-for="(item, index) in queryList"
        :key="index"
        class="search-item"
        @click="onChange(item)"
      >
        <el-radio :label="item.type">{{ item.name }}</el-radio>
      </div>
    </el-radio-group>
    <div class="table-box">
      <el-table
        ref="myTable"
        v-loadmore="loadMore"
        v-loading="listLoad"
        row-key="id"
        :max-height="tableHeight"
        :data="list"
        element-loading-text="加载中..."
        lazy
        border
        fit
        highlight-current-row
      >
        <template v-for="(value, key, index) in selectedItem">
          <el-table-column
            v-if="index === 0"
            :key="index"
            fixed
            :label="value"
            align="center"
            width="120"
          >
            <template slot-scope="scope">
              <span>{{ scope.row[key] ? scope.row[key] : '--' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="index"
            fixed
            :label="value"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row[key] ? scope.row[key] : '--' }}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script>
// import api from '@/api/index'
import Input from './Input'
export default {
  name: 'QueryIndex',
  components: { Input },
  data() {
    return {
      tableHeight: null,
      searchKey: '',
      searchName: '淘宝编码',
      listLoad: false,
      dataType: '1',
      pageNo: 0,
      hasNext: true,
      list: [],
      loadSuc: true,
      selected: '0',
      searchNum: '',
      queryList: [
        {
          name: '淘宝根据编码',
          label: '淘宝编码',
          type: '0'
        },
        {
          name: '淘宝根据手机号',
          label: '手机号',
          type: '1'
        },
        {
          name: '支付宝根据编码',
          label: '支付宝编码',
          type: '2'
        },
        {
          name: '支付宝根据手机号',
          label: '手机号',
          type: '3'
        },
        {
          name: '京东根据编码',
          label: '京东编码',
          type: '4'
        },
        {
          name: '京东根据订单号',
          label: '京东订单号',
          type: '5'
        },
        {
          name: '淘宝补贴根据编码',
          label: '淘宝补贴编码',
          type: '6'
        },
        {
          name: '码状态查询',
          label: '码状态查询',
          type: '7'
        },
        {
          name: '码状态查询',
          label: '码状态查询',
          type: '8'
        }
      ],
      headList: {
        '0': {
          orgName: '渠道',
          codeName: '二维码',
          mobile: '手机号',
          orderNo: '订单号',
          registerTime: '注册时间',
          bindTime: '激活时间',
          buyTime: '首购时间',
          bindCardTime: '绑卡时间'
        },
        '1': {
          orgName: '渠道',
          codeName: '二维码',
          mobile: '手机号',
          orderNo: '订单号',
          registerTime: '注册时间',
          bindTime: '激活时间',
          buyTime: '首购时间',
          bindCardTime: '绑卡时间'
        },
        '2': {
          orgName: '渠道',
          codeName: '二维码',
          mobile: '手机号',
          orderNo: '订单号',
          registerTime: '实名时间',
          bindTime: '领奖时间',
          buyTime: '绑卡时间',
          settled: '核销结算否',
          settledAndBind: '核销绑卡结算否'
        },
        '3': {
          orgName: '渠道',
          codeName: '二维码',
          mobile: '手机号',
          orderNo: '订单号',
          registerTime: '实名时间',
          bindTime: '领奖时间',
          buyTime: '绑卡时间',
          settled: '核销结算否',
          settledAndBind: '核销绑卡结算否'
        },
        '4': {
          channel: '渠道',
          subChannel: '子渠道',
          codeName: '二维码',
          orderId: '订单号',
          bizDate: '日期',
          orderTime: '下单时间',
          skuName: '商品名称',
          price: '单价',
          skuValidCode: '有效码',
          status: '是否结算'
        },
        '5': {
          channel: '渠道',
          subChannel: '子渠道',
          codeName: '二维码',
          orderId: '订单号',
          bizDate: '日期',
          orderTime: '下单时间',
          skuName: '商品名称',
          price: '单价',
          skuValidCode: '有效码',
          status: '是否结算'
        },
        '6': {
          orgName: '渠道',
          codeName: '二维码',
          bizDate: '日期',
          orderId: '订单号',
          price: '付款金额',
          title: '商品标题',
          orderRole: '是否红包'
        },
        // '7': {
        //   channel: '编码',
        //   subChannel: '子渠道',
        //   status: '状态',
        //   bizDate: '淘汰日期',
        //   reason: '淘汰原因'
        // },
        '8': {
          bizDate: '淘汰日期',
          channel: '门店编码',
          type: '淘汰类型',
          status: '状态'
        }
      }
    }
  },
  computed: {
    selectedItem() {
      return this.headList[this.searchKey]
    }
  },
  watch: {},
  mounted() {
    const that = this
    that.tableHeight = document.documentElement.clientHeight - 290
    window.addEventListener('resize', function() {
      let height = document.documentElement.clientHeight - 290
      that.$nextTick(() => {
        that.tableHeight = height
      })
    })
  },
  methods: {
    onChange: function(data) {
      this.searchName = data.label
      this.selected = data.type
    },
    doSearch(msg) {
      this.searchNum = msg
      this.searchKey = this.selected
      this.pageNo = 0
      this.list = []
      this.hasNext = true
      this.$nextTick(() => {
        this.loadMore()
      })
    },
    loadMore: function() {
      if (!this.hasNext) {
        return
      }
      this.listLoad = true
      // 这个查询是需要登陆的，否则是公共的查询页面
      this.loadData()
    },
    // 加载无需权限的查询
    loadData: function() {
      api
        .orderQuery({
          type: this.searchKey,
          queryString: this.searchNum,
          pageNo: this.pageNo
        })
        .then(res => {
          this.listLoad = false
          if (!res.list || !res.list.length) {
            this.hasNext = false
            this.loadSuc = false
            return
          }
          if (res.list.length < 20) {
            this.hasNext = false
          }
          if (this.pageNo > 1) {
            this.list = this.list.concat(res.list)
          } else {
            this.list = res.list
          }
          this.pageNo = this.pageNo + 1
          this.loadSuc = false
        })
        .catch(err => {
          this.loadSuc = false
          this.listLoad = false
        })
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  background: rgb(255, 255, 255);
  padding: 0 100px;
  position: relative;
  .el-radio-group {
    display: flex;
  }
  .search-item {
    margin-right: 20px;
  }
  .table-box {
    margin-top: 20px;
  }
}
</style>
