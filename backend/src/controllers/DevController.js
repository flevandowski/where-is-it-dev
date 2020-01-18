const axios = require('axios');
const Dev = require('../Models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(request, response) {
        const devs = await Dev.find();
        return response.json(devs);
    },
    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

        if (!dev) {

            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

            let { name, avatar_url, bio } = apiResponse.data;

            if (!name) {
                name = github_username
            }

            const techsArray = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }

            dev = await Dev.create({
                avatar_url,
                github_username,
                name,
                bio,
                techs: techsArray,
                location
            });

        }

        return response.json(dev);
    }
}