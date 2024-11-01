export interface Post {
    id: string;
    title: string;
    description: string;
    images?: (File | String)[];
    timestamp: Date;
    tags?: string[];
}

export interface User {
    id: number;
    username: string;
    email: string;
    createdAt: string | Date;
}

type Errors = any;

interface SuccessResponse<T> {
    success: true;
    data: T;
}

interface FailureResponse<E> {
    success: false;
    error: E;
}

export declare namespace ThreadditAPI {
    namespace Users {
        namespace List {
            interface Request {
                a: string;
            }
            type Response = SuccessResponse<User[]> | FailureResponse<Errors>;
        }
    }
}
