let colors = require('colors');
let fs = require('fs');

fs.access('./key.json', err => {
    if(err) {
        console.log("Key não encontrada.".red);
        return;
    }

    let keyFile = require('./key.json');
    let program = require('commander');
    
    let googlefontClient = new (require('./GoogleFontsClient'))(keyFile.key);
    
    program
    .version('0.2.0')
    .command('fonts', 'Lista fontes instaladas')
    .command('list', 'Lista de fontes do Google')
    .command('sync', 'Sincronizar fontes salvas')
    .command('download [fonts]', 'Baixar fonte salva')
    .parse(process.argv);
});

