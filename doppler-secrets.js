const https = require('https')

if(!process.env.DOPPLER_TOKEN) {
    throw Error('DOPPLER_TOKEN environment variable is not set.  Get it from: ' +
        'https://dashboard.doppler.com/workplace/36d12cbffd16d990042f/projects/cd-connect/configs/prd/access')
}

module.exports.getSecrets = async () => {
    return new Promise(function(resolve, reject) {
        https.get(`https://${process.env.DOPPLER_TOKEN}@api.doppler.com/v3/configs/config/secrets/download?format=json`, (res) => {
            let secrets = ''
            res.on('data', data => secrets += data);
            res.on('end', () => resolve(JSON.parse(secrets)))
        }).on('error', (e) => reject(e))
    })
}

// If executed as a script
if(require.main === module) {
    (async () => {
        const secrets = await this.getSecrets()
        //process.stdout.write(JSON.stringify(secrets))
        for(const key in secrets) {
            let secret = secrets[key];
            if(typeof secret !== 'undefined' && secret !== null) {
                process.env[key] = secret
            }
        }
        process.stdout.write(JSON.stringify(secrets))
    })()
}
