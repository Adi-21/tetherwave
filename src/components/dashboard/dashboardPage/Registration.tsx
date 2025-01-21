'use client';

import { dashboardAPI } from '@/services/api';
import { memo, useEffect, useState } from 'react';
import { LuKey } from "react-icons/lu";
import { DisclaimerModal } from '@/components/modals/DisclaimerModal';

interface RegistrationProps {
  referrerAddress: {
    userId: string;
    walletAddress: string;
  };
  setReferrerAddress: (address: { userId: string; walletAddress: string }) => void;
  handleRegister: () => void;
}

const Registration = memo(({
  referrerAddress,
  setReferrerAddress,
  handleRegister
}: RegistrationProps) => {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  useEffect(() => {
    if (!referrerAddress.walletAddress) {
      const storedRefId = localStorage.getItem("tetherwave_refId");
      const storedRefWallet = localStorage.getItem("tetherwave_refWallet");

      if (storedRefId && storedRefWallet) {
        setReferrerAddress({
          userId: storedRefId,
          walletAddress: storedRefWallet
        });
      } else if (storedRefId) {
        dashboardAPI.getReferralInfo(storedRefId)
          .then(data => {
            if (data.referring_wallet) {
              localStorage.setItem("tetherwave_refWallet", data.referring_wallet);
              setReferrerAddress({
                userId: storedRefId,
                walletAddress: data.referring_wallet
              });
            }
          })
          .catch((error: unknown) => {
            console.error('Failed to fetch referrer info:', error);
          });
      }
    }

    // Cleanup function
    return () => {
      // Only remove if registration is successful
      if (window.location.pathname !== '/dashboard') {
        localStorage.removeItem("tetherwave_refId");
        localStorage.removeItem("tetherwave_refWallet");
      }
    };
  }, [setReferrerAddress, referrerAddress.walletAddress]);

  const handleRegisterClick = () => {
    setIsDisclaimerOpen(true);
  };

  const handleDisclaimerAccept = () => {
    handleRegister();
  };

  return (
    <>
      <div className="mt-4 lg:mt-8 w-full">
        <div className="p-4 lg:p-6 rounded-lg drop-shadow-lg shadow bg-gradient">
          <div className="flex items-center space-x-2 text-lg font-bold mb-4">
            <LuKey className="h-5 w-5" />
            <span>Registration</span>
          </div>
          <input
            type="text"
            placeholder="Referrer Address"
            value={referrerAddress.walletAddress || referrerAddress.userId}
            onChange={(e) => setReferrerAddress({
              userId: referrerAddress.userId,
              walletAddress: e.target.value
            })}
            className="w-full py-3 px-4 rounded mb-4 bg-white/40 dark:bg-white/5 outline-none flex items-center space-x-2 drop-shadow-lg"
          />
          <button
            type="button"
            onClick={handleRegisterClick}
            className="p-2.5 px-4 lg:px-8 font-semibold text-white cursor-pointer drop-shadow shadow-[4px_4px_12px_#FC2FA450,-4px_-4px_12px_#FC2FA450]
            bg-gradient-button active:scale-105 opacity-85 hover:opacity-100 rounded-lg transition-all duration-300"
          >
            Register
          </button>
        </div>
      </div>

      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
        onAccept={handleDisclaimerAccept}
      />
    </>
  );
});

Registration.displayName = 'Registration';

export default Registration;
