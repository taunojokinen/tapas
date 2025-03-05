export interface AppProps {
    title: string;
    description?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface State {
    users: User[];
    loading: boolean;
    error?: string;
}