

class ResponseService {
    constructor (req, res){
        this.req = req;
        this.res = res;
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
        //   const output = rm.utils.apiResFormat(data);
        //  output.requestId = this.req.requestId;
        //   if (this.req.headers["encoding"] == "gzip") {
        //     var deflated = rm.zlib
        //       .deflateSync(JSON.stringify(output))
        //       .toString("base64");
        //     var inflated = rm.zlib.inflateSync(new Buffer(deflated, 'base64')).toString();
        //     return this.res.status(200).send(data);
        //   } else {
            return this.res.status(200).send(data);
         // }
        } catch (error) {
          this.serverError(error);
        } finally {
            --global.pendingRequest;
        }
      }

    serverError(error) {
        try {
        //   rm.logger.error(error, this.req);
        //   const output = rm.utils.apiResFormat(
        //     {
        //       message: error?.message || this.req.__("Errors.InternalServerError"),
        //     },
        //     "error"
        //   );
        //   output.requestId = this.req.requestId;
        //   output.stackTrace = error.stack;
        //   output.details = error.details || {};
          return this.res.status(500).send(error);
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