/**
 * Builds Sequelize query options based on the request query parameters.
 *
 * @param {Object} query - The request query parameters.
 * @param {string} [query.denormalize=false] - The flag to denormalize the result.
 * @param {number} [query.page=1] - The page number for pagination.
 * @param {number} [query.limit=10] - The number of items per page for pagination.
 * @param {Array} [query.sortBy] - The sort options.
 * @param {Object} [query.q] - The search query.
 * @returns {Object} The Sequelize query options.
 */
const buildQueryOptions = ({ denormalize = '', page = 1, limit = 10, sortBy = [], q = {}}) => {
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
        q: q ?? null,
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

    if (options['q'] && Object.keys(options['q']).length > 0) {
        const { terms, brands, categories, colors, materials, price, weight, logic = 'AND' } = options['q'];
        const conditions = [];

        // Search by terms in name and description
        if (terms) {
            let termValue = '';

            if(Array.isArray(terms) && terms.length > 1) {
                termValue = terms.join(' ');
            } else {
                termValue = terms;
            }
            termValue = termValue.trim();
            conditions.push({
                $or: [
                    { name: { $regex: termValue, $options: 'i' } },
                    { description: { $regex: termValue, $options: 'i' } }
                ]
            });
        }

        // Filter by brands, categories, colors, materials, price, and weight
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
        if (price) {
            conditions.push({ price: { $gte: price[0], $lte: price[1] } });
        }
        if (weight) {
            conditions.push({
                weight: {
                    $gte: Math.floor(weight[0]),
                    $lte: Math.ceil(weight[1])
                }
            });
        }

        // Combine conditions based on the logic
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