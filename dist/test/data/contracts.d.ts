declare const _default: ({
    address: string;
    contractURI: {
        mintConfig: {
            phases: {
                startTime: number;
                endTime: number;
                tx: {
                    method: string;
                    params: ({
                        name: string;
                        abiType: string;
                        value: (string | never[])[];
                        kind?: undefined;
                    } | {
                        kind: string;
                        name: string;
                        abiType: string;
                        value?: undefined;
                    } | {
                        name: string;
                        abiType: string;
                        value: string;
                        kind?: undefined;
                    })[];
                };
            }[];
        };
    };
} | {
    address: string;
    contractURI: {
        mintConfig: {
            phases: {
                startTime: number;
                endTime: number;
                tx: {
                    method: string;
                };
            }[];
        };
    };
} | {
    address: string;
    contractURI: {
        mintConfig: {
            phases: {
                startTime: number;
                endTime: number;
                price: {
                    abi: {
                        inputs: never[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                    }[];
                    functionName: string;
                };
                tx: {
                    to: string;
                    method: string;
                    params: ({
                        kind: string;
                        name: string;
                        abiType: string;
                        value?: undefined;
                    } | {
                        name: string;
                        abiType: string;
                        value: number;
                        kind?: undefined;
                    } | {
                        name: string;
                        abiType: string;
                        value: never[];
                        kind?: undefined;
                    })[];
                };
            }[];
        };
    };
})[];
export default _default;
//# sourceMappingURL=contracts.d.ts.map