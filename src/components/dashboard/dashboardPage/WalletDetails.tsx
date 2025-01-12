import React, { useState } from "react";
import { LuCircleDollarSign, LuCopy, LuFileInput, LuFlame, LuLink2, LuWallet } from "react-icons/lu";
import { truncateAddress } from "@/lib/utils/format";

interface WalletDetailsProps {
  address: string | undefined;
  usdtBalance: string | null;
  referralCode: string | null;
}

const WalletDetails = ({
  address,
  usdtBalance,
  referralCode,
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
          {/* <ConnectButton.Custom>
              {({ account, chain, authenticationStatus, mounted }) => {
                const ready = mounted && authenticationStatus !== "loading";
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === "authenticated");

                return (
                  <div
                    {...(!ready && {
                      "aria-hidden": true,
                      style: {
                        opacity: 0,
                        pointerEvents: "none",
                        userSelect: "none",
                      },
                    })}
                  >
                    <span className="font-bold">
                      {!connected
                        ? "Not Connected"
                        : account?.displayBalance
                        ? ` ${account.balanceFormatted}`
                        : `0.0000 ${chain?.name || "BNB"}`}
                    </span>
                  </div>
                );
              }}
            </ConnectButton.Custom> */}
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
                const element = document.querySelector(".referral-link");
                const referralLink =
                  element?.getAttribute("data-referral") ||
                  `${window.location.origin}/dashboard/?ref=${referralCode}`;
                copyToClipboard(referralLink);
              }}
            >
              <span className="bg-gradient-button text-white px-2 py-1 rounded font-medium">
                {referralCode ? truncateAddress(referralCode) : "Not Generated"}
              </span>
              <LuCopy
                className={`h-4 w-4 transition-colors ${
                  isCopied
                    ? "text-green-500"
                    : "text-muted-foreground hover:text-green-600 hover:dark:text-green-300"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WalletDetails;
