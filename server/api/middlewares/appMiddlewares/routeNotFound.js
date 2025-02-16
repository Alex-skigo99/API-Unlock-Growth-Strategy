import { ValidationError } from "../../services/innerServices/errors/CustomErrors.js";

const routeNotFound = () => {
  throw new ValidationError("The requested endpoint could not be found on this server.", 404);
};

export default routeNotFound;
