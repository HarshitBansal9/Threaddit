export interface Post {
    id:string,
    title:string,
    description:string,
    images?:(File | String)[],
    timestamp:Date,
    tags?:string[],
}