const ProfileItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => {
  return (
    <div className="flex items-center space-x-2 px-4 py-4 drop-shadow-lg shadow-inner rounded-md bg-white/40 dark:bg-white/5 backdrop-blur-lg">
      <Icon className="h-4 lg:h-5 w-4 lg:w-4 text-muted-foreground" />
      <span className="text-sm font-medium">{label}:</span>
      <span className="font-bold">{value}</span>
    </div>
  );
};

export default ProfileItem;
