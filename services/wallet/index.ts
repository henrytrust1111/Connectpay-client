// Wallet service functions
import apiRequest from "@/api";
import { createResponse } from "@/helpers";
import { XiorError } from "xior";

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export const createWallet = async () => {
  if (USE_MOCK_DATA) {
    return createResponse(true, {
      walletId: 'wallet_123',
      balance: 0,
      currency: 'USD'
    }, "Wallet created successfully", 200);
  }

  try {
    const response = await apiRequest.post("/wallet/create");
    return createResponse(true, response?.data, "Wallet created successfully", response?.status);
  } catch (error) {
    let message: string, status: number | undefined;
    if (error instanceof XiorError) {
      message = error?.response?.data?.message || error.message;
      status = error?.response?.status;
    } else {
      message = (error as { message: string })?.message;
    }
    return createResponse(false, null, message, status);
  }
};

export const getWalletBalance = async () => {
  if (USE_MOCK_DATA) {
    return createResponse(true, {
      balance: 150.75,
      currency: 'USD',
      transactions: [
        { id: 1, amount: 50.00, type: 'credit', description: 'Top up' },
        { id: 2, amount: -25.50, type: 'debit', description: 'Payment' }
      ]
    }, "Balance fetched successfully", 200);
  }

  try {
    const response = await apiRequest.get("/wallet/balance");
    return createResponse(true, response?.data, "Balance fetched successfully", response?.status);
  } catch (error) {
    let message: string, status: number | undefined;
    if (error instanceof XiorError) {
      message = error?.response?.data?.message || error.message;
      status = error?.response?.status;
    } else {
      message = (error as { message: string })?.message;
    }
    return createResponse(false, null, message, status);
  }
};