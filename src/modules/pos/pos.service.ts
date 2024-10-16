import { Request } from "express";
import ApiError from "../../helper/classes/api-error";
import excludeFields from "../../helper/functions/execludeFields";
import { prisma } from "../../prisma";

// TODO: change any to a type // Refactor: authorize middleware
export async function createPOS(body: Request["body"], institution_id: string) {
  const pos = await prisma.pOS.create({
    data: {
      location: body.location,
      institution_id,
      account_details: body.account_details,
    },
  });

  return pos;
}

export async function fetchSinglePOSDetails(id: string) {
  const pos = await prisma.pOS.findUnique({
    where: { id },
    include: { Transactions: true, institution: true },
  });

  return pos;
}

export async function editPOS(id: string, body: Request["body"]) {
  const posExists = await prisma.pOS.findUnique({ where: { id } });

  if (!posExists) throw new ApiError("POS not found", 404);

  const pos = await prisma.pOS.update({
    where: { id },
    data: {
      account_details: body.account_details,
      location: body.location,
    },
  });

  return pos;
}

export async function fetchAllPOS() {
  const pos = await prisma.pOS.findMany({ include: { institution: true } });

  return pos;
}
