import {createTRPCRouter} from "@/trpc";
import deleteAccount from "./deleteAccount";
import updatePassword from "./updatePassword";


const accountRouter = createTRPCRouter({
    deleteAccount,
    updatePassword,
});

export default accountRouter;