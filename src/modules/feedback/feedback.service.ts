import { Feedback, Student } from "@prisma/client";
import ApiError from "../../helper/classes/api-error";
import { prisma } from "../../prisma";
import emails from "../../helper/functions/mailer";

const include_query = {
  student: {
    select: {
      id: true,
      name: true,
      email: true,
      institution: { select: { id: true, name: true, location: true } },
      department: { select: { id: true, name: true } },
    },
  },
};

export async function createStudentFeedback(
  student: Student,
  feedback: string
) {
  const institution = await prisma.institutions.findUnique({
    where: { id: student.institution_id },
  });
  if (!institution) throw new ApiError("Instituiton not found", 404);
  const studentFeedback = await prisma.feedback.create({
    data: {
      feedback,
      student_id: student.id,
    },
  });

  // sent feedbacks back to super admin via email
  await emails.feedback(
    {
      email: student.email,
      name: student.name,
      institution: institution.name,
    },
    feedback
  );

  return { feedback: studentFeedback };
}

export async function fetchAllFeedbacks(): Promise<Feedback[]> {
  return await prisma.feedback.findMany({
    include: include_query,
  });
}

export async function fetchSingleFeedback(id: string): Promise<Feedback> {
  const feedback = await prisma.feedback.findUnique({
    where: { id },
    include: include_query,
  });
  if (!feedback) throw new ApiError("Feedback not found", 404);

  return feedback;
}

export async function deleteSingleFeedback(id: string) {
  const feedback = await prisma.feedback.findUnique({
    where: { id },
  });
  if (!feedback) throw new ApiError("Feedback not found", 404);
  await prisma.feedback.delete({ where: { id } });
  return { message: "Feedback deleted" };
}
