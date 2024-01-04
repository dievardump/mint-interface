import { Builder } from "./builder.js";
import type { MintPhase, TxParam } from "./types.d";
export declare class Phase {
    phase: MintPhase;
    parent: Builder;
    globalMaxMintPerWallet: number;
    globalMaxMintPerTransaction: number;
    constructor(phase: MintPhase, globalMaxMintPerWallet: number, globalMaxMintPerTransaction: number, parent: Builder);
    get startTime(): number;
    get endTime(): number;
    get maxMintsPerWallet(): number;
    get maxMintPerTransaction(): number;
    get price(): string | null;
    get currency(): string | null;
    get isOpen(): boolean;
    hasRecipient(): TxParam | undefined;
    hasQuantity(): TxParam | undefined;
    hasMappingRecipient(): TxParam | undefined;
    maxMint(): number;
    getParams(): TxParam[];
    buildTransaction(inputs: Record<string, any>): {
        to: string | undefined;
        data: string;
    };
    format(): any;
}
//# sourceMappingURL=phase.d.ts.map