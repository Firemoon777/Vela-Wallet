import file from '@system.file'

export class CardStorage {
    constructor() {
        this.file = "internal://files/data/wallet.json";
        this.data = [];
        this.index = 0;
        this.load();
    }

    load(success, fail) {
        let self = this
        file.readText({
            uri: this.file,
            success: (data) => {
                try {
                    self.data = JSON.parse(data.text)
                    for(let i = 0; i < self.data.length; i++) {
                        self.index = Math.max(self.index, self.data[i].index + 1)
                    }
                    success(self.data)
                } catch(e) {}
            },
            fail: (data, code) => {
                self.data = []
                self.index = 0;
                fail(data, code)
            }
        })
    }

    save(success, fail) {
        file.writeText({
            uri: this.file, 
            text: JSON.stringify(this.data),
            success: success, 
            fail: fail
        })
    }

    addCard(card) {
        let fn = `card_${Math.round(Math.random() * 1e8)}.png`;
        
        this.data.push({
            ...card,
            filename: fn,
            index: this.index
        })

        this.index++;
    }

    _editCard(index, editData, callback) {
        console.log("loaded, editing " + index)
        for(let i = 0; i < this.data.length; i++) {
            console.log(`${this.data[i].index} (${typeof(this.data[i].index)}) === ${index} (${typeof(index)})`)
            if(this.data[i].index === index) {
                for(let key in editData) {
                    this.data[i][key] = editData[key];
                }
                console.log("edited")
                break
            }
        }

        this.save(callback)
    }

    editCard(index, editData, callback) {
        let self = this
        this.load((data) => {
            self._editCard(Number(index), editData, callback)
        }, (code, data) => {
            console.log(`failed to load: ${code} ${data}`)
        })
    }

    _deleteCard(index, callback) {
        console.log("loaded, removing " + index)
        for(let i = 0; i < this.data.length; i++) {
            console.log(`${this.data[i].index} (${typeof(this.data[i].index)}) === ${index} (${typeof(index)})`)
            if(this.data[i].index === index) {
                this.data.splice(index, 1)
                console.log("removed")
                break
            }
        }

        this.save(callback, (code, data) => {
            console.log(`failed to save: ${code} ${data}`)
        })
    }

    deleteCard(index, callback) {
        console.log("deleting card " + index)
        let self = this
        this.load((data) => {
            self._deleteCard(Number(index), callback)
        }, (code, data) => {
            console.log(`failed to load: ${code} ${data}`)
        })
    }
}