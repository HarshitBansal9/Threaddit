export interface Post {
    title:string,
    description:string,
    images:(File | String)[],
    timestamp:Date,
    tags:string[],
}