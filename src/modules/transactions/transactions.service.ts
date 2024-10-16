import { $Enums, POS, Transactions } from "@prisma/client";
import ApiError from "../../helper/classes/api-error";
import { prisma } from "../../prisma";

export async function getAllTransactions(
  student_id?: string,
  recent?: boolean,
  isAdmin?: boolean
): Promise<{
  transactions: Transactions[];
  count: number;
}> {
  if (isAdmin) {
    const [transactions, count] = await prisma.$transaction([
      prisma.transactions.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.transactions.count(),
    ]);
    return { transactions, count };
  } else {
    const wallet = await prisma.wallet.findUnique({
      where: { student_id },
    });
    if (!wallet) throw new ApiError("Wallet not found", 404);

    const [transactions, count] = await prisma.$transaction([
      prisma.transactions.findMany({
        where: { wallet_id: wallet.id },
        orderBy: { createdAt: "desc" },
        take: recent ? 4 : undefined,
      }),
      prisma.transactions.count({
        where: { wallet_id: wallet.id },
        orderBy: { createdAt: "desc" },
        take: recent ? 4 : undefined,
      }),
    ]);

    return { transactions, count };
  }
}

export async function fetchSingleTransactionDetails(id: string) {
  const transaction = await prisma.transactions.findUnique({
    where: { id },
    include: { wallet: true },
  });

  if (!transaction)
    throw new ApiError("transaction with the specified id not fund", 404);

  return transaction;
}

export async function createTransaction(
  data: Transactions,
  student_id: string
): Promise<Transactions | undefined> {
  const wallet = await prisma.wallet.findUnique({ where: { student_id } });
  const card = await prisma.iDcard.findUnique({ where: { student_id } });
  let transaction;

  if (!wallet) throw new ApiError("Wallet not found", 404);

  // TODO: incl bank logic
  if (data.transaction_type === "CREDIT") {
    // #################### CREDIT #################### //
    // TODO: add amount to Escrow account

    try {
      await prisma.$transaction(async (tx) => {
        // update wallet balance
        await tx.wallet.update({
          where: { id: wallet.id },
          data: {
            balance: wallet.balance + data.amount,
          },
        });

        transaction = await tx.transactions.create({
          data: {
            amount: data.amount,
            description: data.description,
            wallet_id: wallet.id,
            transaction_type: data.transaction_type,
            transaction_date: new Date(),
          },
          include: { wallet: true },
        });
      });
    } catch (error) {
      throw error;
    }
  } else if (data.transaction_type === "DEBIT") {
    // #################### DEBIT #################### //

    if (!card) throw new ApiError("Card not found", 404);
    if (!card.active)
      throw new ApiError("Your card is disabled. Please try again.");

    if (wallet.balance < data.amount) throw new ApiError("Insufficent balance");

    const pos = await prisma.pOS.findUnique({
      where: { id: <string>data.pos_id },
    });
    if (!pos) throw new ApiError("POS not found", 404);

    // add amount to POS amount_to_withdraw field
    try {
      await prisma.$transaction(async (tx) => {
        await tx.pOS.update({
          where: { id: <string>data.pos_id },
          data: { amount_to_withdraw: pos.amount_to_withdraw + data.amount },
        });

        // update wallet balance
        await tx.wallet.update({
          where: { id: wallet.id },
          data: {
            balance: wallet.balance - data.amount,
          },
        });

        transaction = await tx.transactions.create({
          data: {
            amount: data.amount,
            description: data.description,
            wallet_id: wallet.id,
            transaction_type: data.transaction_type,
            pos_id: data.pos_id,
            transaction_date: new Date(),
          },
          include: { wallet: true },
        });
      });
    } catch (error) {
      throw error;
    }
  }

  return transaction;
}
