/**
 * Builds Sequelize query options based on the request query parameters.
 *
 * @param {Object} query - The request query parameters.
 * @param {string} [query.denormalize=false] - The flag to denormalize the result.
 * @param {number} [query.page=1] - The page number for pagination.
 * @param {number} [query.limit=10] - The number of items per page for pagination.
 * @param {Array} [query.sortBy] - The sort options.
 * @returns {Object} The Sequelize query options.
 */
const buildQueryOptions = ({ denormalize = '', page = 1, limit = 10, sortBy = [], facets = {}}) => {
    let sortOptions = [];

    if (sortBy.length > 0) {
        sortOptions = sortBy.map((sort) => {
            return [sort.key, sort.order];
        });
    }

    return {
        denormalize,
        page,
        offset: (page - 1) * limit,
        limit: limit < 0 ? null : limit,
        order: sortOptions,
        facets: facets ?? null,
    };
};

const buildMongooseQuery = (query, options = {}) => {
    let mongooseQuery = query;

    if (options['page'] && options['limit']) {
        mongooseQuery.skip((options['page'] - 1) * options['limit']).limit(options['limit']);
    }

    if (options['order']) {
        mongooseQuery.sort(options['order']);
    }

    if (options['facets'] && Object.keys(options['facets']).length > 0) {
        const { brands, categories, colors, materials, priceRange, weightRange, logic = 'AND' } = options['facets'];
        const conditions = [];

        if (brands && brands.length > 0) {
            conditions.push({ brand: { $in: brands } });
        }

        if (categories && categories.length > 0) {
            conditions.push({ categories: { $in: categories } });
        }

        if (colors && colors.length > 0) {
            conditions.push({ colors: { $in: colors } });
        }

        if (materials && materials.length > 0) {
            conditions.push({ materials: { $in: materials } });
        }

        if (priceRange) {
            conditions.push({ price: { $gte: priceRange.min, $lte: priceRange.max } });
        }

        if (weightRange) {
            conditions.push({
                weight: {
                    $gte: Math.floor(weightRange.min),
                    $lte: Math.ceil(weightRange.max)
                }
            });
        }

        if (logic === 'OR') {
            mongooseQuery = mongooseQuery.or(conditions);
        } else {
            mongooseQuery = mongooseQuery.and(conditions);
        }
    }

    return mongooseQuery;
}
const getBoolValue = (value) => {
    return value === true || value === 'true' || value === '1' || value === 1;
}

module.exports = {
    buildQueryOptions,
    buildMongooseQuery,
    getBoolValue,
};