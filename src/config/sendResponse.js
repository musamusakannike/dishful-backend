const sendResponse = (res, status, message, data = null) => {
  // Check validity of HTTP status
  if (!isValidHttpStatus(status)) {
      status = 500; // Default to Internal Server Error for invalid status
      message = "Internal Server Error";
  }

  const isSuccessStatus = [200, 201, 204].includes(status);
  const responsePayload = isSuccessStatus && status === 204
      ? { status: "SUCCESS", message }
      : { status: isSuccessStatus ? "SUCCESS" : "ERROR", message, data };

  return res.status(status).json(responsePayload);
};

const isValidHttpStatus = (status) => {
  return status >= 100 && status < 600; // Valid range for HTTP status codes
};

module.exports = sendResponse;
