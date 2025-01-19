import { memo, useCallback } from "react";
import { Wallet, Copy, Link2, CircleDollarSign, Flame } from "lucide-react";
import { truncateAddress } from "@/lib/utils/format";
import { useUSDTBalance } from '@/hooks/useUSDTBalance';
import { toast } from 'react-hot-toast';

interface WalletDetailsProps {
  address: string;
  referralCode: string;
  userId?: string;
}

interface WalletItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  copyable?: boolean;
  onCopy?: () => void;
}

const WalletItem = memo(({ icon: Icon, label, value, copyable, onCopy }: WalletItemProps) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 px-4 py-4 rounded-md bg-white/40 dark:bg-white/5 backdrop-blur-lg">
    <div className="flex items-center gap-2 min-w-fit">
      <Icon className="h-4 lg:h-5 w-4 lg:w-4 text-muted-foreground" />
      <span className="text-sm font-medium">{label}:</span>
    </div>
    <div className="flex items-center gap-2 w-full sm:flex-1 break-words">
      <span className="font-bold text-sm lg:text-base">{value}</span>
      {copyable && (
        <button type="button" onClick={onCopy} className="ml-auto hover:text-primary">
          <Copy className="h-4 w-4" />
        </button>
      )}
    </div>
  </div>
));

WalletItem.displayName = 'WalletItem';

const WalletDetails = memo(({ address, userId }: WalletDetailsProps) => {
  const { formatted: usdtBalance, isLoading } = useUSDTBalance(address as `0x${string}`);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  // Only create referral URL if userId exists
  const fullReferralUrl = userId 
    ? `${baseUrl}/dashboard/?ref=${userId}`
    : "Referral link will be available after registration";

  const handleCopy = useCallback(async (text: string) => {
    if (!userId) {
      toast.error('Please register first to get your referral link');
      return;
    }
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  }, [userId]);

  return (
    <section className="relative p-4 rounded-lg bg-white/40 dark:bg-white/5 backdrop-blur-lg">
      <div className="flex items-center space-x-2 text-lg font-bold">
        <Wallet className="h-5 w-5" />
        <span>Wallet Details</span>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <WalletItem
          icon={Link2}
          label="Address"
          value={truncateAddress(address || '0x')}
          copyable
          onCopy={() => handleCopy(address || '')}
        />
        <WalletItem
          icon={CircleDollarSign}
          label="USDT Balance"
          value={isLoading ? "Loading..." : `${usdtBalance} USDT`}
        />
        <WalletItem
          icon={Flame}
          label="Referral Link"
          value={userId ? truncateAddress(fullReferralUrl) : fullReferralUrl}
          copyable={!!userId}
          onCopy={() => handleCopy(fullReferralUrl)}
        />
      </div>
    </section>
  );
});

WalletDetails.displayName = "WalletDetails";

export default WalletDetails;
