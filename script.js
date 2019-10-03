"use strict";

const AUTOMATIC = "AUTOMATIC";
const MANUAL = "MANUAL";
const CVT = "CVT";
const CAMRY = "CAMRY";
const COROLLA = "COROLLA";
const LAND_CRUISER = "LAND CRUISER";
const RED = "RED";
const BLACK = "BLACK";
const WHITE = "WHITE";
const METALLIC = "METALLIC";
const MODEL = "MODEL";
const TRANSMISSION = "TRANSMISSION";
const ENGINE = "ENGINE";
const COLOR = "COLOR";

const CATALOG = {
    [MODEL]: {
        [CAMRY]: 1000,
        [COROLLA]: 1500,
        [LAND_CRUISER]: 1700,
    },
    [COLOR]: {
        [RED]: 200,
        [BLACK]: 175,
        [WHITE]: 250,
        [METALLIC]: 275,
    },
    [ENGINE]: {
        "1.6": 450,
        "1.8": 500,
        "2.0": 750,
        "2.2": 800,
    },
    [TRANSMISSION]: {
        [MANUAL]: 1000,
        [AUTOMATIC]: 1500,
        [CVT]: 1600,
    },
};

const EXTRAVALUE = {
    [MODEL]: {
        [CAMRY]: 150,
        [COROLLA]: 200,
        [LAND_CRUISER]: 350,
    },
    [COLOR]: {
        [RED]: 25,
        [BLACK]: 50,
        [WHITE]: 50,
        [METALLIC]: 75,
    },
    [ENGINE]: {
        "1.6": 100,
        "1.8": 120,
        "2.0": 150,
        "2.2": 175,
    },
    [TRANSMISSION]: {
        [MANUAL]: 300,
        [AUTOMATIC]: 330,
        [CVT]: 120,
    },
};

class SparePart {
    constructor(type, kind) {
        this.type = type;
        this.kind = kind;
    }

    getPrice(catalog = CATALOG) {
        return catalog[this.getSpareType()][this.getSpareKind()] || "Запчасть не найдена.";
    };

    getSpareType() {
        return this.type;
    };

    getSpareKind() {
        return this.kind;
    };
}

class Model extends SparePart {
    constructor(name = CAMRY) {
        super(MODEL, name);
    }
}

class Transmission extends SparePart {
    constructor(name = MANUAL) {
        super(TRANSMISSION, name);
    }
}

class Engine extends SparePart {
    constructor(volume = "1.6") {
        super(ENGINE, volume);
    }
}

class Color extends SparePart {
    constructor(name = WHITE) {
        super(COLOR, name);
    }
}

class Car {

    constructor(model, engine, color, transmission) {
        this.model = model;
        this.engine = engine;
        this.color = color;
        this.transmission = transmission;
        this.ID = this.generateID();
        this.price = this.getPrice(CATALOG);
    }

    getPrice(catalog) {
        return Object.keys(this).reduce((accumulator, current) => {
            if (this[current] instanceof SparePart) {
                return accumulator + this[current].getPrice(catalog);
            }
            return accumulator;
        }, 0);
    }

    generateID() {
        let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let numbers = "0123456789";
        let result = "";
        for (let i = 1; i <= 3; i++) {
            result += alphabet.charAt(Math.floor(Math.random() * (alphabet.length)));
        }
        result += " ";
        for (let i = 1; i <= 3; i++) {
            result += numbers.charAt(Math.floor(Math.random() * (numbers.length)));
        }
        return result;
    }

    toString() {
        return `Toyota ${this.model.kind} ${this.color.kind} (${this.ID}). ${this.price}$`;
    }

}

class CarShop {
    constructor(list, baseCatalog = CATALOG, extraCatalog = EXTRAVALUE) {
        this.cash = 0;
        this.baseCatalog = baseCatalog;
        this.extraCatalog = extraCatalog;
        this.priceList = this.initPriceList(list, baseCatalog, extraCatalog);
    }

    initPriceList(list, baseCatalog, extraCatalog) {
        this.priceList = list;
        this.priceList.forEach((car) => {
            car.price = Math.round(car.getPrice(baseCatalog) + car.getPrice(extraCatalog));
        });
        return this.priceList;
    }

    updatePriceList() {
        this.priceList.forEach((car) => {
            car.price = Math.round(car.getPrice(this.baseCatalog) + car.getPrice(this.extraCatalog));
        });
    }

    sort() {
        return this.priceList.sort(comparePrice);
    }

    addCar(car) {
        this.priceList.push(car);
        this.updatePriceList();
    }

    addCars(cars) {
        this.priceList = [...this.priceList, ...cars];
        this.updatePriceList();
    }

    showPriceList() {
        this.priceList.forEach((car) => {
            console.log(car.toString());
        });
    }

    buy(car) {
        this.cash += car.price;
        let pos = 0;
        for (let i = 0; i < this.priceList.length; i++) {
            if (this.priceList[i] === car) {
                pos = i;
                break;
            }
        }
        console.log(`SOLD OUT Toyota ${car.model.kind} ${car.color.kind} (${car.ID}). ${car.price}$`);
        this.priceList.splice(pos, 1);
    }

    getCarByPrice(value) {
        let difference = [];
        this.priceList.forEach((car) => {
            difference.push(Math.abs(car.price - value));
        });
        return this.priceList[difference.indexOf(Math.min.apply(null, difference))];
    }

    filter(min, max) {
        let isFind = false;
        this.priceList.forEach((car) => {
            if (car.price >= min && car.price <= max) {
                console.log(car.toString());
                isFind = true;
            }
        });
        if (!isFind) {
            console.log("По заданному диапазону машин не найдено.");
        }
    }
}

function comparePrice(obj1, obj2) {
    return obj1.price - obj2.price;
}

let cars = [
    new Car(new Model(CAMRY),
        new Engine("2.0"),
        new Color(WHITE),
        new Transmission(AUTOMATIC)),
    new Car(new Model(LAND_CRUISER),
        new Engine("1.8"),
        new Color(RED),
        new Transmission(MANUAL)),
    new Car(new Model(COROLLA),
        new Engine("2.2"),
        new Color(WHITE),
        new Transmission(CVT)),
    new Car(new Model(CAMRY),
        new Engine("2.0"),
        new Color(WHITE),
        new Transmission(MANUAL)),
    new Car(new Model(COROLLA),
        new Engine("2.0"),
        new Color(METALLIC),
        new Transmission(AUTOMATIC)),
    new Car(new Model(CAMRY),
        new Engine("2.2"),
        new Color(WHITE),
        new Transmission(CVT)),
    new Car(new Model(COROLLA),
        new Engine("1.8"),
        new Color(RED),
        new Transmission(AUTOMATIC)),
    new Car(new Model(LAND_CRUISER),
        new Engine("1.6"),
        new Color(BLACK),
        new Transmission(MANUAL)),
];

let shop = new CarShop(cars);
shop.sort();
shop.showPriceList();
let min = +prompt("Минимальная цена", 0);
let max = +prompt("Максимальная цена");
shop.filter(min, max);