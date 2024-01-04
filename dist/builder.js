"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builder = exports.parseConfig = exports.TxParamKind = void 0;
const ethers_1 = require("ethers");
const phase_js_1 = require("./phase.js");
exports.TxParamKind = [
    "RECIPIENT",
    "QUANTITY",
    "MAPPING_RECIPIENT",
    "REFERRAL",
];
// RECIPIENT -> The address to which the NFT has to be minted to
// QUANTITY -> The quantity to mint
// MAPPING_RECIPIENT -> If present, the TxParam "values" must be set and should be a a mapping(address => abiType)
//                      This can only be used with a field of kind: "RECIPIENT" and only if "RECIPIENT" is present in the mapping
async function parseConfig(mintConfig, config) {
    const builder = new Builder(mintConfig, config);
    await builder.load();
    return builder;
}
exports.parseConfig = parseConfig;
class Builder {
    constructor(mintConfig, config) {
        this.maxSupply = 0;
        this._phases = [];
        this.mintConfig = mintConfig;
        this.config = config;
    }
    async load() {
        var _a, _b, _c, _d;
        const maxMintPerWallet = await this.valueOrContractCall((_a = this.mintConfig.maxMintPerWallet) !== null && _a !== void 0 ? _a : 0);
        const maxMintPerTransaction = await this.valueOrContractCall((_b = this.mintConfig.maxMintPerTransaction) !== null && _b !== void 0 ? _b : 0);
        this.maxSupply = await this.valueOrContractCall((_c = this.mintConfig.maxSupply) !== null && _c !== void 0 ? _c : 0);
        // go through all phases
        const phases = [];
        for (const phase of this.mintConfig.phases) {
            // load data if any contract call needed
            phase.startTime = (await this.valueOrContractCall(phase.startTime));
            phase.endTime = (await this.valueOrContractCall(phase.endTime));
            phase.price = String(await this.valueOrContractCall((_d = phase.price) !== null && _d !== void 0 ? _d : "0"));
            // set some default data if needed
            if (!phase.tx.to) {
                phase.tx.to = this.config.collection;
            }
            if (phase.tx.params) {
                for (const param of phase.tx.params) {
                    if (param.kind) {
                        if (!exports.TxParamKind.find((el) => el == param.kind)) {
                            throw new Error(`Unknown TxParamKind ${param.kind}`);
                        }
                    }
                }
            }
            const phaseO = new phase_js_1.Phase(phase, maxMintPerWallet, maxMintPerTransaction, this);
            phases.push(phaseO);
        }
        this._phases = phases;
    }
    get phases() {
        return this._phases;
    }
    // returns the phase for a given timestamp
    async getPhasesAt(timestamp) {
        return this.phases.filter((el) => {
            return (el.startTime <= timestamp &&
                (el.endTime >= timestamp || el.endTime == 0));
        });
    }
    async getCurrentPhases() {
        const timestamp = ~~(Date.now() / 1000);
        return this.getPhasesAt(timestamp);
    }
    async valueOrContractCall(value) {
        var _a;
        if (typeof value != "object") {
            return value;
        }
        // @todo check for bignumber
        const contract = new ethers_1.ethers.Contract(value.to || this.config.collection, value.abi, this.config.provider);
        const data = await contract[value.functionName](...((_a = value.inputs) !== null && _a !== void 0 ? _a : []));
        // @todo implement some data[pathToValue]?
        return data;
    }
}
exports.Builder = Builder;
//# sourceMappingURL=builder.js.map