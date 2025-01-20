import { memo, useMemo } from "react";
import { LuUser, LuHash, LuCalendar, LuCrown } from "react-icons/lu";
import ProfileItem from "@/components/common/ProfileItem";
import Skeleton from "@/components/common/Skeleton";
import { useWallet } from "@/hooks/useWallet";
import { FrontendIdDisplay } from "@/components/dashboard/FrontendIdDisplay";

interface ProfileDetailsProps {
  userProfileData: {
    userid?: string;
    wallet_address?: string;
    created_at?: string;
    total_referrals?: number;
    isLoading: boolean;
  };
  currentLevel: number;
  levelName: string;
  directSponsorId: string;
  matrixSponsorId: string;
  isLoading: boolean;
}

interface SponsorInfoProps {
  directSponsorId: string;
  matrixSponsorId: string;
}

const SponsorInfo = memo(({ directSponsorId, matrixSponsorId }: SponsorInfoProps) => (
  <div className="flex flex-col items-start justify-center px-4 py-4 rounded-md bg-white/40 dark:bg-white/5 backdrop-blur-lg">
    <div className="flex flex-row items-center space-x-2">
      <span className="text-sm font-medium">Direct Sponsor:</span>
      <FrontendIdDisplay address={directSponsorId } isRegistered={true} />
    </div>
    <div className="flex flex-row items-center space-x-2">
      <span className="text-sm font-medium">Matrix Sponsor:</span>
      <FrontendIdDisplay address={matrixSponsorId} isRegistered={true} />
    </div>
  </div>
));

const ProfileDetails = memo(({
  userProfileData,
  currentLevel,
  levelName,
  directSponsorId,
  matrixSponsorId,
  isLoading,
}: ProfileDetailsProps) => {
  const { isRegistered } = useWallet();

  const content = useMemo(() => (
    <div className="grid lg:grid-cols-2 gap-2 lg:gap-4 mt-4">
      {isLoading ? (
        <>
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </>
      ) : isRegistered ? (
        <>
          <ProfileItem
            icon={LuHash}
            label="User ID"
            value={userProfileData?.userid || "Processing..."}
          />
          <ProfileItem
            icon={LuCrown}
            label="Rank"
            value={`${currentLevel} - ${levelName}`}
          />
          <ProfileItem
            icon={LuCalendar}
            label="Activation Date"
            value={userProfileData?.created_at 
              ? new Date(userProfileData.created_at).toLocaleDateString('en-GB')
              : "Processing..."}
          />
          <SponsorInfo
            directSponsorId={directSponsorId}
            matrixSponsorId={matrixSponsorId}
          />
        </>
      ) : (
        <div className="col-span-2 text-center">
          Please register to view profile details
        </div>
      )}
    </div>
  ), [isLoading, isRegistered, userProfileData, currentLevel, levelName, directSponsorId, matrixSponsorId]);

  return (
    <section className="relative p-4 rounded-lg bg-white/40 dark:bg-white/5 backdrop-blur-lg">
      <div className="flex items-center space-x-2 text-lg font-bold">
        <LuUser className="h-5 w-5" />
        <span>Profile Details</span>
      </div>
      {content}
    </section>
  );
});
ProfileDetails.displayName = "ProfileDetails";
SponsorInfo.displayName = "SponsorInfo";

export default ProfileDetails;
