const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeeController.js');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(employeesController.getAllEmployees)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor,ROLES_LIST.User), employeesController.createEmployee)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor,ROLES_LIST.User), employeesController.updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.User), employeesController.deleteEmployee);

router.route('/:id')
    .get(employeesController.getEmployee);

module.exports = router;