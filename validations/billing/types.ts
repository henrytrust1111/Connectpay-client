import { z } from "zod";
import { fundWalletSchema, estimateCostSchema } from ".";

export type FundWalletSchemaType = z.infer<typeof fundWalletSchema>;
export type EstimateCostSchemaType = z.infer<typeof estimateCostSchema>;