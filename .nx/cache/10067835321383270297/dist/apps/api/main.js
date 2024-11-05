/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const app_controller_1 = __webpack_require__(5);
const app_service_1 = __webpack_require__(6);
const prisma_service_1 = __webpack_require__(7);
const api_user_service_1 = __webpack_require__(9);
const api_user_controller_1 = __webpack_require__(10);
const api_address_controller_1 = __webpack_require__(11);
const api_address_service_1 = __webpack_require__(12);
const api_category_service_1 = __webpack_require__(14);
const api_category_controller_1 = __webpack_require__(15);
const api_product_service_1 = __webpack_require__(16);
const api_product_controller_1 = __webpack_require__(17);
const api_cart_service_1 = __webpack_require__(18);
const api_cart_controller_1 = __webpack_require__(19);
const api_order_service_1 = __webpack_require__(20);
const api_order_controller_1 = __webpack_require__(22);
const api_review_service_1 = __webpack_require__(23);
const api_review_controller_1 = __webpack_require__(24);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [
            app_controller_1.AppController,
            api_user_controller_1.ApiUserController,
            api_address_controller_1.ApiAddressController,
            api_category_controller_1.ApiCategoryController,
            api_product_controller_1.ApiProductController,
            api_cart_controller_1.ApiCartController,
            api_order_controller_1.ApiOrderController,
            api_review_controller_1.ApiReviewController,
        ],
        providers: [
            app_service_1.AppService,
            prisma_service_1.PrismaService,
            api_user_service_1.ApiUserService,
            api_address_service_1.ApiAddressService,
            api_category_service_1.ApiCategoryService,
            api_product_service_1.ApiProductService,
            api_cart_service_1.ApiCartService,
            api_order_service_1.ApiOrderService,
            api_review_service_1.ApiReviewService,
        ],
    })
], AppModule);


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const app_service_1 = __webpack_require__(6);
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getData() {
        return this.appService.getData();
    }
};
exports.AppController = AppController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AppController.prototype, "getData", null);
exports.AppController = AppController = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
let AppService = class AppService {
    getData() {
        return { message: 'Hello API' };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const client_1 = __webpack_require__(8);
let PrismaService = class PrismaService extends client_1.PrismaClient {
    constructor() {
        super();
    }
    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], PrismaService);


/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiUserService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const prisma_service_1 = __webpack_require__(7);
let ApiUserService = class ApiUserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUsers() {
        return this.prisma.user.findMany();
    }
    async getUserById(id) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id },
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async updateUser(id, data) {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }
};
exports.ApiUserService = ApiUserService;
exports.ApiUserService = ApiUserService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ApiUserService);


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiUserController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const api_user_service_1 = __webpack_require__(9);
let ApiUserController = class ApiUserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getUsers() {
        return this.userService.getUsers();
    }
    async getUserById(id) {
        try {
            const user = await this.userService.getUserById(id);
            console.log('Controller layer result:', user);
            return user;
        }
        catch (error) {
            console.error('Controller layer error:', error);
            throw error;
        }
    }
    async updateUser(id, updateData) {
        return this.userService.updateUser(id, updateData);
    }
};
exports.ApiUserController = ApiUserController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ApiUserController.prototype, "getUsers", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ApiUserController.prototype, "getUserById", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ApiUserController.prototype, "updateUser", null);
exports.ApiUserController = ApiUserController = tslib_1.__decorate([
    (0, common_1.Controller)('users'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof api_user_service_1.ApiUserService !== "undefined" && api_user_service_1.ApiUserService) === "function" ? _a : Object])
], ApiUserController);


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiAddressController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const api_address_service_1 = __webpack_require__(12);
const create_address_dto_1 = __webpack_require__(13);
let ApiAddressController = class ApiAddressController {
    constructor(addressService) {
        this.addressService = addressService;
    }
    async getAddress(id) {
        return this.addressService.getAddress(id);
    }
    async deleteAddress(id) {
        return this.addressService.deleteAddress(id);
    }
    async addAddress(userId, createAddressDto) {
        return this.addressService.addAddress(userId, createAddressDto);
    }
    async editAddress(id, addressData) {
        return this.addressService.editAddress(id, addressData);
    }
    async setDefaultAddress(userId, addressId) {
        return this.addressService.setDefaultAddress(userId, addressId);
    }
};
exports.ApiAddressController = ApiAddressController;
tslib_1.__decorate([
    (0, common_1.Get)(':id/address'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ApiAddressController.prototype, "getAddress", null);
tslib_1.__decorate([
    (0, common_1.Delete)('address/delete/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ApiAddressController.prototype, "deleteAddress", null);
tslib_1.__decorate([
    (0, common_1.Post)(':id/address'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_b = typeof create_address_dto_1.CreateAddressDto !== "undefined" && create_address_dto_1.CreateAddressDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ApiAddressController.prototype, "addAddress", null);
tslib_1.__decorate([
    (0, common_1.Patch)('address/edit/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_c = typeof create_address_dto_1.CreateAddressDto !== "undefined" && create_address_dto_1.CreateAddressDto) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ApiAddressController.prototype, "editAddress", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':userId/address/default/:addressId'),
    tslib_1.__param(0, (0, common_1.Param)('userId')),
    tslib_1.__param(1, (0, common_1.Param)('addressId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], ApiAddressController.prototype, "setDefaultAddress", null);
exports.ApiAddressController = ApiAddressController = tslib_1.__decorate([
    (0, common_1.Controller)('users'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof api_address_service_1.ApiAddressService !== "undefined" && api_address_service_1.ApiAddressService) === "function" ? _a : Object])
], ApiAddressController);


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiAddressService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const prisma_service_1 = __webpack_require__(7);
let ApiAddressService = class ApiAddressService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAddress(userId) {
        return this.prisma.address.findMany({
            where: { userId: userId },
            orderBy: {
                isDefault: 'desc',
            },
        });
    }
    async deleteAddress(id) {
        return this.prisma.address.delete({
            where: { id },
        });
    }
    async addAddress(userId, data) {
        if (data.isDefault) {
            return this.prisma.$transaction([
                this.prisma.address.updateMany({
                    where: { userId },
                    data: {
                        isDefault: false,
                    },
                }),
                this.prisma.address.create({
                    data: {
                        ...data,
                        userId,
                    },
                }),
            ]);
        }
        return this.prisma.address.create({
            data: {
                ...data,
                userId,
            },
        });
    }
    async editAddress(id, data) {
        return this.prisma.address.update({
            where: { id },
            data: {
                ...data,
            },
        });
    }
    async setDefaultAddress(userId, addressId) {
        return this.prisma.$transaction([
            // Update all addresses for the user to isDefault = false
            this.prisma.address.updateMany({
                where: {
                    userId: userId,
                    isDefault: true,
                },
                data: {
                    isDefault: false,
                },
            }),
            // Set the selected address as default
            this.prisma.address.update({
                where: {
                    id: addressId,
                },
                data: {
                    isDefault: true,
                },
            }),
        ]);
    }
};
exports.ApiAddressService = ApiAddressService;
exports.ApiAddressService = ApiAddressService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ApiAddressService);


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateAddressDto = void 0;
class CreateAddressDto {
}
exports.CreateAddressDto = CreateAddressDto;


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiCategoryService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const prisma_service_1 = __webpack_require__(7);
let ApiCategoryService = class ApiCategoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addCategory(data) {
        await this.prisma.category.create({
            data: {
                name: data.name,
                subCategories: {
                    create: data?.subCategories?.map((subCategoryName) => ({
                        name: subCategoryName,
                    })),
                },
            },
        });
    }
    async getCategories() {
        return this.prisma.category.findMany({
            include: {
                subCategories: true,
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
        });
    }
};
exports.ApiCategoryService = ApiCategoryService;
exports.ApiCategoryService = ApiCategoryService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ApiCategoryService);


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiCategoryController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const api_category_service_1 = __webpack_require__(14);
let ApiCategoryController = class ApiCategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async addCategory(data) {
        await this.categoryService.addCategory(data);
    }
    async getCategories() {
        return this.categoryService.getCategories();
    }
};
exports.ApiCategoryController = ApiCategoryController;
tslib_1.__decorate([
    (0, common_1.Post)('create'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ApiCategoryController.prototype, "addCategory", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ApiCategoryController.prototype, "getCategories", null);
exports.ApiCategoryController = ApiCategoryController = tslib_1.__decorate([
    (0, common_1.Controller)('category'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof api_category_service_1.ApiCategoryService !== "undefined" && api_category_service_1.ApiCategoryService) === "function" ? _a : Object])
], ApiCategoryController);


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiProductService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const prisma_service_1 = __webpack_require__(7);
let ApiProductService = class ApiProductService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProducts(filters) {
        const page = filters.page ?? 1;
        const pageSize = filters.pageSize ?? 12;
        const skip = (page - 1) * pageSize;
        const products = await this.prisma.product.findMany({
            include: {
                category: true,
                subCategory: true,
                ratings: {
                    include: {
                        user: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
            where: {
                categoryId: filters.categoryId || undefined,
                subCategoryId: filters.subCategoryId || undefined,
                price: {
                    gte: filters.minPrice || undefined,
                    lte: filters.maxPrice || undefined,
                },
            },
            orderBy: {
                createdAt: filters.sortBy === 'new'
                    ? 'desc'
                    : filters.sortBy === 'old'
                        ? 'asc'
                        : undefined,
            },
            skip,
            take: pageSize,
        });
        const totalItems = await this.prisma.product.count({
            where: {
                categoryId: filters.categoryId || undefined,
                subCategoryId: filters.subCategoryId || undefined,
                price: {
                    gte: filters.minPrice || undefined,
                    lte: filters.maxPrice || undefined,
                },
            },
        });
        const totalPages = Math.ceil(totalItems / pageSize);
        return {
            products,
            totalItems,
            totalItemsInPage: products.length,
            currentPage: page,
            totalPages,
        };
    }
    async getProductById(id) {
        return this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                subCategory: true,
                ratings: {
                    include: {
                        user: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });
    }
    async getSimilarProducts(categoryId, productId) {
        return this.prisma.product.findMany({
            where: {
                categoryId,
                id: {
                    not: productId,
                },
            },
            include: {
                ratings: {
                    include: {
                        user: true,
                    },
                },
            },
        });
    }
    async addProduct(data) {
        await this.prisma.product.create({
            data: data,
        });
    }
    async searchProducts(input) {
        return this.prisma.product.findMany({
            where: {
                name: {
                    contains: input,
                    mode: 'insensitive',
                },
            },
            take: 5,
        });
    }
};
exports.ApiProductService = ApiProductService;
exports.ApiProductService = ApiProductService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ApiProductService);


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiProductController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const api_product_service_1 = __webpack_require__(16);
let ApiProductController = class ApiProductController {
    constructor(productService) {
        this.productService = productService;
    }
    async getProducts(categoryId, subCategoryId, minPrice, maxPrice, sortBy, page, pageSize) {
        return this.productService.getProducts({
            categoryId,
            subCategoryId,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            sortBy,
            page: page ? parseInt(page) : undefined,
            pageSize: pageSize ? parseInt(pageSize) : undefined,
        });
    }
    async getProductById(id) {
        return this.productService.getProductById(id);
    }
    getSimilarProducts(productId, categoryId) {
        return this.productService.getSimilarProducts(categoryId, productId);
    }
    async addProduct(data) {
        await this.productService.addProduct(data);
    }
    async searchProducts(search) {
        return this.productService.searchProducts(search);
    }
};
exports.ApiProductController = ApiProductController;
tslib_1.__decorate([
    (0, common_1.Get)('all'),
    tslib_1.__param(0, (0, common_1.Query)('categoryId')),
    tslib_1.__param(1, (0, common_1.Query)('subCategoryId')),
    tslib_1.__param(2, (0, common_1.Query)('minPrice')),
    tslib_1.__param(3, (0, common_1.Query)('maxPrice')),
    tslib_1.__param(4, (0, common_1.Query)('sortBy')),
    tslib_1.__param(5, (0, common_1.Query)('page')),
    tslib_1.__param(6, (0, common_1.Query)('pageSize')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ApiProductController.prototype, "getProducts", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ApiProductController.prototype, "getProductById", null);
tslib_1.__decorate([
    (0, common_1.Get)(':productId/similar/:categoryId'),
    tslib_1.__param(0, (0, common_1.Param)('productId')),
    tslib_1.__param(1, (0, common_1.Param)('categoryId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", void 0)
], ApiProductController.prototype, "getSimilarProducts", null);
tslib_1.__decorate([
    (0, common_1.Post)('create'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ApiProductController.prototype, "addProduct", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('search')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ApiProductController.prototype, "searchProducts", null);
exports.ApiProductController = ApiProductController = tslib_1.__decorate([
    (0, common_1.Controller)('product'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof api_product_service_1.ApiProductService !== "undefined" && api_product_service_1.ApiProductService) === "function" ? _a : Object])
], ApiProductController);


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiCartService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const prisma_service_1 = __webpack_require__(7);
let ApiCartService = class ApiCartService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrCreateCart(userId) {
        let cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                cartItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!cart) {
            cart = await this.prisma.cart.create({
                data: {
                    userId,
                    subTotal: 0,
                    shippingCost: 0,
                },
                include: {
                    cartItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
        }
        const subTotal = cart.cartItems.reduce((sum, item) => sum + item.total, 0);
        const shippingCost = cart.cartItems.reduce((sum, item) => sum + item.shippingCost, 0);
        // Update the cart with the calculated subtotal
        cart = await this.prisma.cart.update({
            where: { id: cart.id },
            data: { subTotal, shippingCost },
            include: {
                cartItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        return cart;
    }
    async addItemToCart(unit, productId, productPrice, userId) {
        const cart = await this.getOrCreateCart(userId);
        return this.prisma.$transaction(async (prisma) => {
            return prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    unit,
                    total: productPrice * unit,
                    shippingCost: 100,
                },
            });
        });
    }
    async updateCartItem(itemId, unit, productPrice) {
        return this.prisma.cartItem.update({
            where: {
                id: itemId,
            },
            data: {
                unit,
                total: productPrice * unit,
            },
        });
    }
    async mergeCart(data, userId) {
        const cart = await this.getOrCreateCart(userId);
        return this.prisma.$transaction(async (prisma) => {
            for (const guestItem of data?.cartItems) {
                const existingItem = cart.cartItems.find((item) => item.product.id == guestItem.product.id);
                if (!existingItem) {
                    await prisma.cartItem.create({
                        data: {
                            cartId: cart.id,
                            productId: guestItem.product.id,
                            unit: guestItem.unit,
                            total: guestItem.product.price * guestItem.unit,
                            shippingCost: 100,
                        },
                    });
                }
            }
            const subTotal = cart.cartItems.reduce((sum, item) => sum + item.total, 0);
            const shippingCost = cart.cartItems.reduce((sum, item) => sum + item.shippingCost, 0);
            return prisma.cart.update({
                where: {
                    id: cart.id,
                },
                data: {
                    subTotal,
                    shippingCost,
                },
                include: {
                    cartItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
        });
    }
    async deleteCartItem(id) {
        return this.prisma.cartItem.delete({ where: { id } });
    }
};
exports.ApiCartService = ApiCartService;
exports.ApiCartService = ApiCartService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ApiCartService);


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiCartController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const api_cart_service_1 = __webpack_require__(18);
let ApiCartController = class ApiCartController {
    constructor(cartService) {
        this.cartService = cartService;
    }
    async getOrCreateCart(userId) {
        return this.cartService.getOrCreateCart(userId);
    }
    async addItemToCart(data) {
        return this.cartService.addItemToCart(data.unit, data.productId, data.productPrice, data.userId);
    }
    async updateCartItem(itemId, data) {
        return this.cartService.updateCartItem(itemId, data.unit, data.productPrice);
    }
    async deleteCartItem(id) {
        return this.cartService.deleteCartItem(id);
    }
    async mergeCart(id, data) {
        return this.cartService.mergeCart(data, id);
    }
};
exports.ApiCartController = ApiCartController;
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ApiCartController.prototype, "getOrCreateCart", null);
tslib_1.__decorate([
    (0, common_1.Post)('add'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ApiCartController.prototype, "addItemToCart", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id/update'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ApiCartController.prototype, "updateCartItem", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id/delete'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ApiCartController.prototype, "deleteCartItem", null);
tslib_1.__decorate([
    (0, common_1.Post)(':id/merge'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ApiCartController.prototype, "mergeCart", null);
exports.ApiCartController = ApiCartController = tslib_1.__decorate([
    (0, common_1.Controller)('cart'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof api_cart_service_1.ApiCartService !== "undefined" && api_cart_service_1.ApiCartService) === "function" ? _a : Object])
], ApiCartController);


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiOrderService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const uuid_1 = __webpack_require__(21);
const prisma_service_1 = __webpack_require__(7);
let ApiOrderService = class ApiOrderService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrder(userId, filters) {
        const page = filters.page ?? 1;
        const pageSize = filters.pageSize ?? 10;
        const skip = (page - 1) * pageSize;
        const orders = await this.prisma.order.findMany({
            where: {
                userId: userId,
                totalAmount: {
                    gte: filters.minPrice || undefined,
                    lte: filters.maxPrice || undefined,
                },
                createdAt: {
                    gte: filters.minDate || undefined,
                    lte: filters.maxDate || undefined,
                },
                deliveryStatus: filters.deliveryStatus || undefined,
                id: {
                    contains: filters.orderId,
                    mode: 'insensitive',
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: true,
                shippingInfo: true,
                orderItems: {
                    include: {
                        rating: true,
                    },
                },
            },
            skip,
            take: pageSize,
        });
        const totalItems = await this.prisma.order.count({
            where: {
                userId: userId,
                totalAmount: {
                    gte: filters.minPrice || undefined,
                    lte: filters.maxPrice || undefined,
                },
                createdAt: {
                    gte: filters.minDate || undefined,
                    lte: filters.maxDate || undefined,
                },
                deliveryStatus: filters.deliveryStatus || undefined,
                id: {
                    contains: filters.orderId,
                    mode: 'insensitive',
                },
            },
        });
        const totalPages = Math.ceil(totalItems / pageSize);
        return {
            orders,
            totalItems,
            totalItemsInPage: orders.length,
            currentPage: page,
            totalPages,
        };
    }
    async getOrderById(orderId) {
        return this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                user: true,
                shippingInfo: true,
                orderItems: {
                    include: {
                        rating: true,
                    },
                },
            },
        });
    }
    async createOrder(data) {
        const order = this.prisma.$transaction(async (tx) => {
            // make order
            return tx.order.create({
                data: {
                    userId: data.userId,
                    cartOrder: data.cart,
                    shippingInfoId: data.shippingInfoId,
                    orderAmount: data.orderAmount,
                    shippingCost: data.shippingCost,
                    totalAmount: data.totalAmount,
                    paymentMethod: data.paymentMethod,
                    orderStatus: 'CONFIRMED',
                    deliveryStatus: this.determineDeliveryStatus(this.generateDeliveryEvents()),
                    orderItems: {
                        create: data.cart.cartItems.map((cartItem) => ({
                            productId: cartItem.productId,
                            total: cartItem.total,
                            unit: cartItem.unit,
                        })),
                    },
                    deliveryEvents: this.eventUsed,
                },
            });
        });
        //   delete cart
        await this.prisma.cartItem.deleteMany({
            where: { cartId: data.cart.id },
        });
        //   update cart totals
        await this.prisma.cart.update({
            where: {
                id: data.cart.id,
            },
            data: {
                subTotal: 0,
                shippingCost: 0,
            },
        });
        return order;
    }
    generateDeliveryEvents() {
        const thirdStatus = Math.random() > 0.5 ? 'PACKED' : null;
        const fourthStatus = Math.random() > 0.5 && thirdStatus !== null ? 'DELIVERED' : null;
        return [
            {
                id: (0, uuid_1.v4)(),
                remark: 'Customer paid',
                status: 'PAID',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: (0, uuid_1.v4)(),
                remark: 'Order confirmed',
                status: 'CONFIRMED',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: (0, uuid_1.v4)(),
                remark: 'Order assigned for delivery',
                status: thirdStatus,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: (0, uuid_1.v4)(),
                remark: 'Order delivered',
                status: fourthStatus,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ];
    }
    determineDeliveryStatus(events) {
        const lastEvent = [...events]
            .reverse()
            .find((event) => event.status !== null);
        this.eventUsed = [...events];
        switch (lastEvent?.status) {
            case 'CONFIRMED':
                return 'PENDING';
            case 'PACKED':
                return 'PACKED';
            case 'DELIVERED':
                return 'DELIVERED';
            default:
                return 'DELIVERED'; // Default if no events have a non-null status
        }
    }
};
exports.ApiOrderService = ApiOrderService;
exports.ApiOrderService = ApiOrderService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ApiOrderService);


/***/ }),
/* 21 */
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiOrderController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const api_order_service_1 = __webpack_require__(20);
let ApiOrderController = class ApiOrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async getOrder(userId, orderId, minPrice, maxPrice, minDate, maxDate, page, pageSize, deliveryStatus) {
        return this.orderService.getOrder(userId, {
            orderId,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            page: page ? parseInt(page) : undefined,
            pageSize: pageSize ? parseInt(pageSize) : undefined,
            deliveryStatus,
            minDate,
            maxDate,
        });
    }
    async getOrderById(orderId) {
        return this.orderService.getOrderById(orderId);
    }
    async createOrder(data) {
        return this.orderService.createOrder(data);
    }
};
exports.ApiOrderController = ApiOrderController;
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Query)('orderId')),
    tslib_1.__param(2, (0, common_1.Query)('minPrice')),
    tslib_1.__param(3, (0, common_1.Query)('maxPrice')),
    tslib_1.__param(4, (0, common_1.Query)('minDate')),
    tslib_1.__param(5, (0, common_1.Query)('maxDate')),
    tslib_1.__param(6, (0, common_1.Query)('page')),
    tslib_1.__param(7, (0, common_1.Query)('pageSize')),
    tslib_1.__param(8, (0, common_1.Query)('deliveryStatus')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String, String, Object, Object, String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ApiOrderController.prototype, "getOrder", null);
tslib_1.__decorate([
    (0, common_1.Get)('user/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ApiOrderController.prototype, "getOrderById", null);
tslib_1.__decorate([
    (0, common_1.Post)('create'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof api_order_service_1.IOrderBody !== "undefined" && api_order_service_1.IOrderBody) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ApiOrderController.prototype, "createOrder", null);
exports.ApiOrderController = ApiOrderController = tslib_1.__decorate([
    (0, common_1.Controller)('order'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof api_order_service_1.ApiOrderService !== "undefined" && api_order_service_1.ApiOrderService) === "function" ? _a : Object])
], ApiOrderController);


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiReviewService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const prisma_service_1 = __webpack_require__(7);
let ApiReviewService = class ApiReviewService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createReview(data) {
        return this.prisma.productRating.create({
            data,
        });
    }
};
exports.ApiReviewService = ApiReviewService;
exports.ApiReviewService = ApiReviewService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ApiReviewService);


/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiReviewController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const api_review_service_1 = __webpack_require__(23);
let ApiReviewController = class ApiReviewController {
    constructor(reviewService) {
        this.reviewService = reviewService;
    }
    async createReview(data) {
        return this.reviewService.createReview(data);
    }
};
exports.ApiReviewController = ApiReviewController;
tslib_1.__decorate([
    (0, common_1.Post)('create'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof api_review_service_1.IReview !== "undefined" && api_review_service_1.IReview) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ApiReviewController.prototype, "createReview", null);
exports.ApiReviewController = ApiReviewController = tslib_1.__decorate([
    (0, common_1.Controller)('review'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof api_review_service_1.ApiReviewService !== "undefined" && api_review_service_1.ApiReviewService) === "function" ? _a : Object])
], ApiReviewController);


/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GlobalExceptionFilter = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const library_1 = __webpack_require__(26);
let GlobalExceptionFilter = class GlobalExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            message = exception.message;
        }
        else if (exception instanceof library_1.PrismaClientKnownRequestError) {
            // This handles Prisma errors like record not found
            if (exception.code === 'P2025') {
                status = common_1.HttpStatus.NOT_FOUND;
                message = 'Record not found';
            }
        }
        else if (exception instanceof library_1.PrismaClientValidationError) {
            status = common_1.HttpStatus.BAD_REQUEST;
            message = 'Validation error';
        }
        // Log the exception for debugging
        console.error('Exception:', exception);
        response
            .status(status)
            .json({
            statusCode: status,
            message: message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = tslib_1.__decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);


/***/ }),
/* 26 */
/***/ ((module) => {

module.exports = require("@prisma/client/runtime/library");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(1);
const core_1 = __webpack_require__(2);
const app_module_1 = __webpack_require__(3);
const http_exception_filter_1 = __webpack_require__(25);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new http_exception_filter_1.GlobalExceptionFilter());
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    app.enableCors();
    const port = process.env['PORT'] || 3000;
    await app.listen(port);
    common_1.Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}
bootstrap();

})();

/******/ })()
;