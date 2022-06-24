const { createUser, getUserByUserId, getUsers, updateUser, deleteUser, login, getUserdetailsByUserEmail } = require("./user.controller");
const router = require("express").Router();

const { checkToken } = require("../../auth/token_validation");

router.post("/newUser", createUser);
router.get("/getAllUsers", checkToken, getUsers);
router.get("/:id", checkToken ,getUserByUserId);
router.get("/:email", checkToken ,getUserdetailsByUserEmail);
router.patch("/", checkToken ,updateUser);
router.delete("/", checkToken ,deleteUser);
router.post("/login", login); 


module.exports = router;