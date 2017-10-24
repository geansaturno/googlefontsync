let program = require('commander');
let googlefontClient = new (require('./GoogleFontsClient'))();

program
.version('0.2.0')
.command('list', 'Lista de fontes do Google')
.command('sync', 'Sincronizar fontes salvas')
.command('download [fonts]', 'Baixar fonte salva')
.parse(process.argv);

if(program.list) console.log('Lista');
if(program.sync) console.log('Syncroniza');
if(program.download) console.log('Download', program.font);

console.log('Oi')