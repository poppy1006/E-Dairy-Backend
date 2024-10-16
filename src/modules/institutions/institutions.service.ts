import { prisma } from "../../prisma";
import ApiError from "../../helper/classes/api-error";
import { Department, Institutions, Student } from "@prisma/client";
import excludeFields from "../../helper/functions/execludeFields";
import { prismaErrorHandler } from "../../middleware/error-handler";
export async function createInstitution(data: Institutions) {
  const institution = await prisma.institutions.create({ data });

  return institution;
}

export async function fetchSingleInstitution(id: string) {
  const institution = await prisma.institutions.findUnique({
    where: { id },
    include: { students: true, admin: true },
  });

  if (!institution) throw new ApiError("No institution found", 404);
  return institution;
}

export async function fetchAllInstitution(): Promise<{
  institutions: ({
    Department: Department[];
  } & Institutions)[];
  count: number;
}> {
  const institutions = await prisma.institutions.findMany({
    include: { Department: true },
  });

  return { institutions, count: institutions.length };
}

export async function deleteInstitution(id: string) {
  if (!(await prisma.institutions.findUnique({ where: { id } })))
    throw new ApiError("No institution found", 404);

  const students = await prisma.student.findMany({
    where: { institution_id: id },
  });

  if (students.length > 0)
    throw new ApiError(
      "Deletion of this institution is not possible due to the presence of currently enrolled active students."
    );

  await prisma.institutions.delete({ where: { id } });

  return { message: "Institution deleted successfully!" };
}

export async function updateInstitutionDetails(id: string, data: Institutions) {
  const institutionExist = await prisma.institutions.findUnique({
    where: { id },
  });

  if (!institutionExist) throw new ApiError("institution does not exist!", 404);

  const updateData: {
    name?: string;
    location?: string;
  } = {};

  data.name && (updateData["name"] = data.name);
  data.location && (updateData["location"] = data.location);

  const institution = await prisma.institutions.update({
    where: { id },
    data: updateData,
  });

  return institution;
}

export async function viewStudents(id: string) {
  const institutionExist = await prisma.institutions.findUnique({
    where: { id },
  });

  if (!institutionExist) throw new ApiError("institution does not exist!", 404);

  const studentsArr = await prisma.student.findMany({
    where: { institution_id: id },
  });

  let students: any[] = [];
  studentsArr.map((student) => {
    students.push(excludeFields(student, ["password", "otp"]));
  });

  studentsArr.filter(() => {});

  return students;
}

export async function fetchAllDepartmentFromAnInstitution(
  institution_id: string
): Promise<Department[]> {
  if (
    !(await prisma.institutions.findUnique({
      where: { id: institution_id },
    }))
  ) {
    throw new ApiError("Institution not found", 404);
  }

  const departments = await prisma.department.findMany({
    where: { institution_id },
  });

  return departments;
}

export async function createDepartment(
  data: Department,
  id: string
): Promise<Department> {
  if (
    !(await prisma.institutions.findUnique({
      where: { id },
    }))
  ) {
    throw new ApiError("Instition not found", 404);
  }

  const department = await prisma.department.create({
    data: { name: data.name, institution_id: id },
    include: { institution: true },
  });

  return department;
}

export async function fetchSingleDepartment(
  department_id: string
): Promise<Department> {
  const department = await prisma.department.findUnique({
    where: { id: department_id },
    include: { institution: true },
  });

  if (!department) throw new ApiError("Department not found", 404);

  return department;
}

export async function deleteSingleDepartment(department_id: string) {
  const department = await prisma.department.findUnique({
    where: { id: department_id },
  });
  if (!department) throw new ApiError("Department not found", 404);

  // check for students // if students exist throw error
  const studentExist = await prisma.student.findMany({
    where: { department_id },
  });
  if (studentExist.length > 0)
    throw new ApiError(
      "Deletion of this department is not possible due to the presence of currently enrolled active students."
    );

  await prisma.department.delete({ where: { id: department_id } });

  return { message: `${department.name} Department deleted successfully!` };
}
