type Role = "SUPER_ADMIN" | "INSTITUTION_ADMIN" | "STUDENT";
type Sort = object[];

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

interface Pagination {
  limit: number;
  offset: number;
  page: number;
  size: number;
}
