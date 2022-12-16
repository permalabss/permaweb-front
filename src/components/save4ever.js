import Arweave  from 'arweave';

const key = {"kty":"RSA","n":"zppU8l79rFZb_FzEC27M3h0bqAmjJXToZN57CzrEdcxgkSlnJ1d1pnKTcatnylPICEJLzzXWJJs1m6PKsUeZsfLslid0cE7kjp_DWmd6L-Rq1ee0Kp9UnWmdz_d6gTo3Tgkn1nU3VQ_kaNXQrAd-qWBIlehEs6z5FQwaZOHHaSFiEBKn_6iKfXUKiFsF01JCL7My_5Tnul4q2yoDnT-EUhm7nsnndc6V7VP-zd25s1IVcTrG0sbtluMYvvn1ol4lGhnpkOFmprojbc55B7S8dyLKudDFdWKi7IlPvVvBJdWfOaM0RVLoECpkldAHBDsDu8V2KCg7ayhCIpptmKvwGczOkhibXFqCLFFRXpUD2_stcfOQYNstquY7rJ4j0lHlwjaO962bf6l0pJUu3WsQvhQ2Yg8XTWxIiNeJFkMyII_8jjksR-VfSmM35bl0-aK6sMK8Tpbj7_eKKWrZYCvlzljTnCovlVrUoHj3-DZWVhIxNM6GbpMnJqgk_eJlqiYehKh9HKbdfjHAvJ96fduOSu_1gprMgQGPJHH3lpF2A-31VDXmDzyyfFzs4anN99I2z3a9nEFa_CPHjBGHD5vvRd8Xe5jyLCzA8jBCE9DPOd9KOWueq6wU8Wz553NdeeBSTfPntQF-UF3BBD1e090AqMgd4rzkgjrUVp_bpKNuCIs","e":"AQAB","d":"HLMzubeYZahZfuUkFrJ9ox1ICj_MeheTcO-3CAhR4ktR3thxi_WKUmT4NoIpGOIql3seLNq9tLga6lQGhDn-D8o_M1ynwDI1bdqjuJtHTf_dF3nofUNE7dkOIyWtzuXXaO-8qP3_gcGDaUzKgBtKbR0C-FAbuxn8QAA-amUy3lfU14a_77PqCSOJIwgB9ykmKJosK3Tz-9-49FkRx3ZbW0xX0-cYUDUyfpV8f_ydH1v3vpL7q6wWtS828NCoXrXVUZrn50hoiiCxaz-TcI6a37Hll4p446WgHFu2yAdG_Yp_Y_JYAIlT02sQLf-H-f54tkzn7QwptOkSxtvM_bhk0fDL_I32p2GwQpsDyTTjQ9vsPoFr855Dry-zhyYI3SGSIKS9zcViem9me9u5RKFd_I2VQwpnEcgR4rcCwH3awvT9OQPCNkXLcXYihWFLnbixrtah_S7WWF9Bnh05My3M9dHa_C_54J_2VXCD4roqt4TM5pwFo-QxiF_iEGNmlWTfMxm8MHCSXylJP8UNSXR0zPR3tzkoc44Hg3_JL_i-uOvahuXe7Ms7cXSZUIT1ZoVx7WPYk2igzCcIxWAGdqT5Ra3RhyD4bekAOIHV1XXX6yHnC48BObBRCYD3oajxRe0TR7hyjXFeE_FyaXM4_KY2JlL-IVrdo-aK0r4sPFWu24E","p":"50ntHEaJfdF-UyWDD2_ih604mmsVoeR663_GDrSEGxbY1Avqgi09De5vG43Eqsz0xHm1FN2o6d-cx7flmbG8nCqxb-Lq5qL6cmNOu4W00dsdgYpPkFY1OjwZ8QXZrWhVNfsLRFarB9bTY0FLULOqGVIh_2ZtDmGyu4bzWEFo4fA7WDksclnZL250yyabbr8WrCDkOwI3_dLHK7DkQdOMf_Klq-bzN4bQobMPY5RT-XWkqrvgRfkrscU_cNtSP9wJWu0CuYA9aSNh9fHqkelmS6sYXVy0jr81B9noU3RFTR5JnUtRC731gfbM5i77jTK18fkrAR8GQSIfEryyViY5JQ","q":"5K02Bwn861KG-7310py6CVGW_t6EE0m1ghTKZZe1ZoUQVYIUun7peNrs-ij1zwnOYpUQ3gvb33BEcb6IYL_OI4FiYfDl_jzIeQq0lC1iY4-6nPRAPVf8uBMyJtY2qa2DEUbZebKn6RD-1R0qBwA0wk7H321krDYHAXg9rQnpqUgoN_13RRT5Q8WnQjBiJqwSQsykMs7gc-cQImBZLJQFwSWyk7sZCPz5HXQqgXJ0wDjDmsxw0BJ-yoDTWpoBbLlnginiFP88jwdAFeq5yf6LUIYBZEgFBLzwh0lQiuhWXWefOm1vGPhx0UNi0tgdnukKbL0dnE5K0T1tvNcdcIJD7w","dp":"dp8HqNTUd18WdvZqPWSYvhUtTqVVNu7DzDyAC9KxXmNdWYOzBojFI3wCKBORpjfv4US6hrUYiLpS4muCqkzp-v46erPa3ecAo-Ii4zI0Bt1mSKXzIIfWTMO-Wksx1SoJaeITaT06Ao8_Y0x9oCpFNy9UmHSjwhiBXoRcEguaCyb2iMzp6swCA72W0Qo_9ZCzxBwqcck1hkywMcxLhSdGi-ia54tPek7-ebAoWF4eo3aeuaIZ6ElfC5Gqc-tIR9BGTAf6ucD3vhCTkVw9fhBCktRxbpC5Weze-ePcr9CWKnM6Nh4Gtwr5-2nktLmr8kLr5epxD-YlgwpI_Ychv-VisQ","dq":"vmnIoiXb92s5wOeViPE-K8JHlCRfH9xxikabneqsfxhv2HO_pOdGq37IcymmPOaydv4fFHYVeMF4DKqVztIH6SK0dE9ug7vDRp72bKg51CN7RXRRBYN9iR1a1mHrFHDJwZoYPrDYBkdDmtt1Am1WgTGuVso1WPyH6t5fpPWrHm1aJ_0j0l87jAZKVuAI6qC_d-YFF9WRqpENq0JFHsyG2iT0xPS3TPewy6jOOAnBU8owfnabvXaZIzAQTdINO6ZKnWUYv1kk6Qglgdp5J8yP3tYm1ITvwNk_A7e1nGUIfTBqsvEq4EUIKTMOV_ji-U6dgpwayuuaew7GkMci2Wtu-w","qi":"Cxj926Tsl6tnCNPQOniM3gA10XoyWunsTvitt80sMvAgtR8pPLcS4pwwGfGZHWl4w00JUTQrCiar9gCcbtXox5am7SnRAoJcXQIWLw5E81NvxuoWOSFmPzPCGB9cJx_nd8P-jfCBPcRcLR87FQRr3WZFDPRtbTD4yJNqA6a7PyrKWntzj_OdNstR8pGvu0Kf6hoztNhORPzNrvyFBa3ZTulE20T4kKpj94HbpnwyIT1M9DfuN9TXDpArcf4yfQpeITesm-D9zJEk4ZN6p1ilE2vvIXakyZD_d_7srzMxErqQUNpUKKhNBDfWvTt0I7FAAPnh4bkZ_XtUjpmeW1XLmg"}
// Since v1.5.1 you're now able to call the init function for the web version without options.
// The current URL path will be used by default. This is recommended when running from a gateway.
// const arweave = Arweave.init({});
// Or manually specify a host
const arweave = Arweave.init({
    host: 'arweave.net',
    protocol: 'https'
});

