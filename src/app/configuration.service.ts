import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {

    public CONTRACT_ENS = '1hop.eth';

    public GAS_PRICE_URL = 'http://gas-price.api.enterprise.1inch.exchange';
    public GAS_PRICE_URL2 = 'https://gasprice.poa.network';
    public CORS_PROXY_URL = 'https://corsproxy.1inch.exchange/';

    public ONE_SPLIT_CONTRACT_ADDRESS = '0x3F3e18aef051dC2b489CEf138BB9e224F78f7117';
    public TOKEN_HELPER_CONTRACT_ADDRESS = '0x1ed7221c4a43632e3ed491a8a28bbebd0b450ad8';
    public MCD_POT_CONTRACT_ADDRESS = '0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7';

    public FLASH_LOAN_CONTRACT_ADDRESS = '0xBf473d07e3Dabf69a3D6C125E75754dc3C638642';
    public EXCHANGE_CONTRACT_ADDRESS = '0xB35Ef14817DBF761127C14c2c7cAafDA9AFcae69';
    public PROTOCOL_CONTRACT_ADDRESS = '0x312305ec1a4b5381c5EA9B1aDe83ba416d242909';
    public HOLDER_CONTRACT_ADDRESS = '0x551299D87BC2cCF8ed9272fD746212A504C66FDf';
    public TOKEN_CONTRACT_ADDRESS = '0x76F482f8141724e008C1591102C3fAD798696eC2';

    public fastGasPrice = new ethers.utils.BigNumber(Math.trunc(6 * 100)).mul(1e7);
    public standardGasPrice = new ethers.utils.BigNumber(Math.trunc(11 * 100)).mul(1e7);
    public instantGasPrice = new ethers.utils.BigNumber(Math.trunc(21 * 100)).mul(1e7);

    constructor(
        private http: HttpClient
    ) {

        setInterval(() => {

            try {

                this.setGasPrices();
            } catch (e) {

            }
        }, 30000);

        this.setGasPrices();
    }

    async setGasPrices() {

        try {

            let result;

            try {

                result = await this.http.get(this.CORS_PROXY_URL + this.GAS_PRICE_URL).toPromise();
            } catch (e) {

            }

            let fastGasPrice,
                standardGasPrice,
                instantGasPrice;

            if (!result || !result['health']) {

                result = await this.http.get(this.GAS_PRICE_URL2).toPromise();
            }

            fastGasPrice = result['fast'] * 110 * 1e9 / 100;
            standardGasPrice = result['standard'] * 110 * 1e9 / 100;
            instantGasPrice = result['instant'] * 110 * 1e9 / 100;

            this.fastGasPrice = ethers.utils.bigNumberify(Math.trunc(fastGasPrice));
            this.standardGasPrice = ethers.utils.bigNumberify(Math.trunc(standardGasPrice));
            this.instantGasPrice = ethers.utils.bigNumberify(Math.trunc(instantGasPrice));
        } catch (e) {

            // console.error(e);
        }
    }
}
