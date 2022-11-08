import Resolver from './Resolver';


const resolver = new Resolver();
resolver.getEndNode('7777777')
    .then(console.log)
    .catch(console.log);
