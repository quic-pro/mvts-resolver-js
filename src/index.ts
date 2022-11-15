import Resolver from './Resolver';


const resolver = new Resolver();




function test(name: string, number: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        resolver.getAddress(number)
            .then((node) => {
                console.log(name, (Date.now() - startTime) / 1000);
                console.log(node);
                resolve();
            })
            .catch(reject);
    });
}


test('0% cache', '400100')
    .then(() => {
        test('100% cache', '400100')
            .then(() => {
                return test('50% cache', '400200');
            })
            .catch(console.error);
    })
    .catch(console.error);
