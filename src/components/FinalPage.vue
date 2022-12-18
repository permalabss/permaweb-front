<template>
  <div>
    <el-container>
      <el-header>
        <el-menu
            default-active="activeIndex"
            class="el-menu-vertical-demo"
            mode="horizontal"
            @select="handleSelect">
          <el-menu-item>
            <div style="margin-left: 160px;font-size: 26px;">
              <span style="font-family: 'Times New Roman',serif">PermaPage</span>
            </div>
          </el-menu-item>
          <el-menu-item index="1">
            <span slot="title">Home</span>
          </el-menu-item>
          <el-menu-item index="2">
            <span slot="title">Lists</span>
          </el-menu-item>
          <el-menu-item>
            <div style="float: right;margin-left: 390px">
              <el-button v-if="connected" size="small" >{{ shortAccount }}</el-button>
              <el-button v-else size="small" @click="connectMetamask">connect wallet</el-button>
            </div>
          </el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <el-row :gutter="10" type="flex" justify="center">
          <el-col :span="12">
            <el-card v-if="homeVisible">
              <div><span style="font-weight: 900; font-size: 18px">I want this page to be permanent.</span></div>
              <div style="margin-top: 20px"><el-input v-model="myUrl" placeholder="Enter the page link you want to keep"></el-input></div>
              <div v-if="connected">
                <div style="margin-bottom: 20px;margin-top: 20px">
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
                <div style="margin-top: 20px">
                  <el-button type="info" @click="collectWeb" :loading = "collectLoading">Keep</el-button>
                </div>
              </div>
              <div v-else style="margin-top: 20px"><el-button type="primary" size="small" @click="connectMetamask">connect wallet</el-button></div>
            </el-card>
            <el-card v-if="collectedVisible">
              <el-table :data="webs" border>
                <el-table-column label="Url" prop="url"/>
                <el-table-column label="Date" prop="time"/>
                <el-table-column label="Status" prop="onChainStatus"/>
                <el-table-column label="Operations">
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
          </el-col>
          <el-col :span="6"><el-card>
            <div slot="header">
              About
            </div>
            <div>
              <span style="color:red;">PermaLabs</span> can keep web pages permanently in your web3 wallet, even if the original web page disappears.
            </div>
          </el-card></el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {genAPI} from "arseeding-js";
import pubsub from 'pubsub-js'
import Everpay from 'everpay'
import {getBundleFee, getItemMeta, getOrders} from 'arseeding-js'
import Bignumber from 'bignumber.js'
import axios from "axios";
import {dateFormat} from "@/api/utils";

function getArseedUrl() {
  let arseedUrl = "https://arseed.web3infra.dev"
  return arseedUrl
}
export default {
  name: "FinalPage",
  data() {
    return {
      activeIndex: '1',
      arseedUrl: getArseedUrl(),
      myUrl: '',
      homeVisible: true,
      collectedVisible: false,
      connected: false,
      selectedSymbol: '',
      account: '',
      shortAccount: '',
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
          account: this.instance.addr
        }).then(result => {
          this.balance = result
        })
      }
    }
  },
  methods:{
    handleSelect(key, keyPath) {
      if (key === '1') {
        this.homeVisible = true
        this.collectedVisible = false
      } else if (key === '2') {
        this.collectedVisible = true
        this.homeVisible = false
      }
    },
    async connectMetamask() {
      await window.ethereum.enable()
      const instance = await genAPI(window.ethereum)
      this.instance = instance
      this.signerAddr = window.ethereum.selectedAddress
      this.connected = true
      instance.addr = this.signerAddr
      pubsub.publish('connected',instance)

      // mounted
      this.everpay = new Everpay()
      this.everpay.info().then(info => {
        this.symbols = info.tokenList.map(token => token.symbol)
        this.selectedSymbol = this.symbols[0]
      })
      await this.getOrders()
      this.intervalUpdateOrders()
      await this.getBalances()
      this.shortAccount = this.signerAddr
    },
    collectWeb() {
      // 加一个loading
      this.collectLoading = true
      //
      axios.get('https://api.permapage.xyz/fetchurl', {
        timeout: 100000,
        params: {
          url: this.myUrl
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
                {name: "url", value: this.myUrl}],
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
              id: order.itemId,
              //2022-12-18T02:38:21.004Z 转成 2022-12-18 10:38:21
              time: dateFormat(order.updatedAt)
            })
          })
        }
      })
    }
  },

  mounted() {
    // this.everpay = new Everpay()
    // this.everpay.info().then(info => {
    //   this.symbols = info.tokenList.map(token => token.symbol)
    //   this.selectedSymbol = this.symbols[0]
    // })
    // this.getOrders()
    // this.intervalUpdateOrders()
    // this.getBalances()
  },
  beforeDestroy() {
    pubsub.unsubscribe(this.pubId)
  },
}
</script>

<style scoped>

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.el-row {
  margin-bottom: 20px;
&:last-child {
   margin-bottom: 0;
 }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>