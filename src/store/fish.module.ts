import fishesService from "../services/fish.service";

const initialState = { fishesList: [], rodsList: [], fliesList: [] };

export const fishes = {
    namespaced: true, 
    state: initialState,
    actions: {
        getFishes({ commit }) {
            return fishesService.getFishes().then(
                fishes => {
                    commit('setFishes', fishes);
                    return Promise.resolve(fishes);
                } 
            );
        },
        getRods({ commit }) {
            return fishesService.getRods().then(
                rods => {
                    commit('setRods', rods);
                    return Promise.resolve(rods);
                } 
            );
        },
        getFlies({ commit }) {
            return fishesService.getFlies().then(
                flies => {
                    commit('setFlies', flies);
                    return Promise.resolve(flies);
                } 
            );
        },
        createFish({ commit }, fish) {
            return fishesService.createFish(fish).then(
                response => {
                    commit('addFish', response.fish);
                    return Promise.resolve(response.fish);
                }
            );
        },
        updateFish({ commit, getters }, fish) {
            return fishesService.updateFish(fish).then(
                response => {
                    response.fish.index = getters.getFishStateIndexByFishID(response.fish.id);
                    commit('setFish', response.fish);
                    return Promise.resolve(response.fish);
                }
            );
        },
        deleteFish({ commit, getters }, fish) {
            return fishesService.deleteFish(fish).then(
                response => {
                    response.fish.index = getters.getFishStateIndexByFishID(response.fish.id);
                    commit('removeFish', response.fish);
                    return Promise.resolve(response.data);
                }
            );
        },
        updateFishPicture({ commit, getters }, fish) {
            return fishesService.updateFishPicture(fish).then(
                response => {
                    response.fish.index = getters.getFishStateIndexByFishID(response.fish.id);
                    commit('updateFishPicture', response.fish);
                    return Promise.resolve(response.data);
                }
            );
        }
    },
    mutations: {
        setFishes(state, fishes) {
            console.log(fishes);
            state.fishesList = fishes.map((fish) => {
                return fish;
            });
        },
        setRods(state, rods){
            state.rodsList = rods.map((rod) => {
                return {
                    value:rod.id,
                    title:rod.weight,
                };
            });
        },
        setFlies(state, flies){
            state.fliesList = flies.map((fly) => {
                return {
                    value:fly.id,
                    title:fly.type,
                };
            });
        },
        addFish(state, fish) {
            state.fishesList.push(fish);
        },
        setFish(state, fish) {
            state.fishesList[fish.index] = fish;
        },
        removeFish(state, fish) {
            state.fishesList.splice(fish.index + 1, 1);
        },
        updateFishPicture(state, fish) {
            state.fishesList[fish.index].file = fish.file;
        }
    },
    getters: {
        getFishStateIndexByFishID: state => (fishID) => {
            return state.fishesList.findIndex(fish => {
                return fish.id === fishID;
            })
        }
    }
} 