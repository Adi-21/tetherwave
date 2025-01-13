import React, { useState } from "react";
import { LuCircleDollarSign, LuCopy, LuFileInput, LuFlame, LuLink2, LuWallet } from "react-icons/lu";
import { truncateAddress } from "@/lib/utils/format";
import Skeleton from "@/components/common/Skeleton";

interface WalletDetailsProps {
  address: string;
  usdtBalance: string;
  referralCode: string;
  isLoading: boolean;
}

const WalletDetails = ({
  address,
  usdtBalance,
  referralCode,
  isLoading
}: WalletDetailsProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      return null;
    }
  };

  return (
    <section className="relative p-4 rounded-lg drop-shadow-lg shadow bg-gradient">
      <div className="flex items-center space-x-2 text-lg font-bold">
        <LuWallet className="h-5 w-5" />
        <span>Wallet Details</span>
      </div>
      <div className="grid lg:grid-cols-2 gap-2 lg:gap-4 mt-4">
        {isLoading ? (
          <>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </>
        ) : (
          <>
            <div className="flex items-center space-x-2 px-4 py-4 drop-shadow-lg rounded-md bg-white/40 dark:bg-white/5">
              <LuFileInput className="h-4 lg:h-5 w-4 lg:w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Address:</span>
              <span className="font-bold">
                {address ? truncateAddress(address) : "Not Connected"}
              </span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-4 drop-shadow-lg rounded-md bg-white/40 dark:bg-white/5">
              <LuFlame className="h-4 lg:h-5 w-4 lg:w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Balance:</span>
              <span className="font-bold">Not Connected</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-4 drop-shadow-lg rounded-md bg-white/40 dark:bg-white/5">
              <LuCircleDollarSign className="h-4 lg:h-5 w-4 lg:w-4 text-muted-foreground" />
              <span className="text-sm font-medium">USDT Balance:</span>
              <span className="font-bold">{`${usdtBalance} USDT`}</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-3 drop-shadow-lg rounded-md bg-white/40 dark:bg-white/5">
              <LuLink2 className="h-4 lg:h-5 w-4 lg:w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Referral Link:</span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  className="flex items-center space-x-2 cursor-pointer referral-link"
                  onClick={() => {
                    const referralLink = `${window.location.origin}/dashboard/?ref=${referralCode}`;
                    copyToClipboard(referralLink);
                  }}
                >
                  <span className="bg-gradient-button text-white px-2 py-1 rounded font-medium">
                    {referralCode ? truncateAddress(referralCode) : "Not Generated"}
                  </span>
                  <LuCopy
                    className={`h-4 w-4 transition-colors ${
                      isCopied ? "text-green-500" : "text-muted-foreground hover:text-green-600 hover:dark:text-green-300"
                    }`}
                  />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default WalletDetails;
