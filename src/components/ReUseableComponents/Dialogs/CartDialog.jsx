import React from "react";
import { X } from "lucide-react";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  selectCartItems,
  selectTotalItems,
  selectCartTotalPrice,
  clearCart,
  removeItemFromCart,
  selectCartProvider,
} from "@/redux/reducers/cartSlice";
import { removeCartApi } from "@/api/apiRoutes";
import { MdClose } from "react-icons/md";
import Link from "next/link";
import { placeholderImage, showPrice, useRTL } from "@/utils/Helper";
import { useTranslation } from "@/components/Layout/TranslationContext";
import CustomImageTag from "../CustomImageTag";

const CartDropdown = ({ isVisible, onOpenChange }) => {
  const t = useTranslation();
  const isRtl = useRTL();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const currentCartProviderData = useSelector(selectCartProvider);
  const totalItems = useSelector(selectTotalItems);
  const totalPrice = useSelector(selectCartTotalPrice);

  const handleRemoveItem = async (itemId) => {
    try {
      // Remove the item completely from the cart
      const response = await removeCartApi({ itemId: itemId });
      if (response?.error === false) {
        dispatch(removeItemFromCart(itemId)); // Directly remove the item from Redux
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleClearCart = async () => {
    try {
      // Remove the item completely from the cart
      const response = await removeCartApi({
        provider_id: currentCartProviderData?.provider_id,
      });
      if (response?.error === false) {
        dispatch(clearCart());
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Format price to handle both string and number inputs
  const formatPrice = (price) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return Number.isFinite(numPrice) ? numPrice.toFixed(2) : "0.00";
  };

  return (
    <DropdownMenu open={isVisible} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <div
          className="text-white primary_bg_color h-[36px] w-[36px] rounded-[8px] p-2 flex items-center justify-center relative cursor-pointer"
          onMouseEnter={() => onOpenChange(true)}
          onMouseLeave={() => onOpenChange(false)}
        >
          <FaShoppingCart
            size={18}
            className={`${isRtl ? "transform scale-x-[-1]" : ""}`}

          />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {totalItems}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-80 p-4"
        align="end"
        onMouseEnter={() => onOpenChange(true)}
        onMouseLeave={() => onOpenChange(false)}
      >
        <DropdownMenuLabel className="text-lg font-semibold">
          {t("serviceInCart")}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <div className="max-h-64 overflow-y-auto py-2">
          {cartItems.length === 0 ? (
            <div className="text-center py-4 description_color">
              {t("yourCartEmpty")}
            </div>
          ) : (
            cartItems.map((item) => (
              <DropdownMenuItem
                key={item?.id}
                className="flex items-center justify-between p-2"
              >
                <div className="flex items-center gap-2">
                  <CustomImageTag
                    src={item?.image_of_the_service}
                    alt={item?.title}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium">{item?.title}</p>
                    <p className="text-sm description_color">
                      {showPrice(
                        formatPrice(
                          item?.discounted_price > 0
                            ? item?.discounted_price
                            : item?.price || 0 // Fallback to 0 if price is undefined
                        )
                      )}{" "}
                      x{item?.qty || 0}{" "}
                      {/* Fallback to 0 if qty is undefined */}
                    </p>
                  </div>
                </div>
                <button
                  className=""
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveItem(item?.id); // Remove the entire item
                  }}
                >
                  <MdClose size={16} />
                </button>
              </DropdownMenuItem>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <>
            <DropdownMenuSeparator />

            <div className="pt-2">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">{t("subTotal")}</span>
                <span className="font-semibold">{showPrice(totalPrice)}</span>
              </div>

              <div className="flex justify-between gap-2">
                <button
                  className="w-1/2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={(e) => {
                    e.preventDefault();
                    handleClearCart();
                  }}
                >
                  {t("clearCart")}
                </button>
                {/* <button className="w-1/2 px-4 py-2 text-sm transition-all duration-300 background_color rounded-md hover:primary_bg_color hover:text-white"> */}
                <Link
                  href="/cart"
                  className="w-1/2 flex items-center justify-center cursor-pointer px-4 py-2 text-sm transition-all duration-300 background_color rounded-md hover:primary_bg_color hover:text-white"
                >
                  {t("checkout")}
                </Link>
                {/* </button> */}
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CartDropdown;
