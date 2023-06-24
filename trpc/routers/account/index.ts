import {createTRPCRouter} from "@/trpc";
import deleteAccount from "./delete-account";
import updatePassword from "./update-password";
import recharge from "./recharge";
import checkPayResult from "./check-pay-result";
import checkIn from "./check-in";
import listPayHistory from "./list-pay-history";
import listUsageHistory from "./list-usage-history";


const accountRouter = createTRPCRouter({
    deleteAccount,
    updatePassword,
    recharge,
    checkPayResult,
    checkIn,
    listPayHistory,
    listUsageHistory
});

export default accountRouter;