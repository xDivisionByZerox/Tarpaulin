
module.exports.isAuthorizedToCreateCourse = (auth_role) => {
  if (auth_role != 'admin') {
    throw new PermissionError('The request was not made by an authenticated User satisfying the authorization criteria.');
  }
}
