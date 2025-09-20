import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService, LoginResponse } from '../../services/apiService';

interface User {
    role: string;
    email: string;
    firstName: string;
    lastName: string;
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    initialized: boolean;
}

// API response shapes are handled in service types; no local interface needed

// Async thunk for login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {

            const result = await apiService.login(credentials);

            // Check if the response has the expected structure
            if (result.success && result.data) {
                const loginData = result.data as LoginResponse;
                const role = loginData?.role;
                const email = loginData?.email;
                const name = loginData?.firstName || '';
                const [firstName, ...rest] = name.split(' ');
                const lastName = rest.join(' ');

                return {
                    role,
                    email,
                    firstName,
                    lastName,
                } as User;
            } else {
                throw new Error(result.message || 'Login failed');
            }
        } catch (error: any) {
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

// Async thunk for auto-login on refresh
export const autoLogin = createAsyncThunk(
    'auth/autoLogin',
    async (_, { rejectWithValue }) => {
        try {
            const result = await apiService.autoLogin();
            if (result.success && result.data) {
                const userData = result.data;
                return {
                    role: userData.role,
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                } as User;
            }
            throw new Error(result.message || 'Auto login failed');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Auto login failed');
        }
    }
);

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    initialized: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.initialized = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.error = null;
                state.initialized = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
                state.initialized = true;
            })
            .addCase(autoLogin.pending, (state) => {
                state.loading = true;
            })
            .addCase(autoLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload as User;
                state.initialized = true;
                state.error = null;
            })
            .addCase(autoLogin.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.initialized = true;
            });
    },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;

