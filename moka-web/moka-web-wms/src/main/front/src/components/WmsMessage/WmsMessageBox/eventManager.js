export const eventManager = {
    list: new Map(),
    on(event, callback) {
        if (!this.list.has(event)) {
            this.list.set(event, []);
        }
        this.list.get(event).push(callback);
        return this;
    },

    off(event) {
        this.list.delete(event);
        return this;
    },

    emit(event, ...args) {
        if (this.list.has(event)) {
            this.list.get(event).forEach((callback) =>
                setTimeout(() => {
                    callback(...args);
                }, 0)
            );
        }
    }
};
