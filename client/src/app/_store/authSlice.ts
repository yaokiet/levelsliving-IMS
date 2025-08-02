import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { User, AuthState } from "@/types/auth"

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    initialized: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload
            state.isAuthenticated = true
            state.initialized = true
        },
        clearUser(state) {
            state.user = null
            state.isAuthenticated = false
            state.initialized = true
        },
        setInitialized(state) {
            state.initialized = true
        }
    },
})

export const { setUser, clearUser, setInitialized } = authSlice.actions
export default authSlice.reducer
