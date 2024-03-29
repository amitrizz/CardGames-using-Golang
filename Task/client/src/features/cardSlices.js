import { createSlice, nanoid } from "@reduxjs/toolkit"

const cardvalue = [
    { id: nanoid(), text: "CatCard", value: "cc" },
    { id: nanoid(), text: "DefuseCard", value: "dc" },
    { id: nanoid(), text: "SuffleCard", value: "sc" },
    { id: nanoid(), text: "CatCard", value: "cc" },
    { id: nanoid(), text: "BombCard", value: "bc" },
]
const initialState = {
    cards: cardvalue,
    game: "Running",
    isvalid: false,
    // token:""
}

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);
initialState.cards = shuffleArray(initialState.cards);

export const cardSlice = createSlice({
    name: "card",
    initialState,
    reducers: {
        checkCard: (state, action) => {
            const obj = state.cards
                .filter((card) => card.id === action.payload)
                .map((card) => ({ id: card.id, text: card.text, value: card.value }));
            state.cards = state.cards.filter((card) => card.id !== action.payload)
            if (obj[0].value === 'cc') {
                if (state.cards.length === 0) {
                    state.game = "Won";
                    state.cards=cardvalue;
                    // state.game = "Running";
                }
            } else if (obj[0].value === 'dc') {
                state.cards = state.cards.filter((card) => card.value !== "bc")
                if (state.cards.length === 0) {
                    state.game = "Won";
                    state.cards=cardvalue;
                    // state.game = "Running";
                }
            } else if (obj[0].value === 'sc') {
                state.cards = shuffleArray(state.cards);
                if (state.cards.length === 0) {
                    state.game = "Won";
                    state.cards=cardvalue;
                    // state.game = "Running";
                }
            } else {
                state.game = "Lost";
                state.cards=cardvalue;
                // state.game = "Running";
            }
            console.log(obj[0]);
        },
        changeValidation: (state, actions) => {
            state.isvalid = actions.payload
        },
        UpdateGame:(state,actions)=>{
            state.game="Running"
        }
    }
})

export const { checkCard, changeValidation,UpdateGame } = cardSlice.actions
export default cardSlice.reducer