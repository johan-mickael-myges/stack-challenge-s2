const generate = async (facetTypes, MongooseModel) => {
    try {
        const facetAggregations = {};

        for (const key in facetTypes) {
            const type = facetTypes[key].type;
            const attribute = facetTypes[key].attribute;

            if (type === 'checkbox') {
                facetAggregations[key] = [
                    {
                        $unwind: `$${attribute}`
                    },
                    {
                        $group: {
                            _id: `$${attribute}`,
                            count: { $sum: 1 }
                        }
                    }
                ];
            } else if (type === 'range') {
                facetAggregations[key] = [
                    {
                        $group: {
                            _id: null,
                            min: { $min: `$${attribute}` },
                            max: { $max: `$${attribute}` }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            min: { $floor: '$min' },
                            max: { $ceil: '$max' }
                        }
                    }
                ];
            }
        }

        const facets = await MongooseModel.aggregate([
            {
                $facet: facetAggregations
            }
        ]);

        const facetsWithTypes = Object.entries(facets[0]).map(([key, value]) => {
            const type = facetTypes[key].type;
            const label = facetTypes[key].label;

            return {
                id: key,
                label: label,
                type: type,
                values: type === 'range' ? value[0] : value
            };
        });

        return facetsWithTypes;
    } catch (error) {
        throw error;
    }
}

module.exports = generate;