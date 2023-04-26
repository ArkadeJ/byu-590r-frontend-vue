import { createStore } from "vuex";
import { auth } from "./auth.module";
import { user } from "./user.module";
import { books } from "./books.module";
import { fishes } from "./fish.module";

const store = createStore({
    modules: {
        auth,
        user,
        books,
        fishes,
    },
});

export default store; 