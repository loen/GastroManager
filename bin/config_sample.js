const config = {
    token: 'TBD',
    places: [
        {
            name: 'etnika',
            contact: '123456',
            email: "etnika@etnika.com",
            minOrders: 2
        },
        {
            name: 'emes',
            contact: '007',
            email: 'emes@emes.com',
            minOrders: 1
        }
    ],
    people: [{
              name: 'andrzej',
              benefit: 1245
             },
             {
              name: 'b.tworzewska'
             }],
    channel: 'testowy',
    timeWindowStart: '14:00',
    timeWindowEnd: '14:30',
    drawTime: '14:31'
}

exports.settings=config;