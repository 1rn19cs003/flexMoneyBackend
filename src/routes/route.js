module.exports = function (app, db) {
    // root-route for server
    app.get("/admin", (req, res) => {
        try {
            // db.query("SELECT * FROM users;", (error, results, fields) => {
            //     if (error) throw error;
            //     console.log(results);
            //     res.send(results);
            // });
            console.log("hello");
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    });

    app.post("/login", (req, res) => {
        try {
            let k = req.body;
            db.query("SELECT * FROM users WHERE email = ? AND password = ?;",
                [k.email, k.password],
                (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        res.json({
                            status: 400,
                            message: error,
                        });
                    }
                    else if (results.length > 0) {
                        console.log(results);
                        res.json({
                            status: 200,
                            message: "User logged in successfull",
                            results
                        });
                    }
                    else {
                        console.log("user not found");
                        res.json({
                            status: 400,
                            message: "user not found",
                        });
                    }
                });
        } catch (error) {
            console.log(error);
        }
    })

    app.post("/admission", (req, res) => {
        try {
            let k = req.body;
            console.log("Admission")
            db.query("SELECT batchId,aval_seats from batch where batchTime =?;",
                [k.batch],
                (err, result, fields) => {
                    if (err)
                        throw err;
                    else {
                        if (result.length > 0) {
                            let batchId = result[0].batchId;
                            let seat = result[0].aval_seats;
                            if (seat > 0) {

                                db.query("INSERT INTO users (name, email, age, phoneno , batchId , password) VALUES (?,?,?,?,?,?);",
                                    [k.name, k.email, k.age, k.phoneno, batchId, k.password],
                                    (error, results, fields) => {
                                        if (error) {
                                            console.log(error);
                                            res.json({
                                                status: 400,
                                                message: error,
                                            });
                                        }
                                        else {
                                            seat = seat - 1;
                                            db.query("UPDATE batch SET aval_seats = ? WHERE batchId = ?;",
                                                [seat, batchId],
                                                (error, resul1, fields) => {
                                                    if (error) {
                                                        console.log(error);
                                                        res.json({
                                                            status: 400,
                                                            message: error,
                                                        });
                                                    }
                                                    else {
                                                        console.log(results);
                                                        res.json({
                                                            status: 200,
                                                            message: "Admission successfull",
                                                            result: results.insertId,
                                                        });
                                                    }
                                                });

                                        }
                                    });

                            }
                            else {
                                console.log("batch full");
                                res.json({
                                    status: 400,
                                    message: "batch full",
                                });
                            }
                        } else {
                            console.log("batch not found");
                            res.json({
                                status: 400,
                                message: "batch not found",
                            });
                        }
                    }
                }
            )

        } catch (error) {
            console.log(error);
        }
    })


    app.post("/payment", (req, res) => {
        try {
            let k = req.body;
            var date = new Date();
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            let act_date = lastDay.toJSON().slice(0, 10);
            db.query("SELECT * from USERS where userId=?", [k.userId],
                (err, result, fields) => {
                    if (err) {
                        console.log(err);
                        res.json({
                            status: 400,
                            message: err,
                        });
                    }
                    else if(result.length>0){
                        db.query("INSERT INTO payment (userId,monthEnd) VALUES (?,?);",
                            [k.userId, act_date],
                            (error, results, fields) => {
                                if (error) {
                                    console.log(error);
                                    res.json({
                                        status: 400,
                                        message: error,
                                    });
                                }
                                else {
                                    console.log(results);
                                    res.json({
                                        status: 200,
                                        message: "Payment successfull",
                                        results
                                    });
                                }
                            });
                    }else{
                        console.log("user not found");
                        res.json({
                            status: 400,
                            message: "user not found",
                        });
                    }
                });

        } catch (error) {
            console.log(error);
        }
    })

    app.get("/check", (req, res) => {
        try {
            let k = req.query;
            let u_id = parseInt(k.userId);
            console.log(u_id);
            db.query("SELECT monthEnd FROM payment where userId=? order by paymentId DESC LIMIT 1;",
                [u_id],
                (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        res.json({
                            status: 400,
                            message: error,
                        });
                    }
                    else if (results.length > 0) {
                        let date = new Date(Date.now());
                        let to_date = date.toJSON().slice(0, 10);
                        if (to_date <= results[0].monthEnd) {
                            res.json({
                                status: 200,
                                message: "Fee paid",
                                results
                            });
                        }
                        else {
                            res.json({
                                status: 400,
                                message: "Fee not paid",
                                results
                            });
                        }
                    }
                    else {
                        console.log("user not found");
                        res.json({
                            status: 400,
                            message: "user not found",
                        });
                    }
                });
        } catch (error) {
            console.log(error);
        }
    })

    app.get("/batch", (req, res) => {
        try {
            db.query("SELECT batchTime FROM batch where aval_seats >0;",
                (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        res.json({
                            status: 400,
                            message: error,
                        });
                    }
                    else {
                        console.log(results);
                        res.json({
                            status: 200,
                            message: "batch found",
                            results
                        });
                    }
                });
        } catch (error) {
            console.log(error);
        }
    });
};