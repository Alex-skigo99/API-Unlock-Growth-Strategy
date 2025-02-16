const allowedUserStatus = ["active", "suspended"];

const validateEmail = (email) => {
  const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

const isAllowedUserStatus = (status) => allowedUserStatus.includes(status);

const isAllowedAccessLevel = (status) => ["root", "manager", "regular"].includes(status);

// TODO - init from db later

const validatedJobStatus = (jobStatus) => ["draft", "published", "completed", "paused"].includes(jobStatus.value);

const validatedRoleTypes = (roleType) =>
  [
    "accountant",
    "salesman",
    "programmingAndTech",
    "construction",
    "management",
    "salesAndMarketing",
    "marketing",
    "aiContentAndTranslation",
    "legalAndFinance",
    "designAndCreative",
    "operationManager",
    "recruiter"
  ].includes(roleType);

const validatedWorkplace = (workplace) => ["hybrid", "remote", "onsite"].includes(workplace);

const validateUsStates = (state) => !state || ["states", "..."].includes(state);

export default {
  validatedJobStatus,
  validateEmail,
  isAllowedUserStatus,
  isAllowedAccessLevel,
  validatedRoleTypes,
  validatedWorkplace,
  validateUsStates
};
