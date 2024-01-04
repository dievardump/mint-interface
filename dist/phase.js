"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Phase = void 0;
const ethers_1 = require("ethers");
class Phase {
    constructor(phase, globalMaxMintPerWallet, globalMaxMintPerTransaction, parent) {
        this.phase = phase;
        this.globalMaxMintPerWallet = globalMaxMintPerWallet;
        this.globalMaxMintPerTransaction = globalMaxMintPerTransaction;
        this.parent = parent;
    }
    get startTime() {
        return this.phase.startTime;
    }
    get endTime() {
        return this.phase.endTime;
    }
    get maxMintsPerWallet() {
        var _a, _b;
        return (_b = (_a = this.phase.maxMintsPerWallet) !== null && _a !== void 0 ? _a : this.globalMaxMintPerWallet) !== null && _b !== void 0 ? _b : 0;
    }
    get maxMintPerTransaction() {
        var _a, _b;
        return ((_b = (_a = this.phase.maxMintPerTransaction) !== null && _a !== void 0 ? _a : this.globalMaxMintPerTransaction) !== null && _b !== void 0 ? _b : 0);
    }
    get price() {
        if (this.phase.price == "0")
            return null;
        else
            return this.phase.price;
    }
    get currency() {
        var _a;
        return (_a = this.phase.currency) !== null && _a !== void 0 ? _a : null;
    }
    get isOpen() {
        const timestamp = ~~(Date.now() / 1000);
        return (this.startTime <= timestamp &&
            (this.endTime >= timestamp || this.endTime == 0));
    }
    hasRecipient() {
        var _a;
        return (_a = this.phase.tx.params) === null || _a === void 0 ? void 0 : _a.find((el) => el.kind == "RECIPIENT");
    }
    hasQuantity() {
        var _a;
        return (_a = this.phase.tx.params) === null || _a === void 0 ? void 0 : _a.find((el) => el.kind == "QUANTITY");
    }
    hasMappingRecipient() {
        var _a;
        return (_a = this.phase.tx.params) === null || _a === void 0 ? void 0 : _a.find((el) => el.kind == "MAPPING_RECIPIENT");
    }
    maxMint() {
        var _a, _b, _c;
        let max = (_c = (_b = (_a = this.phase.maxMintPerTransaction) !== null && _a !== void 0 ? _a : this.phase.maxMintsPerWallet) !== null && _b !== void 0 ? _b : this.globalMaxMintPerTransaction) !== null && _c !== void 0 ? _c : this.globalMaxMintPerWallet;
        return max !== null && max !== void 0 ? max : 0;
    }
    getParams() {
        var _a, _b;
        // return the params that are supposed to be filled by the consumer
        // MAPPING_RRECIPIENT is automatically filled with the value from RECIPIENT
        return ((_b = (_a = this.phase.tx.params) === null || _a === void 0 ? void 0 : _a.filter((el) => el.value === undefined || el.kind == "MAPPING_RECIPIENT")) !== null && _b !== void 0 ? _b : []);
    }
    // build a transaction with the given params
    buildTransaction(inputs) {
        var _a, _b;
        const recipientParam = this.hasRecipient();
        if (recipientParam) {
            if (!inputs[recipientParam.name]) {
                throw new Error("Recipient needs to be set");
            }
        }
        const quantityParam = this.hasQuantity();
        if (quantityParam) {
            const quantity = inputs[quantityParam.name];
            if (quantity === undefined) {
                throw new Error("Quantity needs to be set");
            }
            else {
                const max = this.maxMint();
                if (max != 0) {
                    if (quantity > max) {
                        throw new Error("Quantity too high.");
                    }
                }
            }
        }
        const mappingRecipient = this.hasMappingRecipient();
        if (mappingRecipient) {
            if (!mappingRecipient.values) {
                throw new Error("MAPPING_RECIPIENT kind requires a values field");
            }
            const values = mappingRecipient.values;
            let recipient = inputs[recipientParam.name];
            let mappingValue = values[recipient];
            if (!mappingValue) {
                throw new Error("Unknown recipient");
            }
            // we autofill inputs[mappingRecipient] with the corresponding value
            inputs[mappingRecipient.name] = mappingValue;
        }
        // now we check that all params have values and we can fill the arrays used to build the tx
        const txParamsTypes = [];
        const txParamsValues = [];
        for (const param of (_a = this.phase.tx.params) !== null && _a !== void 0 ? _a : []) {
            const value = (_b = param.value) !== null && _b !== void 0 ? _b : inputs[param.name];
            if (value === undefined || value == null) {
                throw new Error(`Parameter ${param.name} value missing`);
            }
            // add the txParam to the build
            txParamsTypes.push(param.abiType);
            txParamsValues.push(value);
        }
        // use ethers to build the tx
        const txParamsData = ethers_1.ethers.utils.defaultAbiCoder.encode(txParamsTypes, txParamsValues);
        return {
            to: this.phase.tx.to,
            data: `${this.phase.tx.method}${txParamsData.slice(2)}`,
        };
    }
    format() {
        var _a, _b, _c, _d;
        const collection = this.parent.config.collection;
        const to = this.phase.tx.to;
        const params = [];
        for (const param of (_a = this.phase.tx.params) !== null && _a !== void 0 ? _a : []) {
            params.push({
                kind: ((_b = param.kind) !== null && _b !== void 0 ? _b : "unknown").toLowerCase(),
                abiType: param.abiType,
                abiValue: param.value,
            });
        }
        const kind = this.hasMappingRecipient() ? "allowlist" : "public";
        return {
            collection: collection,
            status: this.isOpen ? "open" : "closed",
            kind,
            currency: (_c = this.phase.currency) !== null && _c !== void 0 ? _c : undefined,
            price: (_d = this.phase.price) !== null && _d !== void 0 ? _d : undefined,
            stage: `${kind}-sale`,
            maxMintsPerWallet: this.maxMintsPerWallet,
            startTime: this.startTime || undefined,
            endTime: this.endTime || undefined,
            maxSupply: this.parent.maxSupply || undefined,
            details: {
                tx: {
                    to,
                    data: {
                        signature: this.phase.tx.method,
                        params,
                    },
                },
            },
        };
    }
}
exports.Phase = Phase;
//# sourceMappingURL=phase.js.map