## Minting support on Reservoir

Today, Reservoir allows to mint directly on projects by trying to decompose and reproduce the transactions used to mint on the collections.

In order to create a simpler and better way for projects to be supported by the protocol, Reservoir propose a new interface that mixes both on-chain and off-chain data, that projects can use in order to become first-class citizen of the protocol.

The on-chain data contains the mint phases configuration: startTime, endTime, price (currency and price), maxPerWallet, maxSupply, ...

The off-chain data contains information about the function to call and the paramters to add to this function, using specific keywords to allow for custom paramaters like quantities, recipient or even allowlists.

### on-chain

The on-chain part is composed of one event and two functions.

One function allows to get the mint phases, while the other reuses a common function `contractURI()` which today returns the collection metadata to which Reservoir wants to attach the off-chain configuration object.

An event is also added to allow indexers to be alerted when the mint configuration is updated.

```
interface MintConfigurator {
	event MintConfigurationChanged();

	struct MintPhase {
		uint32 startTime;
		uint32 endTime;
		uint32 maxPerWallet;
		uint128 maxSupply;
		address currency;
		uint96 price;
	}

	function contractURI() external view returns (string memory);

	function getMintPhases() external view returns (MintPhase[] memory);
}
```

### off-chain

The off-chain part is a configuration object that is added to the JSON pointed by the `contractURI()` function.

This configuration object is expected to contain information about the minting phases: startTime, endTime, price, currency but also what contract is to be called, and the data to pass to that call.

This configuration object is customizable and allows for "gated" mint phases (with merkle root, signatures or other gating).

This configuration object is to be put under the property `mintConfig`

The support of this method is to be signaled by the contract by emitting the event `MintConfigurationChanged()` when creating the contract and also any time the configuration might change (both on-chain and off-chain).

The `mintConfig` object is expected to contain at least data pertaining to each phases of the mint, but can also contain global values.

Following are the expected types of the `mintConfig` object and an example of it

```ts
interface MintConfig {
  maxSupply?: number; // max supply for the collection
  maxMintPerWallet?: number; // max mint per wallet for the collection
  maxMintPerTransaction?: number; // max mint per transaction for all phases
  phases: MintPhase[]; // the mint phases
}

interface MintPhase {
  maxMintsPerWallet: number; // limit of mint per wallet for this phase
  maxMintPerTransaction?: number; // max mint per transaction for this phases
  startTime: number; // timestamp, in seconds, for start mint phase
  // 	"startTime": number | { abi, functionName, pathToValue },
  endTime: number; // timestamp, in seconds, for end mint phase
  price: string; // in wei
  currency?: string; // contract address, undefined or address(0) if native
  tx: TxBuild; // the data to build the transaction to mint
}

interface TxBuild {
  to?: `0x${string}`; // what contract to call. if undefined, current collection. if defined, must satisfy the regex /0x[a-fA-F0-9]{40}/
  method: `0x${string}`; // method signature, must satisfy the regex: /0x[a-f0-9]{8}/
  params?: TxParam[]; // the params to build the transaction
}

interface TxParam {
  name: string; // name of the param, to display to the users if needed
  abiType: string; // abi type to encode it
  value?: any; // value for that parameter. type must satisfy "abiType". if set, kind and values are ignored.
  kind?: TxParamKind; // keyword for some kind of params
  values?: TxParamValues; // the possible values.
}

type TxParamKind = "RECIPIENT" | "QUANTITY" | "MAPPING_RECIPIENT";

// RECIPIENT -> The address to which the NFT has to be minted to
// QUANTITY -> The quantity to mint
// MAPPING_RECIPIENT -> If present, the TxParam "values" must be set and should be a a mapping(address => abiType)
//                      This can only be used with a field of kind: "RECIPIENT" and only if "RECIPIENT" is present in the mapping

type TxParamValues = Record<string, string> | TxParamValuesOption[];

type TxParamValuesOption = { label: string; value: any }; // value type must satisfy the abiType for that TxParam
```

Example of contractURI() json:

```json
{
	"name": "My NFT Collection",
	"description": "This is the best NFT Collection",
	"image": "ipfs://Qm....",
	"mintConfig": {
		maxSupply: 10000,
		phases: [
			{
				maxMintsPerWallet: 1, // only 1 mint per wallet for this phase
				startTime: 1702460000,
				endTime: 1702463600,
				price: '50000000000000000', // 0.05 price
				tx: {
					// what contract to call, "minter pattern"
					to: '0x0000000000000000000000000000000000000002',
					// method signature
					method: '0x0000aa',
					// method params
					params: [
						// force an arbitrary value 42 for this parameter
						{ name: "arbitraryValue", abiType: "uint256", value: 42 },
						// allows opened string value for this parameters
						{ name: "comment", abiType: "string" },
						// need to do a choice between 4 values for this param
						{ name: "theme", abiType: "uint256", values: [{ label: 'red', value: 1}, { label: 'green', value: 2}, {label: 'blue', value: 3}, {label:'gold',value: 4}]}
					],
				}
			},
			{
				maxMintsPerWallet: 1, // only 1 mint per wallet for this phase
				startTime: 1702460000,
				endTime: 1702463600,
				price: '75000000000000000', // 0.075 price
				tx: {
					// what contract to call, "minter pattern"
					to: '0x0000000000000000000000000000000000000002',
					// method signature
					method: '0x0000bb',
					// method params
					params: [
						// recipient parameter
						{ name: "recipient", abiType: "address", kind: "RECIPIENT" },
						// force an arbitrary value 42 for this parameter
						{ name: "quantity", abiType: "uint256", kind: "QUANTITY" },
						// proof allowing to mint
						{
							name: "proof",
							abiType: "bytes",
							kind: "MAPPING_RECIPIENT",
							values: {
								"0x0000000000000000000000000000000deadbeef1": "0x14e7c5ea3a66fcc78a4923ef9db55fab89302a507802a3995f4e5dbc69f76920",
								"0x0000000000000000000000000000000deadbeef2": "0xda093f3e739004ec4c1c46ede38a7d1e06d2c6a8c77a9f6783961efca7e82f24",
								"0x0000000000000000000000000000000deadbeef3": "0xb4b2301c3ea107c4363e7b847ae1a959cacb4219680d4214797729d6691e2bf4",
								"0x0000000000000000000000000000000deadbeef4": "0x94deb2a5f7a76bc1553595d5bd8c9fe9173c5c383a1db1a7035945bbefdf297a",
							}
						},
					],
				},
				{
				startTime: 1702460000,
				endTime: 1702463600,
				maxMintPerTransaction: 10, // 10 mints per transaction
				price: '90000000000000000', // 0.09 price for this phase
				tx: {
					// no `to` meaning the contract to call is the current collection
					// method signature
					method: '0x0000cc',
					// method params
					params: [
						// recipient parameter
						{ name: "recipient", abiType: "address", kind: "RECIPIENT" },
						// force an arbitrary value 42 for this parameter
						{ name: "quantity", abiType: "uint256", kind: "QUANTITY" },
					],
				}
			}
		]
	}
}
```
