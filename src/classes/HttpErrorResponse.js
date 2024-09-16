class HttpErrorResponse extends Error {
  status;
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export default HttpErrorResponse;
