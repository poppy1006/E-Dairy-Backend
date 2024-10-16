import AdminController from "./admin/admin.controller";
import StudentController from "./student/student.controller";
import InstitutionsController from "./institutions/institutions.controller";
import CardController from "./card/card.controller";
import TransactionsController from "./transactions/transactions.controller";
import POSController from "./pos/pos.controller";
import FeedbackController from "./feedback/feedback.controller";

export const controllers = [
  AdminController,
  StudentController,
  InstitutionsController,
  CardController,
  // TransactionsController,
  POSController,
  FeedbackController,
];
