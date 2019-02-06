const brain = require('brain.js')
const flatten = require('flat')
const fs = require('fs');

const modes = { table: 0, hand: 0, pocket: 0, carHolder: 0, standing: 0, jogging:0, walking:0, riding: 0}

const tableStanding1 = processAll(require('./db.table.standing.json').markers, { table: 1, standing: 1 });
const tableStanding2 = processAll(require('./db.2.table.standing.json').markers, { table: 1, standing: 1 });
const handJogging2 = processAll(require('./db.2.hand.jogging.json').markers, { hand: 1, jogging: 1 });
const handWalking2 = processAll(require('./db.2.hand.walking.json').markers, { hand: 1, walking: 1, });
const handStanding2 = processAll(require('./db.2.hand.standing.json').markers, { hand: 1, standing: 1 });
const pocketWalking3 = processAll(require('./db.3.pocket.walking.to.work.json').markers, { pocket: 1, walking: 1 });
const carRiding4 = processAll(require('./db.4.carholder.riding.to.work.json').markers, { carHolder: 1, riding: 1 });
const holdingPhone5 = processAll(require('./db.5.holding.phone.hand.json').markers, { hand: 1, standing: 1 });
const carHolderStanding5 = processAll(require('./db.5.simulated.carholder.standing.json').markers, { carHolder: 1, standing: 1 });
const walkingWithPhone5 = processAll(require('./db.5.walking.with.phone.json').markers, { hand: 1, walking: 1 });
const carholderStanding5 = processAll(require('./db.5.carholder.standing.json').markers, { carHolder: 1, standing: 1 });

const processed = [
    ...tableStanding1,
    ...tableStanding2,
    ...handJogging2,
    ...handWalking2,
    ...handStanding2,
    ...pocketWalking3,
    ...carRiding4,
    ...holdingPhone5,
    ...carHolderStanding5,
    ...walkingWithPhone5,
    ...carholderStanding5
]

const net = new brain.NeuralNetwork()

net.train(processed, {
    log: console.log,
})

console.log(net.run(handStanding2[10].input))

fs.writeFile("net.json", JSON.stringify(net.toJSON()), 'utf8', (err) => {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
    console.log("JSON file has been saved.");
});

function processAll(elements, output) {
    return elements.map(it => ({ input: process(it),  output: {...modes, ...output}}))
}

function process(e) {

    delete e.timestamp
    delete e.navigator;
    delete e.battery;

    if (e.devicemotion) {
        delete e.devicemotion.interval;
        delete e.devicemotion.timeStamp;
        // delete e.devicemotion;
    }

    if (e.deviceorientation) {
        delete e.deviceorientation.absolute;
        delete e.deviceorientation.bubbles;
        delete e.deviceorientation.timeStamp;

        e.deviceorientation.alpha /= 360
        e.deviceorientation.beta /= 360
        e.deviceorientation.gamma /= 360
        // delete e.deviceorientation
    }
    return flatten(e);
}

