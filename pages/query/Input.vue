<template>
  <div class="entry-wrap">
    <el-input
      v-model="entryNo"
      :placeholder="initText"
      class=""
      onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode)))"
      clearable
    ></el-input>
    <el-button type="primary" class="submit-btn" @click="doSearch"
      >搜索</el-button
    >
  </div>
</template>
<script>
// import api from '@/api/index'
import { isMobile } from '@/assets/utils/util'
export default {
  name: 'Input',
  props: {
    dataType: {
      type: String,
      default: ''
    },
    searchName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      picUrl: '',
      entryNo: '',
      titelText: ''
    }
  },
  computed: {
    initText() {
      return '输入' + this.searchName
    }
  },
  mounted() {},
  methods: {
    doSearch() {
      if (!this.entryNo) {
        this.$message('搜索内容不能为空')
        return false
      } else {
        if (this.dataType === '5') {
          if (this.entryNo.length < 12) {
            this.$message('输入有误，订单号长度不正确')
            return
          }
        } else if (this.dataType === '1' || this.dataType === '3') {
          if (!isMobile(this.entryNo)) {
            this.$message('请输入正确的手机号')
            return false
          }
        } else {
          if (this.entryNo.length < 3) {
            this.$message('编码格式不正确')
            return false
          }
        }
      }
      this.$emit('doSearch', this.entryNo)
    }
  }
}
</script>
<style scoped lang="scss">
.entry-wrap {
  display: flex;
  padding: 40px 0px;
  .submit-btn {
    margin-left: 15px;
  }
}
.look-record {
  line-height: 88px;
  text-align: center;
  span {
    color: #3f51b5;
    border-bottom: 1px solid #3f51b5;
  }
}
</style>
