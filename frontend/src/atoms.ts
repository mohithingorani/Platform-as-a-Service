import { atom } from "recoil";

const userDataAtom = atom<any>({
    default:false,
    key:"userData"
})

export {userDataAtom}