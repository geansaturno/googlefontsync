let https = require('https');
let http = require('http');
let fs = require('fs');
let colors = require('colors');
let config = require('./config');

let googleAPI = config.key;
let fontFamilys = config.fonts;

let googleurl = "https://www.googleapis.com/webfonts/v1/webfonts?key=";

if(fontFamilys) {
    getGoogleFontList()
    .then(fonts => {
        fonts.forEach(font => {
            if(fontFamilys.includes(font.family)) {
                // console.log(font);
    
                Object.keys(font.files).forEach(variation => {
                    let filename = `${font.family}-${variation}`.toLowerCase();
                    dowloadFile(filename + ".ttf", font.files[variation])
                    getWoff2VariantLink(font.family, variation)
                    .then(link => {
                        dowloadFile(filename + '.woff2', link);
                    });
                })
            }
        })
    });
};

function getWoff2VariantLink(fontFamily, variant){

    return new Promise((resolve, reject) => {
    
        let opt = {
            path: `/css?family=${fontFamily}:${variant}`,
            hostname: "fonts.googleapis.com",
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Mobile Safari/537.36"
            }
        }
    
        https.get(opt, res => {
            let chunks  =[]
            res.on('data', chunk => chunks = chunk);
    
            res.on('end', () => {
                let found = chunks.toString().match(/https:\/\/[\--|]+.woff2/g);

                resolve(found[1]);
            })
        })
    })
}

function getGoogleFontList() {
    return new Promise((resolve, reject) => {
        https.get(googleurl + googleAPI, res => {
        
            let chunks = [];
        
            res.on('data', chunk => {
                chunks.push(chunk)
            })
            .on('end', () => {
                fonts = JSON.parse(Buffer.concat(chunks).toString()).items;
                resolve(fonts);
            });
        });
    }); 
}

function dowloadFile(filename, link) {
    return new Promise((resolve, reject) => {
        console.log(`Fazendo downwload de ${link}`.yellow );

        let protocol = http;
        if(link.includes("https://")) {
            protocol = https;
        }

        protocol.get(link, (res) => {
            let writeStreams = fs.createWriteStream(filename);
            res.on('data', chunk => {
                writeStreams.write(chunk);
            })
            .on('end', () => {
                writeStreams.end();
                console.log(`Download de ${filename} finalizado`.green);
                resolve(filename);
            });
        });
    });
}