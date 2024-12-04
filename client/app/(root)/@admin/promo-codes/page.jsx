import { fetcher } from "@/lib/fetch-client";
import PromoCodeManagement from "./promo-codes";

export default async function PromoCodePage() {
    const promoCodesRes = await fetcher('/promo-codes/all');

    if (promoCodesRes.ok) {
        const promoCodes = await promoCodesRes.json();
        return <PromoCodeManagement initialPromoCodes={promoCodes} />;
    }

    return null;
}