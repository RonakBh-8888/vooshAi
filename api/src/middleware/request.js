module.exports = (req, res, next) => {
	try {
		//let locale = 'en_US';
		++global.pendingRequest;
		global.headers = {
			authorization: req.headers.authorization,
			idtoken: req.headers.idtoken,
		};
		if (req?.headers?.usermeta) {
			req.headers.usermeta = JSON.parse(req.headers.usermeta);
		}
		next();
	} catch (error) {
		next(error);
	}
};