<template>
  <div>
    <el-container>
      <el-container>
        <el-aside>
          <el-menu
              default-active="1"
              class="el-menu-vertical-demo"
              @select="handleSelect">
            <el-menu-item index="1">
              <i class="el-icon-user-solid"></i>
              <span slot="title">Home</span>
            </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-collection-tag"></i>
              <span slot="title">Collected</span>
            </el-menu-item>
            <el-menu-item index="3">
              <i class="el-icon-setting"></i>
              <span slot="title">Setting</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <div style="text-align: center;">
            <h1 style="margin-top: 0; margin-bottom: 50px;">Collect your favorite website permanently</h1>
          </div>
          <div v-if="homeVisible" class="centered">
            <div style="margin-bottom: 20px">
            Choose the currency you will pay in
            </div>
            <el-select v-show="connected" style="margin: 0 auto" v-model="selectedSymbol" class="m-2"
                       placeholder="Select" size="large">
              <el-option
                  v-for="symbol in symbols"
                  :key="symbol"
                  :label="`${symbol} ${balanceStack[symbol]}`"
                  :value="symbol"
              />
            </el-select>
            <div style="margin-top: 50px;width: 600px">
              <el-input placeholder="Please enter url" v-model="myUrl">
                <template slot="append">
                  <el-button type="primary" @click="toCollect">Collect</el-button>
                </template>
              </el-input>
            </div>
          </div>
          <div v-if="collectedVisible">
            <el-card>
              <div slot="header" class="clearfix">
                <span>collected websites</span>
              </div>
              <el-table :data="webs" border>
                <el-table-column label="name" prop="name"/>
                <el-table-column label="url" prop="url"/>
                <el-table-column label="onChainStatus" prop="onChainStatus"/>

                <el-table-column label="operations">
                  <template slot-scope="scope">
                    <el-button align="left" type="primary" @click="show(scope.row.id)" style="margin-left: 10px">
                      show on service
                    </el-button>

                    <el-button align="left" type="info" @click="showOnArweave(scope.row.id)"
                               style="margin-left: 10px; margin-top: 10px">
                      show on permaweb
                    </el-button>
                    <el-button align="left" type="primary" @click="showOnViewBlock(scope.row.id)"
                               style="margin-left: 10px; margin-top: 10px">
                      transaction detail
                    </el-button>
                  </template>
                  >
                </el-table-column>
              </el-table>
            </el-card>
          </div>
          <div v-if="settingVisible">
            <el-card>
              <div slot="header" class="clearfix">
                <h3>Address</h3>
                <span>{{ instance.addr }}</span>
                <el-button type="info" size="small">charge</el-button>
              </div>
              <div>
                <el-row>
                  <el-col :span="6">
                    <div style="font-weight: bold">Balance:</div>
                  </el-col>
                  <el-col :span="18"><span>0.00AR</span></el-col>
                </el-row>
                <el-row style="margin-top: 10px">
                  <el-col :span="6">
                    <div style="font-weight: bold;">Transactions:</div>
                  </el-col>
                  <el-col :span="18"><span>5</span></el-col>
                </el-row>
              </div>
            </el-card>
          </div>
        </el-main>
      </el-container>
      <el-dialog title="collect"
                 :visible.sync="pubFavoriteVisible"
                 width="60%"
      >
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="url">
            <el-input v-model="form.url"/>
          </el-form-item>
          <el-form-item label="name">
            <el-input v-model="form.name"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="collectWeb" :loading = "collectLoading">collect</el-button>
            <el-button type="cancel" @click="pubFavoriteVisible = false">cancel</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import Favorite from "@/components/favorite";
import pubsub from 'pubsub-js'
import Everpay from 'everpay'
import {getBundleFee, getItemMeta, getOrders} from 'arseeding-js'
import Bignumber from 'bignumber.js'
import axios from "axios";

function getArseedUrl() {
  let arseedUrl = "https://arseed.web3infra.dev"
  return arseedUrl
}

