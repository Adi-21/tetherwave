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
      setDisplayId("ID not found");
      return;
    }

    let isMounted = true;

    const fetchId = async () => {
      try {
        const id = await getFrontendId(address);
        if (isMounted) {
          setDisplayId(id ? id : "ID not found");
        }
      } catch {
        if (isMounted) {
          setDisplayId("ID not found");
        }
      }
    };

    fetchId();

    return () => {
      isMounted = false;
    };
  }, [address, isRegistered, getFrontendId]);

  return <span className="text-sm lg:text-base font-semibold">{displayId}</span>;
}
