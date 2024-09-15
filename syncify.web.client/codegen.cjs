
const pkg = require('./package.json');
const https = require("node:https");
const fs = require("fs");
const { codegen } = require("swagger-axios-codegen");
const axios = require("axios");



const config = {
    outputDir: './src/api/generated',
    remoteUrl: 'https://localhost:7061/swagger/v1/swagger.json'
}

const agent = new https.Agent({
    rejectUnauthorized: false,
});


async function generate() {
    const dirExists = fs.existsSync(config.outputDir);
    
    !dirExists && fs.mkdirSync(config.outputDir, { recursive: true });

    const jsonPath = `${config.outputDir}/swagger.json`;
    const {data} = await axios.get(config.remoteUrl, {httpsAgent: agent});
    
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
    
    await codegen({
        methodNameMode: 'operationId',
        outputDir: config.outputDir,
        source: require(jsonPath),
        useStaticMethod: true,
        multipleFileMode: true,
        extendDefinitionFile: './src/api/generics.ts',
        extendGenericType: [
            'Response',
            'Error'
        ],
    })
}

generate();