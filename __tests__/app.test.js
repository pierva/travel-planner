const Client = require('../src/client/js/app')

describe('Test octopus functions', () => {
    it('should generate a uuidv4 alike string', () => {
        expect(Client.octo.uuidv4()).toHaveLength(36)
    })

    it('should add a new travel plan and return the id', () => {
        const travelId = Client.octo.addTravelPlan(
            [{
                name: 'travelDestination',
                value: 'Cisternino'
            }, {
                name: 'depDate',
                value: '05/10/2020'
            }
            ]
        )
        expect(Client.octo.getTravelPlan(travelId)[0]).toHaveProperty('id')
        expect(Client.octo.getTravelPlan(travelId)[0].id).toBe(travelId)
    }
    )

    it('should remove a travel plan', () => {
        const travelId = Client.octo.addTravelPlan(
            [{
                name: 'travelDestination',
                value: 'Cisternino'
            }, {
                name: 'depDate',
                value: '05/10/2020'
            }
            ]
        )
        expect(Client.octo.deleteTravelPlan(travelId)).toBe(true)
        expect(Client.octo.getTravelPlan(travelId)).toStrictEqual([])
    })

    it('should update a travel plan', () => {
        const travelId = Client.octo.addTravelPlan(
            [{
                name: 'travelDestination',
                value: 'Cisternino'
            }, {
                name: 'depDate',
                value: '05/10/2020'
            }
            ]
        )
        const updated = Client.octo.editTravelPlan(
            travelId,
            [{
                name: 'travelDestination',
                value: 'Miami'
            }]
            )
        expect(updated).toBe(true)
        expect(Client.octo.getTravelPlan(travelId)[0].data[0].value).toBe('Miami')
    })
})