module.exports = class ApiError extends Error {
  statusCode;
  error;
  visible;
  path;
  constructor(statusCode, visible, message, path, error) {
    super(message);
    this.statusCode = statusCode;
    this.visible = visible;
    this.error = error;
    this.path = path;
  }

  static BadRequest(visible, message, path, error) {
    return new ApiError(400, visible, message, path, error)
  };
  static Unauthorized() {
    return new ApiError(401, true, "User not authorized", null, { unauthorized: true });
  }
  static Forbidden(path) {
    return new ApiError(403, true, "User access denied for this service", path, true);
  }
  static ServerError(visible, message, path, error) {
    return new ApiError(500, visible, message, path, error);
  }
}