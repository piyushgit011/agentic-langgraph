import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logout, clearError } from '../store/slices/authSlice';
import { RootState, AppDispatch } from '../store/store';

interface LoginCredentials {
    email: string;
    password: string;
}

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const auth = useSelector((state: RootState) => state.auth);

    return {
        // State
        user: auth.user,
        isAuthenticated: auth.isAuthenticated,
        loading: auth.loading,
        error: auth.error,

        // Actions
        login: (credentials: LoginCredentials) => dispatch(loginUser(credentials)),
        logout: () => dispatch(logout()),
        clearError: () => dispatch(clearError()),
    };
}; 
