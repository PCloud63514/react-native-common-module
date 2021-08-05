export default class Optional<T> {
    private static EMPTY:Optional<any> = new Optional();
    private value:T | null = null
    
    private constructor(value?:T) {
        if (value == undefined) {
            this.value = null;
        } else {
            this.value = value;
        }
    }

    static empty<T>():Optional<T> {
        var t:Optional<T> = Optional.EMPTY;
        return t;
    }

    static of<T>(value:T) {
        if (value == undefined || value == null) {
            throw new Error("value is null");
        }
        return new Optional<T>(value);
    }

    static ofNullable<T>(value:T):Optional<T> {
        try {
            return this.of(value);
        } catch {
            return this.empty();
        }
    }

    get():T {
        if(this.value == null || undefined) {
            throw new Error("No value present");
        }
        return this.value;
    }

    isPresent():boolean {
        return (this.value != null && this.value != undefined);
    }

    isEmpty():boolean {
        return (this.value == null && this.value != undefined);
    }

    orElseGet(value:T):T {
        if (this.isEmpty()) {
            return value
        }
        return this.value!!
    } 
}