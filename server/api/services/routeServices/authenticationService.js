export const authenticate = async ({ email, password, isEmployee }) => {
  // if (!email || !password) throw new ValidationError("Missing credentials.");
  // const Model = isEmployee ? Employees : Applicants;
  // const userDataFromDB = await Model.findOne({ email });
  // if (!userDataFromDB) return { success: false, isWrongEmailOrPassword: true };
  // const userDataFromDBJsObject = userDataFromDB.toObject();
  // const match = await bcrypt.compare(password, userDataFromDBJsObject.password);
  // if (!match) return { success: false, isWrongEmailOrPassword: true };
  // if (!userDataFromDBJsObject.isEmailConfirmed) {
  //   return { success: false, isEmailTokenConfirmed: false };
  // }
  // const tokenData = {
  //   email,
  //   userId: userDataFromDB._id,
  //   companyId: userDataFromDB.companyId
  // };
  // const dataForLocalStorage = {};
  // if (isEmployee) {
  //   const companyDataFromDB = await Companies.findById(userDataFromDB.companyId);
  //   if (!companyDataFromDB) throw new InternalServerError("Login - Company not found while employee was found.");
  //   dataForLocalStorage.companyName = companyDataFromDB.name;
  //   dataForLocalStorage.isNewToTour = userDataFromDB.isNewToTour;
  //   tokenData.companyId = userDataFromDB.companyId;
  //   if (userDataFromDB.accessLevel) {
  //     tokenData.accessLevel = userDataFromDB.accessLevel;
  //     dataForLocalStorage.accessLevel = userDataFromDB.accessLevel;
  //   }
  // }
  // const token = await generateAuthToken(tokenData);
  // dataForLocalStorage.token = token;
  // dataForLocalStorage.email = userDataFromDB.email;
  // dataForLocalStorage.firstName = userDataFromDB.firstName;
  // dataForLocalStorage.lastName = userDataFromDB.lastName;
  // dataForLocalStorage.roleType = isEmployee ? "employee" : "applicant";
  // return { userData: dataForLocalStorage, success: true };
};

export const register = async ({ email, password, firstName, lastName, mobile, country, companyName }) => {
  // if (!email || !password || !firstName || !lastName || !mobile || !country || !companyName) {
  //   throw new ValidationError("Missing credentials.", 400, "missingFields");
  // }

  // const employeeFromDB = await Employees.findOne({ email });
  // if (employeeFromDB) throw new ValidationError("User already exists", 409, "userExists");

  // const newCompany = {
  //   name: companyName
  // };

  // const resultsCompany = await Companies.create(newCompany);

  // if (!resultsCompany._id) throw new DatabaseError("Failed to insert company");

  // const hashedPass = await bcrypt.hash(password, config.saltRounds);

  // const newUser = {
  //   email,
  //   password: hashedPass,
  //   firstName,
  //   lastName,
  //   mobile,
  //   country,
  //   companyName,
  //   isEmailConfirmed: false,
  //   status: "active",
  //   accessLevel: "root",
  //   companyId: resultsCompany._id,
  //   permissions: {
  //     creatingJobs: true,
  //     creatingAiInterviews: true,
  //     viewingReports: true,
  //     changingApplicantStatus: true,
  //     addingUsers: true,
  //     editingAndDeletingUsers: true
  //   }
  // };

  // const resultsEmployee = await Employees.create(newUser);
  // if (!resultsEmployee._id) throw new DatabaseError("Failed to insert user");

  // OPTIONALLY IMPLEMENT THIS LATER

  // const emailVerficationToken = await generateAuthTokenEmailVerification({ id: resultsEmployee._id });
  // const schedulingLink = `${config.webDomain}/verify-employee?token=${emailVerficationToken}`;

  // await sendEmail(
  //   SIGN_UP_VERIFICATION,
  //   { schedulingLink, employeeFirstName: firstName, emailShouldBeVerifiedInXHours: config.emailShouldBeVerifiedInXHours },
  //   email
  // );

  // return { success: true };
};
