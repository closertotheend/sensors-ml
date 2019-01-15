const brain = require('brain.js')
const flatten = require('flat')
const test = require('ava')

const tableStanding = require('./db.2.table.standing.json').markers
const handJogging = require('./db.2.hand.jogging.json').markers
const handWalking = require('./db.2.hand.walking.json').markers
const handStanding = require('./db.2.table.standing.json').markers


const processedTableStanding = processAll(tableStanding, { hand: 0, table: 1, standing: 1, jogging: 0,  walking: 0 });
const processedHandJogging = processAll(handJogging, { hand: 1, table: 0, standing: 0, jogging: 1, walking: 0 });
const processedHandWalking = processAll(handWalking, { hand: 1, table: 0, standing: 0, jogging: 0, walking: 1, });
const processedHandStanding = processAll(handStanding, { hand: 1, table: 0, standing: 1, jogging: 0,  walking: 0 });

const processed = processedTableStanding
    .concat(processedHandJogging)
    .concat(processedHandWalking)
    .concat(processedHandStanding)

const net = new brain.NeuralNetwork()

net.train(processed, {
    log: console.log,
})

console.log(JSON.stringify(net.toJSON()))
//net.fromJSON(require('./net.json'));

test('table 1', t => {
    const result = net.run(processedTables[1].input);
    t.true(result.hand < result.table)
    t.true(result.pocket < result.table)
});

test('table 5', t => {
    const result = net.run(processedTables[5].input);
    t.true(result.hand < result.table)
    t.true(result.pocket < result.table)
});

test('hand 1', t => {
    const result = net.run(processedHands[1].input);
    t.true(result.table < result.hand);
    t.true(result.pocket < result.hand)
});

test('hand 5', t => {
    const result = net.run(processedHands[5].input);
    t.true(result.table < result.hand)
    t.true(result.pocket < result.hand)
});

test('pocket 1', t => {
    const result = net.run(processedPocket[1].input);
    t.true(result.hand < result.pocket);
    t.true(result.table < result.pocket)
});

test('pocket 5', t => {
    const result = net.run(processedPocket[5].input);
    t.true(result.hand < result.pocket)
    t.true(result.table < result.pocket)
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

