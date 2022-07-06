const { response } = require("express");
const { create, getUsers, getUserByUserId, updateUser, deleteUser, getUserByUserEmail,getUserdetailsByUserEmail } =  require("./user.service");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports = {
    createUser: (req, res) => {
        const body = req.body
        console.log(body);
        console.log("Print Password --->>", body.password);
        console.log("Print Name --->>", body.name);
        console.log("Print Email --->>", body.email);
        const salt = genSaltSync(10);
        body.password = hashSync(body.password,salt);
        //console.log("Insert Password ==>",body.password);
        create(body, (err, results) => {
            //console.log("Error Msg====>",err.code);

            if(err)
            {
                if (err.code == "ER_DUP_ENTRY") {
                    console.log(err);
                    return res.status(500).json({
                        success: 1062,
                        message: "Duplicate Entry for Email address field is not allowed."
                    });
                }

                else if (err) {
                    console.log(err);
                    return res.status(500).json({
                        success: 0,
                        message: "DB Connection Failed."
                    });
                }
            }

            return res.status(200).json({
                success: 1,
                //data: results,
                message: "New User Created Sucessfully"
            });
        });
    },

    getUserByUserId: (req, res) => {
        const id = req.params.id;
        getUserByUserId(id, (err, results) => {
            if(err){
                console.log(err);
                return err;
            }
            if(!results){
                return res.json({
                    success: 0,
                    message: "Record Not Found."
                });
            }
            return res.json({
                success: 1,
                data: results
            });
        });
    },

    getUserdetailsByUserEmail: (req, res) => {
        const email = req.params.email;

        getUserdetailsByUserEmail(email, (err, results) => {
            if(err){
                console.log(err);
                return;
            }
            if(!results){
                console.log("Email ==>>"+email);
                return res.json({
                    emailadd : email,
                    success: 0,
                    message: "Record Not Found."
                });
            }
            return res.json({
                success: 1,
                data: results
            });
        });
    },

    getUsers: (req, res) => {
        getUsers((err, results) => {
            if(err){
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            });
        });
    },

    updateUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        updateUser(body, (err, results) => {
            if(err){
                console.log(results)
                console.log(err);
                return res.json({
                    success: 0,
                    message: "Filed to update User Details."
                });
            }
            if(!results){
                return res.json({
                    success: 0,
                    message: "Filed to update User Details."
                });
            }
            console.log(results)
            if(results.changedRows != 0)
            {
                return res.json({
                    success: 1,
                    message: "User Details Updated Successfully."
                });
            }

            return res.json({
                success: 1,
                message: "User Not Found with this UserID."
            });

        });
    },

    deleteUser: (req, res) => {
        const data = req.body;
        deleteUser(data, (err, results) => {
            console.log("Delete Call Result==> ",results);
            if(err){
                console.log(err);
                return;
            }
            if(!results){
                console.log(results);
                return res.json({
                    success: 0,
                    message: "Record Not Found."
                });
            }
            if(results.affectedRows != 0)
            {
                return res.json({
                    success: 1,
                    message: "User Deleted Successfully."
                });
            }

            return res.json({
                success: 1,
                message: "User Not Found with this UserID."
            });

        });
    },

    login: (req, res) => {
        try{
        const body = req.body;
        getUserByUserEmail(body.email, (err, results) => {
            console.log("Error ==>",err);
            console.log("Is active ==>>", results.isActive);
            if(err){
                console.log(err);
                return;
            }
            if(!results){
                return res.json({
                    success: 0,
                    message: "Invalid Email or Password."
                });
            }
            const result = compareSync(body.password, results.password);
            if(result && results.isActive){
                console.log("User Exists");
                console.log("Result ==>",result);
                results.password = undefined;
                const jsontoken = sign({ result: results }, "abcdQ123", {
                    expiresIn: "60m"
                });

                //console.log(cookie);
                // return res.json({
                //     success: 1,
                //     message: "Login Successfully.",
                //     token: jsontoken
                // });

                // return res.cookie('token', jsontoken, {
                //     // expires: new Date(Date.now() + expiration), // time until expiration
                //     secure: false, // set to true if you're using https
                //     httpOnly: true,
                //   });

                return res.cookie("access_token", jsontoken, {
                        httpOnly: true
                        })
                        .status(200)
                        .json({ message: "Login Successfully.", success: 1 });
                    }
            else if(results!=null && !results.isActive){
                console.log("Inactive user");
                return res.json({
                    success: 0,
                    message: "User is not Active, contact Admin to activate."
                });
            }
            else{
                return res.json({
                    success: 0,
                    message: "Invalid Email or Password."
                });
            }
        });
    }
    catch{
        console.log("Something went wrong !");
    }
    }

};

