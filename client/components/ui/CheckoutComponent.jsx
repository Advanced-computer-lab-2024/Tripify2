"use client";

import { useState } from "react";
import { convertPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/providers/CurrencyProvider";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/fetch-client";
import { DollarSignIcon } from "lucide-react";
import { RiDeleteBin5Line } from "react-icons/ri";
import LocationPicker from "@/components/shared/LocationPicker";
import LocationViewer from "@/components/shared/LoactionViewer";

const CheckoutComponent = ({ params }) => {
  const { touristId, cart, products, address, wallet } = params;

  //   console.log(`-----/----------------------${wallet}`);
  //   console.log(`---------------------------${typeof wallet}`);

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

  //console.log(simplifiedProducts);

  const totalPrice = productsInCart.reduce((total, product) => {
    return total + product.Price * product.quantity;
  }, 0);

  //   console.log(`===============================${totalPrice}`);
  //   console.log(`===============================${typeof totalPrice}`);

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
      //   console.log(
      //     JSON.stringify({
      //       touristId: touristId,
      //       products: simplifiedProducts,
      //       currency: currency,
      //       paymentMethod: paymentMethod,
      //     })
      //   );
      //   console.log(parseInt(wallet) < totalPrice);
      if (paymentMethod === "wallet" && parseInt(wallet) < totalPrice) {
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
      else alert("Booking successful!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="checkout-container">
      <h1 className="text-xl font-bold mb-4">Checkout</h1>

      {productsInCart.length > 0 ? (
        <div className="products-list">
          {productsInCart.map((product, index) => (
            <div
              key={index}
              className="product-item flex mb-4 p-4 border-b border-gray-300"
            >
              <div className="product-image w-32 h-32 mr-4">
                <img
                  src={product.Image}
                  alt={product.Name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>

              <div className="product-details flex flex-col justify-between">
                <div>
                  <h2 className="font-semibold text-lg">{product.Name}</h2>
                  <div className="price-info flex items-center">
                    <DollarSignIcon className="w-5 h-5 mr-2 text-yellow-500" />
                    <span className="mr-1 text-sm font-light">
                      {currency === "USD"
                        ? "$"
                        : currency === "EUR"
                        ? "€"
                        : "EGP"}{" "}
                      {convertPrice(
                        (product.Price * product.quantity).toFixed(2),
                        currency
                      )}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-2">
                  Quantity: {product.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No products in the cart.</p>
      )}

      <div className="block w-full">
        <span className="block font-medium text-gray-700">Saved Addresses</span>
        <div className="flex items-center mt-1">
          <div className="relative w-full">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="block w-full p-2 transition duration-200 ease-in-out border border-gray-300 rounded-md bg-gray-100 text-gray-400 cursor-pointer"
            >
              {willBeUsedAddress
                ? willBeUsedAddress.name
                : addresses.length > 0
                ? addresses[0].name
                : "No Saved Addresses"}
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {addresses.length > 0 ? (
                  addresses.map((address) => (
                    <li
                      key={address.name}
                      className="flex items-center justify-between p-2 text-gray-700 cursor-pointer hover:bg-gray-100"
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
                          e.stopPropagation(); //prevent the dropdown from closing when clicking delete
                          handleRemoveAddress(address.name);
                        }}
                        className="ml-2 p-1 text-red-500 hover:text-red-700"
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
            className="ml-2 p-2 text-white bg-purple-500 rounded-md transition duration-200 ease-in-out hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            +
          </button>
        </div>
      </div>
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add Address</h2>
            {errorMessage && (
              <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
            )}
            <div className="mb-4">
              <label className="block font-medium text-gray-700 mb-2">
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
              <h3 className="text-lg font-semibold mb-2">Location:</h3>
              <LocationPicker onLocationSelect={handleLocationSelect} />
            </div>

            {popupData.Location && (
              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2">
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
                className="mr-2 p-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
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

      <div className="total-price mb-4">
        <h2 className="font-semibold text-lg">Total Price</h2>
        <div className="flex items-center">
          <DollarSignIcon className="w-5 h-5 mr-2 text-yellow-500" />
          <span className="text-lg font-bold">
            {currency === "USD" ? "$" : currency === "EUR" ? "€" : "EGP"}{" "}
            {convertPrice(totalPrice.toFixed(2), currency)}
          </span>
        </div>
      </div>

      <div className="payment-methods flex space-x-4 mt-4">
        <button
          onClick={() => setPaymentMethod("cash-on-delivery")}
          className={`p-3 rounded-md w-32 text-center ${
            paymentMethod === "cash-on-delivery"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Cash on Delivery
        </button>

        <button
          onClick={() => setPaymentMethod("wallet")}
          className={`p-3 rounded-md w-32 text-center ${
            paymentMethod === "wallet"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Wallet
        </button>

        <button
          onClick={() => setPaymentMethod("credit-card")}
          className={`p-3 rounded-md w-32 text-center ${
            paymentMethod === "credit-card"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Credit Card
        </button>
      </div>

      <div className="buy-button">
        <button
          onClick={handleBuy}
          disabled={!paymentMethod || !willBeUsedAddress}
          className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 ${
            !paymentMethod || !willBeUsedAddress
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          Buy
        </button>

        {messageAboveButton && (
          <p className="text-red-500 text-sm mt-2">{messageAboveButton}</p>
        )}
      </div>
    </div>
  );
};

export default CheckoutComponent;
