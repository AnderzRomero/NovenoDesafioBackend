import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import ErrorsDictionary from "../dictionaries/errors.js";

const createUser = async (req, res, next) => {
    try {
        res.clearCookie('cart');
        req.logger.info("Usuario registrado correctamente");
        return res.sendSuccess('Usuario registrado correctamente');
    } catch (error) {
        req.logger.error("No se pudo realizar el registro de usuario");
        const customError = new Error();
        const knownError = ErrorsDictionary[error.name];

        if (knownError) {
            customError.name = knownError,
                customError.message = error.message,
                customError.code = errorCodes[knownError];
            next(customError);
        } else {
            next(error);
        }
    }
}

const Login = async (req, res, next) => {
    try {
        const tokenizedUser = {
            name: `${req.user.firstName} ${req.user.lastName}`,
            nombres: req.user.firstName,
            apellidos: req.user.lastName,
            email: req.user.email,
            id: req.user._id,
            role: req.user.role,
            cart: req.user.cart
        }
        const token = jwt.sign(tokenizedUser, config.jwt.SECRET, { expiresIn: '1h' });
        res.cookie(config.jwt.COOKIE, token);
        res.clearCookie('cart');
        req.logger.info("logeado correctamente");
        return res.sendSuccess('logeado correctamente');
    } catch (error) {
        req.logger.error("No se encuentra registrado, porfavor realizar el registro!!");
        const customError = new Error();
        const knownError = ErrorsDictionary[error.name];

        if (knownError) {
            customError.name = knownError,
                customError.message = error.message,
                customError.code = errorCodes[knownError];
            next(customError);
        } else {
            next(error);
        }
    }
}

const infoUser = async (req, res, next) => {
    try {
        if (!req.user) {
            req.logger.error("Usuario no autenticado");
            return res.status(403).sendError("Usuario no autenticado");
        } else {
            res.render('profile', {
                css: 'products',
                user: req.user,
            });
        }
    } catch (error) {
        req.logger.error("No se puedo obtener la informacion del usuario");
        const customError = new Error();
        const knownError = ErrorsDictionary[error.name];

        if (knownError) {
            customError.name = knownError,
                customError.message = error.message,
                customError.code = errorCodes[knownError];
            next(customError);
        } else {
            next(error);
        }
    }
}

const loginTercerosGitHub = async (req, res, next) => {
    try {
        if (!req.user) {
            req.logger.error("No se pudo autentinticar");
            return res.status(403).sendError("No se pudo autenticar");
        } else {
            const tokenizedUser = {
                name: `${req.user.firstName}`,
                id: req.user._id,
                role: req.user.role,
                cart: req.user.cart,
                email: req.user.email,
            }

            const token = jwt.sign(tokenizedUser, config.jwt.SECRET, { expiresIn: '1h' });
            res.cookie(config.jwt.COOKIE, token);
            res.clearCookie('cart');
            req.logger.info("Se realiza la autenticacion correctamente y se redirecciona a productos");
            return res.redirect('/api/products');
        }
    } catch (error) {
        req.logger.error("No se pudo realizar la autenticacion con Github");
        const customError = new Error();
        const knownError = ErrorsDictionary[error.name];

        if (knownError) {
            customError.name = knownError,
                customError.message = error.message,
                customError.code = errorCodes[knownError];
            next(customError);
        } else {
            next(error);
        }

    }
}

const loginTercerosGoogle = async (req, res, next) => {
    try {
        if (!req.user) {
            req.logger.error("No se pudo realizar la autentintacion");
            return res.status(403).sendError("No se pudo autenticar");
        } else {
            // Guardamos el usuario en la base de datos si no existe
            const tokenizedUser = {
                name: `${req.user.firstName} ${req.user.lastName}`,
                id: req.user._id,
                role: req.user.role,
                cart: req.user.cart,
                email: req.user.email,
            }

            const token = jwt.sign(tokenizedUser, config.jwt.SECRET, { expiresIn: '1h' });
            res.cookie(config.jwt.COOKIE, token);
            res.clearCookie('cart');
            req.logger.info("Se realiza la autenticacion correctamente y se redirecciona a productos");
            return res.redirect('/api/products');
        }
    } catch (error) {
        req.logger.error("No se pudo la autenticacion con Google");
        const customError = new Error();
        const knownError = ErrorsDictionary[error.name];

        if (knownError) {
            customError.name = knownError,
                customError.message = error.message,
                customError.code = errorCodes[knownError];
            next(customError);
        } else {
            next(error);
        }
    }
}

const logout = async (req, res, next) => {
    try {
        res.clearCookie('authCookie'); // Elimina la cookie del token
        req.logger.info("Finalizo correctamente");
        return res.redirect('/');
    } catch (error) {
        req.logger.error("No se pudo realizar el cierre de session");
        const customError = new Error();
        const knownError = ErrorsDictionary[error.name];

        if (knownError) {
            customError.name = knownError,
                customError.message = error.message,
                customError.code = errorCodes[knownError];
            next(customError);
        } else {
            next(error);
        }
    }
}

export default {
    createUser,
    Login,
    infoUser,
    loginTercerosGitHub,
    loginTercerosGoogle,
    logout,
}

