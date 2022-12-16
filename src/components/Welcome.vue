<template>
  <div style="background: #3F3F3F; padding: 20px; height: 100vh; padding-bottom: 50px">
    <el-row type="flex" justify="center" style="margin-top: 60px;">
      <el-col :span="12">
        <div style="text-align: center; max-width: 100%; max-height: 100vh">
          <img src="../assets/logo1.png" style="max-width:400px; height: auto"/>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 100px; margin-bottom: 50px">
      <el-col :span="12">
        <div style="text-align: center">
          <h1 style="color: white; font-family: 'Roboto', sans-serif">Welcome!</h1>
          <h2 style="color: #DDDDDD; font-family: 'Roboto', sans-serif">A privacy, decentralization, easy to pay, permanent network disk</h2>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 20px">
      <el-col :span="12">
        <div style="text-align: center">
          <el-button type="success" size="large" style="box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-color: #fef0f0; font-size: 18px; font-weight: 500; background-color: #733ce682; color: white" @click="connectMetamask">Connect to wallet</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>


<script>
import {connectWallet} from "@/components/wallet";
import { genAPI,genArweaveAPI } from "arseeding-js";
import pubsub from 'pubsub-js'

export default {
  name: "Welcome",
  methods:{
    async onSubmit(){
      const currentAccount = await connectWallet()
      if(currentAccount !== ''){
        this.$router.push({
          path: '/dashboard',
          query: {account: currentAccount}
        })
      }
    },

    async connectMetamask() {
      await window.ethereum.enable()
      const instance = await genAPI(window.ethereum)
      this.signerAddr = window.ethereum.selectedAddress
      this.connected = true
      instance.addr = this.signerAddr
      pubsub.publish('connected',instance)
      this.$router.push({
        path: '/dashboard',
        query: {account: instance.addr, instance: instance}
      })
    },
  }
}
</script>

<style scoped>

</style>
