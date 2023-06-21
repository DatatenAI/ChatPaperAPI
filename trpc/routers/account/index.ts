import {createTRPCRouter} from "@/trpc";
import deleteAccount from "./deleteAccount";
import updatePassword from "./updatePassword";
import recharge from "./recharge";


const accountRouter = createTRPCRouter({
    deleteAccount,
    updatePassword,
    recharge,
});

export default accountRouter;