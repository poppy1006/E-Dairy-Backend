import ApiError from "../../helper/classes/api-error";
import excludeFields from "../../helper/functions/execludeFields";
import { prisma } from "../../prisma";

export async function setCardStatus(id: string, status: boolean) {
  const student = await prisma.student.findUnique({
    where: { id },
    include: { id_card: { select: { id: true } } },
  });

  if (!student) throw new ApiError("User not found", 404);

  const card = await prisma.iDcard.update({
    where: { id: student.id_card[0].id, student_id: id },
    data: { active: status },
  });

  return {
    student: excludeFields(student, ["password", "otp"]),
    card,
    message: status
      ? "Your Card has been Reactivated"
      : "Your Card has been Deactivated",
  };
}

export async function fetchCardDetails(id: string) {
  const card = await prisma.iDcard.findUnique({ where: { student_id: id } });

  if (!card) throw new ApiError("No card associated with you found", 404);

  return card;
}

export async function setCardLimit(student_id: string, limit: string) {
  const card = await prisma.iDcard.findUnique({ where: { student_id } });

  if (!card) throw new ApiError("No card associated with you found", 404);

  const updatedCard = await prisma.iDcard.update({
    where: { student_id },
    data: { transaction_limit: limit },
    include: { student: { select: { id: true, name: true, email: true } } },
  });

  return {
    card: updatedCard,
    message: `A limit of Rs.${
      parseInt(limit) / 100
    } has been set on your card!`,
  };
}
