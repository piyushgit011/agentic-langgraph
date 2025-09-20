import 'styled-components';
import { Theme } from './assets/styles/theme';

declare module 'styled-components' {
    export interface DefaultTheme extends Theme {}
} 