export async function getBalance(){
    arweave.wallets.jwkToAddress(key).then((address) => {
        console.log(address);
        //1seRanklLU_1VTGkEk7P0xAwMJfA7owA1JHW5KyZKlY
        arweave.wallets.getBalance(address).then((balance) => {
            let winston = balance;
            let ar = arweave.ar.winstonToAr(balance);

            console.log(winston);
            //125213858712

            console.log(ar);
            //0.125213858712
        });
    });
}
export async function getCollectedWeb(id){
    const transaction = await arweave.transactions.getData(id)
    console.log(transaction);
    return transaction
}


export async function collect4ever(entity, name) {
    const transactionA = await arweave.createTransaction({
        data: entity
    }, key);
    transactionA.addTag('chainfeedsASDFGH', name);
    await  arweave.transactions.sign(transactionA, key)

	console.log(transactionA);
	const response = await arweave.transactions.post(transactionA)
    console.log(response);
    return transactionA.id
}

// const transactionA = await arweave.createTransaction({
//     data: 'Hello Chainfeed'
// }, key);

// arweave.transactions.sign(transactionA, key).then(res=>{
// 	console.log(transactionA);
// 	arweave.transactions.post(transactionA).then(response=>{
// 		console.log(response);
// 		arweave.transactions.get(transactionA.id).then(transaction => {
// 		  console.log(transaction);
// 		});
// 	})
// })




