const GitHub = require('./lib/github');
require('dotenv').config();

describe('Integration with GitHub API', () => {
    let github

    beforeAll(() => {
        github = new GitHub({
            accessToken: process.env.ACCESS_TOKEN,
            baseURL: 'https://api.github.com',
        })
    })

    test('Get a user', async () => {
        const res = await github.getUser('BeomSeok96')
        expect(res).toEqual(
            expect.objectContaining({
                login: 'BeomSeok96',
            })
        )
    })
})