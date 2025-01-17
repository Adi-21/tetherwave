import { memo, useCallback } from "react";
import { Wallet, Copy, Link2, CircleDollarSign, Flame } from "lucide-react";
import { truncateAddress } from "@/lib/utils/format";
import { useUSDTBalance } from '@/hooks/useUSDTBalance';
import { toast } from 'react-hot-toast';

interface WalletDetailsProps {
  address: string;
  referralCode: string;
}

interface WalletItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  copyable?: boolean;
  onCopy?: () => void;
}

const WalletItem = memo(({ icon: Icon, label, value, copyable, onCopy }: WalletItemProps) => (
  <div className="flex items-center space-x-2 px-4 py-4 rounded-md bg-white/40 dark:bg-white/5 backdrop-blur-lg">
    <Icon className="h-4 lg:h-5 w-4 lg:w-4 text-muted-foreground" />
    <span className="text-sm font-medium">{label}:</span>
    <span className="font-bold">{value}</span>
    {copyable && (
      <button type="button" onClick={onCopy} className="ml-2 hover:text-primary">
        <Copy className="h-4 w-4" />
      </button>
    )}
  </div>
));

const WalletDetails = memo(({ address, referralCode }: WalletDetailsProps) => {
  const { formatted: usdtBalance, isLoading } = useUSDTBalance(address as `0x${string}`);

  const handleCopy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  }, []);

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
          label="Referral Code"
          value={truncateAddress(referralCode || '0x')}
          copyable
          onCopy={() => handleCopy(referralCode || '')}
        />
      </div>
    </section>
  );
});

WalletDetails.displayName = "WalletDetails";

export default WalletDetails;
