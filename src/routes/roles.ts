import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate-fields';
import { validateJTW } from '../middlewares/validate-jtw';

import { getAll, getOne, store, update, deleteOne } from '../controllers/roles';

const router = Router();

router.get('/', validateJTW, getAll);

router.get('/:id', [

    validateJTW,
    check('id', "Field 'id' must be a valid number").isNumeric(),
    validateFields

], getOne);

router.post('/', [

    validateJTW,
    check('name', "Field 'name' is mandatory").not().isEmpty(),
    check('name', "Field 'name' must be a text").isString(),
    check('status', "Field 'status' is mandatory").not().isEmpty(),
    check('status', "Field 'status' must be true or false").isBoolean(),
    validateFields

], store);

router.put('/:id', [

    validateJTW,
    check('id', "Field 'id' must be a valid number").isNumeric(),
    validateFields

], update);

router.delete('/:id', [

    validateJTW,
    check('id', "Field 'id' is mandatory").not().isEmpty(),
    check('id', "Field 'id' must be a valid number").isNumeric(),
    validateFields

], deleteOne);

module.exports = router;