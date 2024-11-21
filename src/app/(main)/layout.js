import { Poppins } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import AppLayout from "@/components/layout/AppLayout";
import { UserProvider } from "@/context/UserContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Satria Keren",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  // const userData = await fetchUserData()
  return (
    <html lang="en">
      <body className={`${poppins.className}`}>
        <UserProvider>
          <AppLayout>{children}</AppLayout>
        </UserProvider>
        {/* <div className="flex flex-col w-full">
          <Navbar />
          <Sidebar />
          <div className="min-h-screen bg-gray-100 px-4 pl-[320px] mt-5">
            <div className="mt-20">{children}</div>
          </div>
        </div> */}
      </body>
    </html>
  );
}