export default {
  name: 'HelloWorld',
  components: {Favorite},
  created() {
    this.account = this.$route.query.account
    this.instance = this.$route.query.instance
    this.connected = true
  },
  data() {
    return {
      arseedUrl: getArseedUrl(),
      myUrl: '',
      homeVisible: true,
      collectedVisible: false,
      settingVisible: false,
      connected: false,
      pubFavoriteVisible: false,
      selectedSymbol: '',
      account: '',
      orders: [],
      instance: {},
      symbols: [],
      everpay: {},
      balance: '',
      balanceStack: {},
      collectLoading: false,
      webs: [],
      form: {
        name: '',
        url: ''
      }
    }
  },
  watch: {
    selectedSymbol() {
      if (this.everpay.balance && this.selectedSymbol && this.instance.addr) {
        this.everpay.balance({
          symbol: this.selectedSymbol,
          account: this.account
        }).then(result => {
          this.balance = result
        })
      }
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      if (key === '1') {
        this.homeVisible = true
        this.settingVisible = false
        this.collectedVisible = false
      } else if (key === '2') {
        this.collectedVisible = true
        this.homeVisible = false
        this.settingVisible = false
        this.loadWebs()
      } else if (key === '3') {
        this.collectedVisible = false
        this.homeVisible = false
        this.settingVisible = true
      }
    },
    toCollect() {
      this.pubFavoriteVisible = true
      this.form.url = this.myUrl
    },
    collectWeb() {
      // 加一个loading
      this.collectLoading = true
      //
      axios.get('https://api.permapage.xyz/fetchurl', {
        timeout: 100000,
        params: {
          url: this.form.url
        }
      })
      .then(response => {
        let base64 = response.data.result;
        let file = this.base64toFile(base64, 'test');
        this.collectLoading = false
        this.combineFileList(file);
      })
      .catch(error => {
        this.collectLoading = false
      });
    },
    async combineFileList(file) {
      const fee = await getBundleFee(this.arseedUrl, file.size, this.selectedSymbol)
      const formatedFee = new Bignumber(fee.finalFee).dividedBy(new Bignumber(10).pow(fee.decimals)).toString()
      this.$confirm(`need ${formatedFee} ${this.selectedSymbol} to upload`, 'notice',{
        confirmButtonText: 'pay and save',
        cancelButtonText: 'cancel',
        type: 'warning'
      }).then(() => {
        if (+this.balance >= +formatedFee) {
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = async () => {
            const data = reader.result
            const ops = {
              tags: [{name: "Content-Type", value: file.type}, {name: "name", value: this.form.name},
                {name: "url", value: this.form.url}],
            }
            const res = await this.instance.sendAndPay(this.arseedUrl, data, this.selectedSymbol, ops)
            this.submitResp = JSON.stringify(res)
            this.getOrders()
            this.pubFavoriteVisible = false
          }
        } else {
          alert(`You don't have enough money, need ${formatedFee} ${this.selectedSymbol} to upload`)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'canceled'
        });
      });
    },
    loadWebs() {
      //TODO: query the webs from arweave
    },

    base64toFile(data, fileName) {
      const dataArr = data.split(",");
      const byteString = atob(dataArr[0]);
      const options = {
        type: "image/png",
        endings: "native"
      };
      const u8Arr = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        u8Arr[i] = byteString.charCodeAt(i);
      }
      return new File([u8Arr], fileName + ".png", options);//返回文件流
    },

    check(id) {
      const url = 'https://arweave.net/tx/' + id + "/data"
      window.open(url, "_blank")
    },
    showOnArweave(id) {
      const url = 'https://arweave.net/' + id
      window.open(url, "_blank")
    },
    showOnViewBlock(id) {
      const url = 'https://viewblock.io/arweave/tx/' + id
      window.open(url, "_blank")
    },
    show(id) {
      const url = 'https://arseed.web3infra.dev/' + id
      window.open(url, "_blank")
    },
    intervalUpdateOrders() {
      setTimeout(() => {
        this.getOrders()
        this.intervalUpdateOrders()
      }, 10000)
    },
    async getBalances() {
      this.everpay.balances({
        account: this.instance.addr
      }).then(balances => {
        const balanceStack = {}
        balances.forEach(balanceItem => {
          balanceStack[balanceItem.symbol] = balanceItem.balance
        })
        this.balanceStack = balanceStack
      })
    },
    async getOrders() {
      getOrders(this.arseedUrl, this.instance.addr).then(orders => {
        this.orders = orders
        for (let i = 0; i < orders.length; i++) {
          const order = orders[i]
          let name = ''
          let url = ''
          let onChainStatus = order.onChainStatus
          getItemMeta(getArseedUrl(), order.itemId).then(metaData => {
            metaData.tags.forEach((tag) => {
              if (tag.name === 'name') {
                name = tag.value
              }
              if (tag.name === 'url') {
                url = tag.value
              }
            })
            this.$set(this.webs, i, {
              onChainStatus: onChainStatus,
              name: name,
              url: url,
              id: order.itemId
            })
          })
        }
      })
    },
  },
  mounted() {
    this.everpay = new Everpay()
    this.everpay.info().then(info => {
      this.symbols = info.tokenList.map(token => token.symbol)
      this.selectedSymbol = this.symbols[0]
    })
    this.getOrders()
    this.intervalUpdateOrders()
    this.getBalances()
  },

  beforeDestroy() {
    pubsub.unsubscribe(this.pubId)
  },
}
</script>
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.centered {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
