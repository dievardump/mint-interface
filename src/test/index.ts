// import contractURI from "./data/contractURI.json" assert { type: "json" };
import contracts from "./data/contracts.js";
import { parseConfig } from "../builder.js";
import { ethers } from "ethers";
import "dotenv/config";

(async () => {
  console.log(process.env.RPC_PROVIDER);
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.RPC_PROVIDER
  );

  /*
      - load the config
      - construct the different phases
      - allows to find current phases (config.getCurrentPhases())
      - allows to find the phases for a given timestamp (config.getPhasesAt(timestamp))
      - list the params needeed for a phase (phase.getParams())
      - allows to build the tx for a phase (phase.buildTransaction(params))
      - format to reservoir's "collection_mint" format
    */

  for (const data of contracts) {
    const contract = new ethers.Contract(
      data.address,
      `[{
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
      }]`,
      provider
    );

    const mintConfig = await parseConfig(data.contractURI.mintConfig, {
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
