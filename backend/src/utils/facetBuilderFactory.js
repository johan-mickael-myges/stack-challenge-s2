const generate = async (termOptions, facetTypes, MongooseModel) => {
    try {
        const facetAggregations = {};

        for (const key in facetTypes) {
            const type = facetTypes[key].type;
            const attribute = facetTypes[key].attribute;

            if (type === 'checkbox') {
                facetAggregations[key] = [
                    { $unwind: `$${attribute}` },
                    {
                        $group: {
                            _id: `$${attribute}`,
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { count: -1 } },
                    {
                        $group: {
                            _id: null,
                            items: { $push: { _id: '$_id', count: '$count' } },
                            totalCount: { $sum: 1 }
                        }
                    },
                    {
                        $project: {
                            items: {
                                $cond: {
                                    if: { $lte: ['$totalCount', 5] },
                                    then: '$items',
                                    else: {
                                        $concatArrays: [
                                            { $slice: ['$items', 5] },
                                            [{
                                                _id: 'Others',
                                                count: {
                                                    $sum: {
                                                        $map: {
                                                            input: { $slice: ['$items', 5, { $subtract: ['$totalCount', 5] }] },
                                                            as: 'item',
                                                            in: '$$item.count'
                                                        }
                                                    }
                                                },
                                                items: { $slice: ['$items', 5, { $subtract: ['$totalCount', 5] }] },
                                                other: true
                                            }]
                                        ]
                                    }
                                }
                            }
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

        const conditions = termOptions.attributes && termOptions.attributes.length > 0 && termOptions.value
                ? termOptions.attributes.map(attribute => ({
                    [attribute]: {
                        $regex: termOptions.value,
                        $options: 'i'
                    }
                }))
                : [];


        const matchStage = conditions.length > 0 ? { $match: { $or: conditions } } : {};

        const aggregationPipeline = matchStage.$match ? [matchStage, { $facet: facetAggregations }] : [{ $facet: facetAggregations }];

        const facets = await MongooseModel.aggregate(aggregationPipeline);

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