export class ApiError extends Error {
  constructor(status, code, message, fields = undefined) {
    super(message);
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

export function notFound(message = "Resource not found.") {
  return new ApiError(404, "not_found", message);
}

export function validationError(fields, message = "One or more fields are invalid.") {
  return new ApiError(422, "validation_error", message, fields);
}

export function unauthorized(message = "Unauthorized.") {
  return new ApiError(401, "unauthorized", message);
}

export function forbidden(message = "Forbidden.") {
  return new ApiError(403, "forbidden", message);
}

export function errorHandler(error, _req, res, _next) {
  if (error instanceof ApiError) {
    const body = {
      error: {
        code: error.code,
        message: error.message,
      },
    };

    if (error.fields) {
      body.error.fields = error.fields;
    }

    return res.status(error.status).json(body);
  }

  console.error(error);
  return res.status(500).json({
    error: {
      code: "internal_error",
      message: "An unexpected error occurred.",
    },
  });
}
