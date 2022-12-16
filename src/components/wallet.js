export async function connectWallet() {
    if (window.ethereum == null) {
        throw new Error('No injected Ethereum provider')
    }
    const ethereumProvider = window.ethereum
    // Request accounts from the Ethereum provider
    const accounts = await ethereumProvider.request({
        method: 'eth_requestAccounts',
    })
    console.log(accounts)
    return accounts[0]
}
