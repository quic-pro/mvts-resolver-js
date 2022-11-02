import Guardian from './Guardian';


const guardian = new Guardian();

guardian.rootRouter()
    .then(console.log)
    .catch(console.log);
