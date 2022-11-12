import Resolver from './Resolver';


const resolver = new Resolver();
resolver.getAddress('102777')
    .then(console.log)
    .catch(console.log);
