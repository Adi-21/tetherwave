import { useState, useEffect, useCallback } from "react";
// import { useFrontendId } from '@/contexts/FrontendIdContext';
import type { FrontendIdDisplayProps } from "@/types/contract";

export function FrontendIdDisplay({
  address,
  isRegistered = true,
}: FrontendIdDisplayProps) {
  const [displayId, setDisplayId] = useState("Loading...");
  // const { getFrontendId } = useFrontendId();

  const getFrontendId = useCallback(async (address: string) => {
    const response = await fetch(`/api/frontend-id?address=${address}`);
    const data = await response.json();
    return data.frontendId;
  }, []);

  useEffect(() => {
    if (!address) {
      setDisplayId("Not Available");
      return;
    }

    // If not registered, just show truncated address
    if (!isRegistered) {
      const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`;
      setDisplayId(truncated);
      return;
    }

    let isMounted = true;

    const fetchId = async () => {
      try {
        const id = await getFrontendId(address);
        if (isMounted) {
          setDisplayId(id);
        }
      } catch {
        if (isMounted) {
          const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`;
          setDisplayId(truncated);
        }
      }
    };

    fetchId();

    return () => {
      isMounted = false;
    };
  }, [address, isRegistered, getFrontendId]);

  return displayId;
}
