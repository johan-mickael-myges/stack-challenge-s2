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
const buildQueryOptions = ({ denormalize = '', page = 1, limit = 10, sortBy = []}) => {
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
    };
};

const buildMongooseQuery = (query, options = {}) => {
    const mongooseQuery = query;

    if (options['page'] && options['limit']) {
        mongooseQuery.skip((options['page'] - 1) * options['limit']).limit(options['limit']);
    }

    if (options['order']) {
        mongooseQuery.sort(options['order']);
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