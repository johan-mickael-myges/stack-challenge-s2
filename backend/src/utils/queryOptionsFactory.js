/**
 * Builds Sequelize query options based on the request query parameters.
 *
 * @param {Object} query - The request query parameters.
 * @param {number} [query.page=1] - The page number for pagination.
 * @param {number} [query.limit=10] - The number of items per page for pagination.
 * @param {Array} [query.sortBy] - The sort options.
 * @returns {Object} The Sequelize query options.
 */
const buildQueryOptions = ({ page = 1, limit = 10, sortBy = []}) => {
    let sortOptions = [];

    if (sortBy.length > 0) {
        sortOptions = sortBy.map((sort) => {
            return [sort.key, sort.order];
        });
    }

    return {
        page,
        offset: (page - 1) * limit,
        limit: limit < 0 ? null : limit,
        order: sortOptions,
    };
};

module.exports = {
    buildQueryOptions,
};