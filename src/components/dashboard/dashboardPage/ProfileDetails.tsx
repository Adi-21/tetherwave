import { memo, useMemo } from "react";
import { LuUser, LuHash, LuCalendar, LuCrown } from "react-icons/lu";
import ProfileItem from "@/components/common/ProfileItem";
import Skeleton from "@/components/common/Skeleton";

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
      <span className="text-sm font-medium">Direct Sponsor</span>
      <span className="text-sm font-bold">{directSponsorId}</span>
    </div>
    <div className="flex flex-row items-center space-x-2">
      <span className="text-sm font-medium">Matrix Sponsor</span>
      <span className="text-sm font-bold">{matrixSponsorId}</span>
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
  const content = useMemo(() => (
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
          <ProfileItem
            icon={LuHash}
            label="User ID"
            value={userProfileData?.userid || "Not Available"}
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
              ? new Date(userProfileData.created_at).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })
              : "DD/MM/YYYY"
            }
          />
          <SponsorInfo
            directSponsorId={directSponsorId}
            matrixSponsorId={matrixSponsorId}
          />
        </>
      )}
    </div>
  ), [isLoading, userProfileData?.userid, currentLevel, levelName, directSponsorId, matrixSponsorId, userProfileData?.created_at]);

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
