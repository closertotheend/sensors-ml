const brain = require('brain.js')
const flatten = require('flat')
const fs = require('fs');

const tableStanding1 = require('./db.table.standing.json').markers
const tableStanding2 = require('./db.2.table.standing.json').markers
const handJogging2 = require('./db.2.hand.jogging.json').markers
const handWalking2 = require('./db.2.hand.walking.json').markers
const handStanding2 = require('./db.2.table.standing.json').markers


const processedTableStanding1 = processAll(tableStanding1, { table: 1, standing: 1 });
const processedTableStanding2 = processAll(tableStanding2, { table: 1, standing: 1 });
const processedHandJogging2 = processAll(handJogging2, { hand: 1, jogging: 1 });
const processedHandWalking2 = processAll(handWalking2, { hand: 1, walking: 1, });
const processedHandStanding2 = processAll(handStanding2, { hand: 1, standing: 1 });

const processed = [
    ...processedTableStanding1,
    ...processedTableStanding2,
    ...processedHandJogging2,
    ...processedHandWalking2,
    ...processedHandStanding2
]

const net = new brain.NeuralNetwork()

net.train(processed, {
    log: console.log,
})

console.log(net.run(processedHandStanding2[10].input))

fs.writeFile("net.json", JSON.stringify(net.toJSON()), 'utf8', (err) => {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
    console.log("JSON file has been saved.");
});

function processAll(elements, output) {
    return elements.map(it => ({ input: process(it), output }))
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

