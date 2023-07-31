import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate-fields';

import { login, validateExternalJwt } from '../controllers/auth';
import { validateJTW } from '../middlewares/validate-jtw';

const router = Router();

router.post('/login', [

    check('email', "Field 'email' is mandatory").not().isEmpty(),
    check('email', "Field 'email' must be a valid email").isEmail(),
    check('password', "Field 'password' is mandatory").not().isEmpty(),
    validateFields

], login);

router.get('/validatejwt', validateJTW, validateExternalJwt);

module.exports = router;