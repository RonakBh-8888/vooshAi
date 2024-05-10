


class User {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        //this.response = new rm.responseService(this.req, this.res);
        this.usersModal = global.datastores['iam'].models['users'];
       
    }

}