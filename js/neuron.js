const globalMinDef = -1
const globalMaxDef = 8
let neuron = undefined
let samples = undefined


prepare_canvas()

class linearFunction {
    constructor(minDef, maxDef, slope, offset) {
        this._minDef = minDef
        this._maxDef = maxDef
        this._slope = slope
        this._offset = offset
    }

    set slope(new_slope) {
        this._slope = new_slope
    }

    set offset(new_offset) {
        this._offset = new_offset
    }

    drawFunction(color) {
        let y_start = this._minDef * this._slope + this._offset
        let y_end = this._maxDef * this._slope + this._offset

        drawLine(this._minDef, y_start, this._maxDef, y_end, color)
    }
}

class Datum {
    constructor(x1, x2, classification) {
        this._x1 = x1
        this._x2 = x2
        this._classification = classification
    }

    get x1() {
        return this._x1
    }
    get x2() {
        return this._x2
    }
    get classification() {
        return this._classification
    }

    drawDatum() {
        let color = undefined

        if (this._classification == 0) {
            color = "orange"
        } else {
            color = "green"
        }
        draw_point(this._x1, this._x2, color)
    }
}

class Neuron {
    constructor(w0, w1, w2, delta) {
        this._w0 = w0
        this._w1 = w1
        this._w2 = w2
        this._delta = delta
        this._borderFunction = new linearFunction(globalMinDef, globalMaxDef, -1 * (this._w1 / this._w2), -1 * (this._w0 / this._w2))
    }

    get borderFunction() {
        return this._borderFunction
    }

    output(x1, x2) {
        let z = this._w0 + this._w1 * x1 + this._w2 * x2
        if (z >= 0) {
            return 1
        } else {
            return 0
        }
    }

    learn(datum) {
        let z = this.output(datum.x1, datum.x2)

        this._w0 = this._w0 + this._delta * (datum._classification - z)
        this._w1 = this._w1 + this._delta * (datum._classification - z) * datum.x1
        this._w2 = this._w2 + this._delta * (datum._classification - z) * datum.x2

        this._borderFunction.slope = -1 * (this._w1 / this._w2)
        this._borderFunction.offset = -1 * (this._w0 / this._w2)
    }
}

function parseData() {
    let samples = []
    data.forEach(datum => {
        let sample = datum.split(',')
        let parsedSample = new Datum(parseFloat(sample[0]), parseFloat(sample[1]), parseFloat(sample[2]))

        samples.push(parsedSample)
    });
    return samples
}


function divideData(samples, proportion) {
    let targetLength = samples.length * proportion
    let trainingData = []
    let testData = samples

    while (trainingData.length < targetLength) {
        let i = getRandomInt(samples.length)
        trainingData.push(testData.splice(i, 1)[0])
    }

    trainingData = sortData(trainingData)

    return [trainingData, testData]
}


let data = undefined
let file = document.getElementById('data')
file.addEventListener("change", function () {
    var reader = new FileReader()
    reader.onload = function () {
        data = this.result.split(/[\n\r]/)
        data = data.filter((str) => str != '').slice(1)
    }
    reader.readAsText(this.files[0])

    prepare_canvas()
    neuron = undefined
});


let buildNeuronButton = document.getElementById('buildNeuronButton')
buildNeuronButton.addEventListener('click', function () {
    let w0 = document.getElementById('w0Start').value * 1
    let w1 = document.getElementById('w1Start').value * 1
    let w2 = document.getElementById('w2Start').value * 1
    let learningRate = document.getElementById('learningRate').value * 1
    

    prepare_canvas()

    neuron = new Neuron(w0, w1, w2, learningRate)
    neuron.borderFunction.drawFunction("red")

    samples = parseData()
    samples.forEach(datum => {
        datum.drawDatum()
    });
})


let learnOnceButton = document.getElementById('learnOnceButton')
learnOnceButton.addEventListener('click', function () {

    samples.forEach(datum => {
        if (neuron.output(datum.x1, datum.x2) != datum.classification) {
            keepGoing = true
            neuron.learn(datum)
        }
    });

    neuron.borderFunction.drawFunction("purple")
})


let learnButton = document.getElementById('learnButton')
learnButton.addEventListener('click', function () {
    // let trainingDataProportion = document.getElementById('trainingDataProportion').value/100

    let maxCycles = document.getElementById('maxCycles').value * 1
    let currentCycles = 0
    let keepGoing = true

    while (keepGoing) {
        keepGoing = false
        currentCycles += 1

        samples.forEach(datum => {
            if (neuron.output(datum.x1, datum.x2) != datum.classification) {
                keepGoing = true
                neuron.learn(datum)
            }
        });

        if (currentCycles >= maxCycles) {
            keepGoing = false
        }
    }

    neuron.borderFunction.drawFunction("blue")
})