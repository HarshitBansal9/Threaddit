export interface AlteredPost {
    postId:number,
    userId:number,
    username:string,
    email:string
    title:string,
    description:string,
    createdAt:Date,
    isPublic:boolean,
    imageUrls:string[], 
    tags:string[],
    commentsEnabled:boolean,
    roomId?:number
}
export interface Post {
    postId?: number;
    userId: number;
    title: string;
    description: string;
    createdAt: Date;
    isPublic: boolean;
    commentsEnabled: boolean;
}

export interface User {
    id: number;
    username: string;
    email: string;
    createdAt: string | Date;
}

// type Errors = any;

// interface SuccessResponse<T> {
//     success: true;
//     data: T;
// }

// interface FailureResponse<E> {
//     success: false;
//     error: E;
// }

// export declare namespace ThreadditAPI {
//     namespace Users {
//         namespace List {
//             interface Request {
//                 a: string;
//             }
//             type Response = SuccessResponse<User[]> | FailureResponse<Errors>;
//         }
//     }
// }
