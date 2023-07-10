import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos';

import { getAll, getOne, store, update, deleteOne } from '../controllers/ruta';

const router = Router();

router.get('/', getAll);

router.get('/:id', [

    check('id', 'Debe enviar un id válido').isNumeric(),
    validarCampos

], getOne);

router.post('/', [

    check('estado', 'El estado es obligatorio').not().isEmpty(),
    validarCampos

], store);

router.put('/:id', [

    check('id', 'Debe enviar un id válido').isNumeric(),
    validarCampos

], update);

router.delete('/:id', [

    check('id', 'Debe enviar un id válido').isNumeric(),
    validarCampos

], deleteOne);

module.exports = router;