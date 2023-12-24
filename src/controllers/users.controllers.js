import { productsService } from "../services/index.js";
import { getValidFilters } from "../utils.js"

const login = async (req, res) => {
    req.logger.info("Se redirecciona a la vista de logeó");
    res.render('login')
}
const register = async (req, res) => {
    req.logger.info("Se redirecciona a la vista de registrar");
    res.render('register')
}
const profile = async (req, res) => {
    req.logger.info("Se redirecciona a la vista de perfil");
    res.render('Profile');
}
const getproducts = async (req, res) => {
    let { page = 1, limit = 4, sort, ...filters } = req.query;
    const cleanFilters = getValidFilters(filters, 'product')

    // Añadir lógica de ordenación por precio
    const sortOptions = {};
    if (sort === 'asc') {
        sortOptions.price = 1; // Orden ascendente por precio
    } else if (sort === 'desc') {
        sortOptions.price = -1; // Orden descendente por precio
    }

    const pagination = await productsService.paginateProducts(cleanFilters, { page, lean: true, limit, sort: sortOptions });
    res.render('Products', {
        css: 'products',
        user: req.user,
        products: pagination.docs,
        page: pagination.page,
        hasPrevPage: pagination.hasPrevPage,
        hasNextPage: pagination.hasNextPage,
        prevPage: pagination.prevPage,
        nextPage: pagination.nextPage,
        totalPages: pagination.totalPages
    });
}

export default {
    login,
    register,
    profile,
    getproducts
}