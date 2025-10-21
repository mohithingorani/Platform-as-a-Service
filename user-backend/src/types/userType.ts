export interface User {
    id:string,
    name:string,
    email:string,
    profilePicture?:string,
    createdAt:string,
    updatedAt:string
}

export type PublicUser = Omit<User,"updatedAt | createdAt">
