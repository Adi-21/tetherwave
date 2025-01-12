import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col justify-start items-center min-h-screen w-full bg-bgLight dark:bg-bgDark text-black dark:text-white">
      <DashboardHeader />
      {/* <div className="fixed inset-0 w-full h-full blur-3xl opacity-20 dark:opacity-0 bg-gradient-to-r from-[#FC2FA420] via-[#902DFF] to-[#4B4CF6]" /> */}
      <div className="" />
      <div className="container px-4 lg:px-16 py-4 flex justify-center items-center w-full mt-36 lg:mt-24">
        {children}
      </div>
    </div>
  );
}
