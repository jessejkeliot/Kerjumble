type actionTypes = "palette" | "image";

export type Action ={ type: "image"; data: ImageData | null, tabID: string};

type HistoryState = {
    stack: Action[];
};

export const actionHistory = $state({
    stack: [] as Action[],
    index: -1,

    save(newAction: Action) {
        console.log(`ActionHistory: saving ${newAction.type} to stack`)
        // if we are in the middle of the stack and a new action is recorded we should clear the rest of the stack
        
        this.stack = [...this.stack.slice(0, this.index + 1), newAction]


        if (this.stack.length > 5) {
            this.stack.shift();
        }

        this.index = this.stack.length - 1;
        console.log(`New stack index = ${this.index}`)
    },

    redo() {
        if (this.index < this.stack.length - 1) {
            this.index++;
            return this.stack[this.index]
        } else {
            console.log(`can't redo index = ${this.index}`);
        }
    },
    undo() {
        if (this.index > 0) {
            console.log(`undoing ${this.stack[this.index].type}`)
            this.index--;
            console.log(`New stack index = ${this.index}`)
            return this.stack[this.index];
        }
        else if(this.index === 0){
            console.log(`can't undo anymore this.index = ${this.index}`);
            return this.stack[0]
        }
        return undefined;
    },
    purgeImageActions(id: string){
        this.stack = this.stack.filter((x)=> {
            x.tabID !== id && x.type == "image"
        })
    }
});
