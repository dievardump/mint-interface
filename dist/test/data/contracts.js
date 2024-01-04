"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
    {
        address: "0x112423592fc313ef04a1c147a7ae3dadb99d7cdd",
        contractURI: {
            mintConfig: {
                phases: [
                    {
                        startTime: 0,
                        endTime: 0,
                        tx: {
                            method: "0x4a21a2df",
                            params: [
                                {
                                    name: "phase",
                                    abiType: "(bytes32,bytes32[])",
                                    value: [
                                        "0x0000000000000000000000000000000000000000000000000000000000000000",
                                        [],
                                    ],
                                },
                                { kind: "QUANTITY", name: "quantity", abiType: "uint256" },
                                {
                                    kind: "REFERRAL",
                                    name: "referral",
                                    abiType: "address",
                                },
                                {
                                    name: "proof",
                                    abiType: "bytes",
                                    value: "0x",
                                },
                            ],
                        },
                    },
                ],
            },
        },
    },
    {
        address: "0x4ad98b1926dd8fca10da8a8dfd806f28f81e8712",
        contractURI: {
            mintConfig: {
                phases: [
                    {
                        startTime: 0,
                        endTime: 0,
                        tx: {
                            method: "0x1249c58b",
                        },
                    },
                ],
            },
        },
    },
    {
        address: "0x8b81aef8446379B4aC6B32ac2Ca169130AD8aAAB",
        contractURI: {
            mintConfig: {
                phases: [
                    {
                        startTime: 0,
                        endTime: 0,
                        price: {
                            abi: [
                                {
                                    inputs: [],
                                    name: "cost",
                                    outputs: [
                                        { internalType: "uint256", name: "", type: "uint256" },
                                    ],
                                    stateMutability: "view",
                                    type: "function",
                                },
                            ],
                            functionName: "cost",
                        },
                        tx: {
                            to: "0x3f2b729a029a72742db2d5a0b081ae1cda7c774d",
                            method: "0xe6d37b88",
                            params: [
                                { kind: "QUANTITY", name: "quantity", abiType: "uint256" },
                                {
                                    name: "something",
                                    abiType: "uint256",
                                    value: 0,
                                },
                                {
                                    name: "proof",
                                    abiType: "bytes32[]",
                                    value: [],
                                },
                            ],
                        },
                    },
                ],
            },
        },
    },
];
//# sourceMappingURL=contracts.js.map