"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import contractURI from "./data/contractURI.json" assert { type: "json" };
const contracts_js_1 = __importDefault(require("./data/contracts.js"));
const builder_js_1 = require("../builder.js");
const ethers_1 = require("ethers");
require("dotenv/config");
(async () => {
    console.log(process.env.RPC_PROVIDER);
    const provider = new ethers_1.ethers.providers.JsonRpcProvider(process.env.RPC_PROVIDER);
    /*
        - load the config
        - construct the different phases
        - allows to find current phases (config.getCurrentPhases())
        - allows to find the phases for a given timestamp (config.getPhasesAt(timestamp))
        - list the params needeed for a phase (phase.getParams())
        - allows to build the tx for a phase (phase.buildTransaction(params))
        - format to reservoir's "collection_mint" format
      */
    for (const data of contracts_js_1.default) {
        const contract = new ethers_1.ethers.Contract(data.address, `[{
          "inputs": [],
          "name": "contractURI",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }]`, provider);
        const mintConfig = await (0, builder_js_1.parseConfig)(data.contractURI.mintConfig, {
            provider,
            collection: data.address,
        });
        for (const phase of mintConfig.phases) {
            console.log(phase.getParams());
            console.log(phase.format());
        }
    }
    // const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000001";
    // const mintConfig = await parseConfig(contractURI.mintConfig, {
    //   provider,
    //   contract,
    // });
    // console.log(mintConfig.phases);
    // {
    //   const params = { comment: "foo", theme: 4 };
    //   console.log(mintConfig.phases[0].buildTransaction(params));
    // }
    // {
    //   const params = {
    //     recipient: "0x0000000000000000000000000000000deadbeef1",
    //     quantity: 1,
    //   };
    //   console.log(mintConfig.phases[1].buildTransaction(params));
    // }
    // {
    //   const params = {
    //     recipient: "0x0000000000000000000000000000000deadbeef2",
    //     quantity: 5,
    //   };
    //   console.log(mintConfig.phases[2].buildTransaction(params));
    // }
    // const phase = builder.getCurrentPhase();
    // const params = phase.getParams();
    // console.log(params);
})();
//# sourceMappingURL=index.js.map