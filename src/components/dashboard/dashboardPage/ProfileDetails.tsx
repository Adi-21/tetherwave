import { memo } from "react";
import { LuUser, LuHash, LuCalendar, LuCrown } from "react-icons/lu";
import ProfileItem from "../../common/ProfileItem";
import type { UserProfileData } from "@/types/contract";

interface ProfileDetailsProps {
  userProfileData?: UserProfileData | null;
  currentLevel?: number;
  directSponsorId?: string | null | undefined;
  matrixSponsorId?: string | null | undefined;
}

const SponsorInfo = memo(
  ({
    directSponsorId,
    matrixSponsorId,
  }: {
    directSponsorId?: string | null | undefined;
    matrixSponsorId?: string | null | undefined;
  }) => (
    <div className="flex flex-col items-start justify-center px-4 py-4 drop-shadow-lg rounded-md bg-white/40 dark:bg-white/5">
      <div className="flex flex-row items-center space-x-2">
        <span className="text-sm font-medium">Direct Sponsor</span>
        <span className="text-sm font-bold">{directSponsorId}</span>
      </div>
      <div className="flex flex-row items-center space-x-2">
        <span className="text-sm font-medium">Matrix Sponsor</span>
        <span className="text-sm font-bold">{matrixSponsorId}</span>
      </div>
    </div>
  )
);

const ProfileDetails = memo(
  ({
    userProfileData,
    currentLevel,
    directSponsorId,
    matrixSponsorId,
  }: ProfileDetailsProps) => {
    const rankName = "Unknown";
    const activationDate = "Not Available";

    return (
      <section className="relative p-4 rounded-lg drop-shadow-lg shadow bg-gradient">
        <div className="flex items-center space-x-2 text-lg font-bold">
          <LuUser className="h-5 w-5" />
          <span>Profile Details</span>
        </div>
        <div className="grid lg:grid-cols-2 gap-2 lg:gap-4 mt-4">
          <ProfileItem
            icon={LuHash}
            label="User ID"
            value={userProfileData?.frontend_id || "Not Available"}
          />
          <ProfileItem
            icon={LuCrown}
            label="Rank"
            value={`${currentLevel} - ${rankName}`}
          />
          <ProfileItem
            icon={LuCalendar}
            label="Activation Date"
            value={activationDate}
          />
          <SponsorInfo
            directSponsorId={directSponsorId}
            matrixSponsorId={matrixSponsorId}
          />
        </div>
      </section>
    );
  }
);
ProfileDetails.displayName = "ProfileDetails";
SponsorInfo.displayName = "SponsorInfo";

export default ProfileDetails;
