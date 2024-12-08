"use client";

import { useState } from "react";
import { convertPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/providers/CurrencyProvider";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/fetch-client";
import {
  CreditCardIcon,
  WalletIcon,
  DollarSignIcon,
  Loader2,
  Tag,
} from "lucide-react";
import { RiDeleteBin5Line } from "react-icons/ri";
import LocationPicker from "@/components/shared/LocationPicker";
import LocationViewer from "@/components/shared/LoactionViewer";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Callout } from "@/components/ui/Callout";

const CheckoutComponent = ({ params }) => {
  const { touristId, cart, products, address, wallet } = params;
  const { currency } = useCurrencyStore();
  const router = useRouter();

  const productsInCart = products.filter((product) => {
    const cartItem = cart.find((item) => item.product === product._id);
    if (cartItem && !product?.Archived) {
      product.quantity = cartItem.quantity;
      return true;
    }
    return false;
  });

  const simplifiedProducts = productsInCart.map(
    ({ _id, quantity, Price, Name }) => ({
      ProductId: _id,
      Quantity: quantity,
      Price,
      Name,
    })
  );

  const totalPrice = productsInCart.reduce((total, product) => {
    return total + product.Price * product.quantity;
  }, 0);

  const [addresses, setAddresses] = useState(address);
  const [popupData, setPopupData] = useState({
    name: "",
    coordinates: [],
    type: "",
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [willBeUsedAddress, setWillBeUsedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [messageAboveButton, setMessageAboveButton] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState(null);

  const validatePromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }

    setValidatingPromo(true);
    setPromoError("");
    setPromoSuccess("");

    try {
      const response = await fetcher("/promo-codes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: promoCode,
          amount: totalPrice,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setPromoError(error.message);
        setDiscountedPrice(null);
        return;
      }

      const data = await response.json();
      setDiscountedPrice(
        data.type === "percentage"
          ? ((100 - data.value) / 100) * totalPrice
          : totalPrice - data.value
      );
      setPromoSuccess(
        data.type === "percentage"
          ? `${data.value}% discount applied!`
          : `${currency} ${data.value} discount applied!`
      );
    } catch (error) {
      setPromoError("Error validating promo code");
      setDiscountedPrice(null);
    } finally {
      setValidatingPromo(false);
    }
  };

  const handleAddressSelect = (address) => {
    setWillBeUsedAddress(address);
    setIsDropdownOpen(false);
  };

  const handleSavePopup = async () => {
    if (
      popupData.name &&
      addresses.find((address) => address.name === popupData.name)
    )
      setErrorMessage("Please enter an unused Name");
    else if (popupData.name && popupData.coordinates && popupData.type) {
      const updatedAddresses = [...addresses, popupData];
      setAddresses(updatedAddresses);
      setErrorMessage("");
      await fetcher(`/tourists/${touristId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Address: updatedAddresses }),
      });
      handleClosePopup();
    } else setErrorMessage("Please enter both Name and Location");
  };

  const handleLocationSelect = (location) => {
    setPopupData((prev) => ({
      ...prev,
      coordinates: location.coordinates,
      type: location.type,
    }));
  };

  const handlePopupNameChange = (e) => {
    setPopupData((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleRemoveAddress = async (name) => {
    if (willBeUsedAddress?.name === name) {
      if (addresses.length > 1) {
        const newSelectedAddress = addresses.find(
          (address) => address.name !== name
        );
        setWillBeUsedAddress(newSelectedAddress);
      } else {
        setWillBeUsedAddress(null);
      }
    }
    const updatedAddresses = addresses.filter(
      (address) => address.name !== name
    );
    setAddresses(updatedAddresses);
    await fetcher(`/tourists/${touristId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Address: updatedAddresses }),
    });
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupData({ name: "", coordinates: [], type: "" });
    setIsPopupOpen(false);
  };

  const handleBuy = async () => {
    try {
      setIsLoading(true);
      if (
        paymentMethod === "wallet" &&
        parseFloat(wallet) < (discountedPrice || totalPrice)
      ) {
        setMessageAboveButton("Insufficient balance in wallet");
        setTimeout(() => {
          setMessageAboveButton("");
        }, 3000);
        return;
      }

      setMessageAboveButton("");
      const response = await fetcher("/bookings/products/create-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          touristId: touristId,
          products: simplifiedProducts,
          currency: currency,
          paymentMethod: paymentMethod,
          promoCode: promoCode || undefined,
        }),
      });

      if (!response?.ok) {
        const data = await response.json();
        console.log(data.msg);
        return;
      }

      const data = await response.json();

      if (!data) {
        console.log("Error creating booking");
        return;
      }

      if (paymentMethod === "credit-card") router.push(data.url);
      //else alert("Booking successful!");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSuccess(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        router.push("/");
      }, 2500);
      return () => clearTimeout(timer);
    }
  };

  return (
    <div className="p-6 px-14">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Checkout</h1>

      {productsInCart.length > 0 ? (
        <Table className="w-full mb-6">
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4 text-left">Product</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-center">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsInCart.map((product) => (
              <TableRow key={product?._id} className="hover:bg-gray-100">
                <TableCell className="flex items-center space-x-4">
                  <img
                    src={product.Image}
                    alt={product.Name}
                    className="object-cover w-16 h-16 rounded-md"
                  />
                  <span className="font-semibold text-gray-700">
                    {product.Name}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {product.quantity}
                </TableCell>
                <TableCell className="text-center">
                  {currency === "USD" ? "$" : currency === "EUR" ? "€" : "EGP"}{" "}
                  {convertPrice(
                    (product.Price * product.quantity).toFixed(2),
                    currency
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-center text-gray-600">No products in the cart.</p>
      )}

      <div className="block w-full mb-3">
        <span className="block font-medium text-gray-700">Saved Addresses</span>
        <div className="flex items-center mt-1">
          <div className="relative w-full">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="block w-full p-2 text-gray-400 transition duration-200 ease-in-out bg-gray-100 border border-gray-300 rounded-md cursor-pointer"
            >
              {willBeUsedAddress
                ? willBeUsedAddress.name
                : addresses.length > 0
                ? addresses[0].name
                : "No Saved Addresses"}
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full mt-1 bg-white border border-gray-300 z-[8] rounded-md shadow-lg">
                {addresses.length > 0 ? (
                  addresses.map((address) => (
                    <li
                      key={address.name}
                      className="z-50 flex items-center justify-between p-2 text-gray-700 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleAddressSelect(address)}
                    >
                      <span
                        className={`${
                          willBeUsedAddress?.name === address.name
                            ? "font-bold text-blue-500"
                            : ""
                        }`}
                      >
                        {address.name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveAddress(address.name);
                        }}
                        className="p-1 ml-2 text-red-500 hover:text-red-700"
                      >
                        <RiDeleteBin5Line size={18} />
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500">No Saved Addresses</li>
                )}
              </ul>
            )}
          </div>

          <button
            onClick={handleOpenPopup}
            className="p-2 ml-2 text-white transition duration-200 ease-in-out bg-purple-500 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            +
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label
          htmlFor="promoCode"
          className="block text-sm font-medium text-gray-700"
        >
          Promo Code
        </label>
        <div className="flex mt-1 space-x-2">
          <input
            type="text"
            id="promoCode"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="Enter promo code"
            className="block w-full uppercase border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <button
            type="button"
            onClick={validatePromoCode}
            disabled={validatingPromo}
            className="flex items-center px-4 py-2 text-sm text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {validatingPromo ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Tag className="w-4 h-4 mr-2" />
            )}
            Apply
          </button>
        </div>
        {promoError && (
          <p className="mt-1 text-sm text-red-500">{promoError}</p>
        )}
        {promoSuccess && (
          <p className="mt-1 text-sm text-green-500">{promoSuccess}</p>
        )}
        {discountedPrice && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 line-through">
              Original Price: {currency} {convertPrice(totalPrice, currency)}
            </p>
            <p className="text-sm font-medium text-blue-600">
              Discounted Price: {currency}{" "}
              {convertPrice(discountedPrice, currency)}
            </p>
          </div>
        )}
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black z-[10] bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-xl font-bold">Add Address</h2>
            {errorMessage && (
              <div className="mb-4 text-sm text-red-500">{errorMessage}</div>
            )}
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">
                Name:
              </label>
              <input
                type="text"
                value={popupData.name}
                onChange={handlePopupNameChange}
                className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="mb-4">
              <h3 className="mb-2 text-lg font-semibold">Location:</h3>
              <LocationPicker onLocationSelect={handleLocationSelect} />
            </div>

            {popupData.Location && (
              <div className="mb-4">
                <h4 className="mb-2 text-lg font-semibold">
                  Selected Location:
                </h4>
                <LocationViewer
                  location={{
                    coordinates: popupData.coordinates,
                    type: popupData.type,
                  }}
                />
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleClosePopup}
                className="p-2 mr-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePopup}
                className="p-2 text-white bg-purple-500 rounded-md hover:bg-purple-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 text-right total-price">
        <h2 className="mb-2 text-xl font-semibold text-gray-800">
          Total Price
        </h2>
        <div className="flex items-center justify-end space-x-1">
          <span className="text-2xl font-bold text-gray-900">
            {currency === "USD" ? "$" : currency === "EUR" ? "€" : "EGP"}{" "}
            {convertPrice((discountedPrice || totalPrice).toFixed(2), currency)}
          </span>
        </div>
      </div>

      <div className="flex justify-center mt-6 space-x-4 payment-methods">
        <button
          onClick={() => setPaymentMethod("cash-on-delivery")}
          className={`p-4 rounded-lg w-40 flex items-center justify-center space-x-2 text-lg font-medium transition ${
            paymentMethod === "cash-on-delivery"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <DollarSignIcon className="w-6 h-6" />
          <span>Cash</span>
        </button>

        <button
          onClick={() => setPaymentMethod("wallet")}
          className={`p-4 rounded-lg w-40 flex items-center justify-center space-x-2 text-lg font-medium transition ${
            paymentMethod === "wallet"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <WalletIcon className="w-6 h-6" />
          <span>Wallet</span>
        </button>

        <button
          onClick={() => setPaymentMethod("credit-card")}
          className={`p-4 rounded-lg w-40 flex items-center justify-center space-x-2 text-lg font-medium transition ${
            paymentMethod === "credit-card"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <CreditCardIcon className="w-6 h-6" />
          <span>Card</span>
        </button>
      </div>

      <button
        onClick={handleBuy}
        disabled={!paymentMethod || !willBeUsedAddress || isLoading}
        className={`w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-medium transition hover:bg-blue-600 z-[5] mt-8 flex justify-center items-center space-x-2 ${
          !paymentMethod || !willBeUsedAddress || isLoading
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          "Buy"
        )}
      </button>

      {isSuccess && (
        <Callout variant="success" title="Purchase successful" className="mt-2">
          Redirecting to home page...
        </Callout>
      )}

      {messageAboveButton && (
        <p className="mt-2 text-sm text-center text-red-500">
          {messageAboveButton}
        </p>
      )}
    </div>
  );
};

export default CheckoutComponent;
