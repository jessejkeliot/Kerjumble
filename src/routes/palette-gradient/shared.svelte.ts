type actionTypes = "palette" | "image";

export type Action = { type: "palette"; data: Map<string, number>, tabID: string} | { type: "image"; data: ImageData, tabID: string};

type HistoryState = {
    stack: Action[];
};

export const actionHistory = $state({
    stack: [] as Action[],
    index: -1,

    save(newAction: Action) {
        // if we are in the middle of the stack and a new action is recorded we should clear the rest of the stack
        if (this.index !== this.stack.length - 1) {
            for (let index = this.stack.length - 1; index > this.index; index--) {
                this.stack.pop();
            }
        }

        this.stack.push(newAction);

        if (this.stack.length > 4) {
            this.stack.shift();
        }

        this.index = this.stack.length - 1;
    },

    redo() {
        if (this.index === this.stack.length - 1) {
            console.log("Can't redo");
            return;
        } else {
            this.index++;
            return this.stack[this.index]
        }
    },
    undo() {
        console.log("undoing")
        if (this.index > -1) {
            this.index--;
            console.log(this.stack[this.index])
            return this.stack[this.index] ?? null;
        }
        else{
            console.log("can't undo anymore");
        }
    },
    purgeImageActions(id: string){
        this.stack.filter((x)=> {
            x.tabID !== id && x.type == "image"
        })
    },
    purgePaletteActions(id: string){
        this.stack.filter((x)=> {
            x.tabID !== id && x.type == "palette"
        })
    }
});
