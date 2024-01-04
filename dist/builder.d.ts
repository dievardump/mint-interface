import { Phase } from "./phase.js";
import type { BuilderConfig, MintConfig } from "./types.d";
export declare const TxParamKind: string[];
export declare function parseConfig(mintConfig: MintConfig, config: BuilderConfig): Promise<Builder>;
export declare class Builder {
    mintConfig: MintConfig;
    config: BuilderConfig;
    provider: any;
    maxSupply: number;
    private _phases;
    constructor(mintConfig: MintConfig, config: BuilderConfig);
    load(): Promise<void>;
    get phases(): Phase[];
    getPhasesAt(timestamp: number): Promise<Phase[]>;
    getCurrentPhases(): Promise<Phase[]>;
    private valueOrContractCall;
}
//# sourceMappingURL=builder.d.ts.map