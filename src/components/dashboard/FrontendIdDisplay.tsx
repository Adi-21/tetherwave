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
      console.log('No address provided');
      setDisplayId("Not Available");
      return;
    }

    if (!isRegistered) {
      console.log('Address not registered:', address);
      setDisplayId("ID not found");
      return;
    }

    let isMounted = true;

    const fetchId = async () => {
      try {
        console.log('Fetching ID for address:', address);
        const id = await getFrontendId(address);
        console.log('Received ID:', id, 'for address:', address);
        if (isMounted) {
          setDisplayId(id ? id : "ID not found");
        }
      } catch (error) {
        console.error('Error fetching ID:', error);
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
