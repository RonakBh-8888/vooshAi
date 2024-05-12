class ResponseService {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  apiResFormat(params = {}, type = "success") {
    if (type === "success") {
      return {
        success: true,
        data: params.data,
        message: params.message || null,
      };
    } else {
      return { success: false, message: params.message || null };
    }
  }

  failure(data) {
    try {
      const output = this.apiResFormat(data, "error");
      output.requestId = this.req.requestId;
      output.details = data.details || {};

      return this.res.status(400).send(output);
    } catch (error) {
      this.serverError(error);
    } finally {
        --global.pendingRequest;
    }
  }

  unAuthorizedError(args = {}) {
    try {
      const output = {
        success: false,
        message: args.message || this.req.__("Account.AuthFailure"),
      };
      return this.res.status(401).send(output);
    } catch (error) {
      this.serverError(error);
    } finally {
      --global.pendingRequest;
    }
  }

  success(data) {
    try {
      const output = this.apiResFormat(data);
      //output.requestId = this.req.requestId; -- not required now
     
      return this.res.status(200).send(output);
    } catch (error) {
      this.serverError(error);
    } finally {
      --global.pendingRequest;
    }
  }

  serverError(error) {
    try {
      const output = this.apiResFormat(
        {
          message: error?.message || this.req.__("Errors.InternalServerError"),
        },
        "error"
      );
      output.requestId = this.req.requestId;
      output.stackTrace = error.stack;
      output.details = error.details || {};
      return this.res.status(500).send(output);
    } catch (error) {
      this.serverError(error);
    } finally {
      --global.pendingRequest;
    }
  }

  apiNotFound() {
    try {
      return this.res
        .status(404)
        .send({ message: this.req.__("Errors.APINotFound"), success: false });
    } catch (error) {
      this.serverError(error);
    } finally {
      --global.pendingRequest;
    }
  }
}

module.exports = ResponseService;
