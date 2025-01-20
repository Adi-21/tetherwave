import { useState, useEffect } from "react";
import { useFrontendId } from '@/contexts/FrontendIdContext';
import type { FrontendIdDisplayProps } from "@/types/contract";

export function FrontendIdDisplay({
  address,
  isRegistered = true,
}: FrontendIdDisplayProps) {
  const [displayId, setDisplayId] = useState<string>("Loading...");
  const { getFrontendId } = useFrontendId();

  useEffect(() => {
    if (!address) {
      setDisplayId("Not Available");
      return;
    }

    if (!isRegistered) {
      setDisplayId(`${address.slice(0, 6)}...${address.slice(-4)}`);
      return;
    }

    let isMounted = true;

    const fetchId = async () => {
      try {
        const userId = await getFrontendId(address);
        if (isMounted) {
          setDisplayId(userId || `${address.slice(0, 6)}...${address.slice(-4)}`);
        }
      } catch {
        if (isMounted) {
          setDisplayId(`${address.slice(0, 6)}...${address.slice(-4)}`);
        }
      }
    };

    fetchId();

    return () => {
      isMounted = false;
    };
  }, [address, isRegistered, getFrontendId]);

  return (
    <span 
      className="text-sm lg:text-base font-semibold"
      title={address}
    >
      {displayId}
    </span>
  );
}
