import { getSession } from "@/lib/session";
import { fetcher } from "@/lib/fetch-client";
import CheckoutComponent from "@/components/ui/checkoutComponent";

const checkoutMainPage = async () => {
  try {
    const resProducts = await fetcher("/products").catch((e) => console.log(e));

    if (!resProducts?.ok) {
      const productsError = await resProducts.json();
      console.log(productsError);
      return <>error</>;
    }

    const products = await resProducts.json();

    const session = await getSession();

    const touristId = session?.user?.id;

    const resTourist = await fetcher(`/tourists/${touristId}`).catch((e) =>
      console.log(e)
    );

    if (!resTourist?.ok) {
      const touristError = await resTourist.json();
      console.log(touristError);
      return <>error</>;
    }

    const tourist = await resTourist.json();

    const cart = tourist.Cart;
    const address = tourist.Address;
    const wallet = tourist.Wallet;

    const params = {
      touristId,
      cart,
      products,
      address,
      wallet,
    };

    // return <CheckoutComponent params={params} />;
    return (
      <div className="my-8 px-4">
        <CheckoutComponent params={params} />
      </div>
    );
  } catch (e) {
    return <h1>error fetching tourist</h1>;
  }
};

export default checkoutMainPage;
