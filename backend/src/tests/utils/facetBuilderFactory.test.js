const generateProductFacets = require('~utils/facetBuilderFactory');
const MongooseProduct = require('~models/mongoose/Product');

jest.mock('~models/mongoose/Product', () => ({
    aggregate: jest.fn(),
}));

describe('facetBuilderFactory', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('generateFacets', () => {
        it('should return the correct facets', async () => {
            const facetTypes = {
                brands: { type: 'checkbox', attribute: 'brand', label: 'Marques' },
                priceRange: { type: 'range', attribute: 'price', label: 'Prix' },
            };

            MongooseProduct.aggregate.mockResolvedValue([
                {
                    brands: [
                        { _id: 'brand1', count: 5 },
                        { _id: 'brand2', count: 3 },
                    ],
                    priceRange: [{ min: 10, max: 100 }],
                },
            ]);

            const expectedFacets = [
                {
                    id: 'brands',
                    label: 'Marques',
                    type: 'checkbox',
                    values: [
                        { _id: 'brand1', count: 5 },
                        { _id: 'brand2', count: 3 },
                    ],
                },
                {
                    id: 'priceRange',
                    label: 'Prix',
                    type: 'range',
                    values: { min: 10, max: 100 },
                },
            ];

            const result = await generateProductFacets(
                    {
                        value: '',
                        attributes: [],
                    },
                    facetTypes,
                    MongooseProduct
            );

            expect(result).toEqual(expectedFacets);
        });
    });
});
