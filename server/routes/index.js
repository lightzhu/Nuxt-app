const path = require('path')
const Router = require('koa-router')
const router = new Router()

// 引入
const mysql = require('mysql2')

// 创建数据库连接(信息为演示数据库)
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root1234',
  database: 'nuxt_db',
  charset: 'utf8'
})

router.get('/initList', async ctx => {
  console.log(ctx.query)
  let type = ctx.query.type
  let resp = await new Promise((resolve, reject) => {
    resolve({
      code: 200,
      msg: '获取成功',
      data: [
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
      ]
    })
  })
  ctx.body = resp
})
router.get('/orderQuery', async ctx => {
  let city = ctx.query.city
  let resp = await new Promise((resolve, reject) => {
    connection.query(
      'SELECT\n' +
        '\tc.NAME orgName,\n' +
        'IF\n' +
        '\t( b.relation_id IS NULL, b.code_name, b.id ) codeName,\n' +
        '\ta.mobile,\n' +
        '\ta.tb_trade_parent_id,\n' +
        '\ta.register_time,\n' +
        '\ta.bind_time,\n' +
        '\ta.buy_time,\n' +
        '\ta.bind_card_time \n' +
        'FROM\n' +
        '\tlx_tb_new_user_order a\n' +
        '\tINNER JOIN lx_channel_qrcode b ON a.adzone_id = b.adzone_id AND a.relation_id = b.relation_id\n' +
        '\tINNER JOIN lx_channel_org c ON b.org_id = c.id \n' +
        '\tINNER JOIN lx_channel_user_qrcode_mapping d on b.id = d.qrcode_id\n' +
        'WHERE\n' +
        '\tb.id = "120685" \n' +
        'ORDER BY\n' +
        '\ta.register_time DESC',
      function(err, results, fields) {
        console.log(results.length)
        resolve({
          code: 200,
          msg: '获取成功',
          data: results
        })
      }
    )
  })
  ctx.body = resp
})
module.exports = router
