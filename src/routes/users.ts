import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate-fields';
import { validateJTW } from '../middlewares/validate-jtw';

import { getAll, getOne, store, update, deleteOne, firstLoginAdmin, firstLoginSuperAdmin } from '../controllers/users';

const router = Router();

router.get('/', validateJTW, getAll);

router.get('/:id', [

    validateJTW,
    check('id', "Field 'id' must be a valid number").isNumeric(),
    validateFields

], getOne);

router.post('/', [

    validateJTW,
    check('firstName', "Field 'firstName' is mandatory").not().isEmpty(),
    check('firstName', "Field 'firstName' must not cotain numbers").isString(),
    check('lastName1', "Field 'lastName1' is mandatory").not().isEmpty(),
    check('lastName1', "Field 'lastName1' must not cotain numbers").isString(),
    check('email', "Field 'email' is mandatory").not().isEmpty(),
    check('email', "Field 'email' must be a valid email").isEmail(),
    check('password', "Field 'password' is mandatory").not().isEmpty(),
    check('password', "Field 'password' must have at least 8 characters").isLength({ min: 8 }),
    check('role', "Field 'role' is mandatory").not().isEmpty(),
    check('role', "Field 'role' must be a valid number").isString(),
    validateFields

], store);

router.post('/firstLoginSuperAdmin', [

    check('firstName', "Field 'firstName' is mandatory").not().isEmpty(),
    check('firstName', "Field 'firstName' must not cotain numbers").isString(),
    check('lastName1', "Field 'lastName1' is mandatory").not().isEmpty(),
    check('lastName1', "Field 'lastName1' must not cotain numbers").isString(),
    check('email', "Field 'email' is mandatory").not().isEmpty(),
    check('email', "Field 'email' must be a valid email").isEmail(),
    check('password', "Field 'password' is mandatory").not().isEmpty(),
    check('password', "Field 'password' must have at least 8 characters").isLength({ min: 8 }),
    validateFields

], firstLoginSuperAdmin);

router.post('/firstLoginAdmin', [

    check('firstName', "Field 'firstName' is mandatory").not().isEmpty(),
    check('firstName', "Field 'firstName' must not cotain numbers").isString(),
    check('lastName1', "Field 'lastName1' is mandatory").not().isEmpty(),
    check('lastName1', "Field 'lastName1' must not cotain numbers").isString(),
    check('email', "Field 'email' is mandatory").not().isEmpty(),
    check('email', "Field 'email' must be a valid email").isEmail(),
    check('password', "Field 'password' is mandatory").not().isEmpty(),
    check('password', "Field 'password' must have at least 8 characters").isLength({ min: 8 }),
    validateFields

], firstLoginAdmin);

router.put('/:id', [

    validateJTW,
    check('id', "Field 'id' must be a valid number").isNumeric(),
    validateFields

], update);

router.delete('/:id', [

    validateJTW,
    check('id', "Field 'id' must be a valid number").isNumeric(),
    validateFields

], deleteOne);

module.exports = router;