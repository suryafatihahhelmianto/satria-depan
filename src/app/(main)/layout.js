import AppLayout from "@/components/layout/AppLayout";
import { UserProvider } from "@/context/UserContext";

export const metadata = {
  title: "Satria Keren",
  description:
    "Dashboard kinerja keberlanjutan rantai pasok dan prediksi rendemen gula tebu.",
};

export default function MainLayout({ children }) {
  return (
    <UserProvider>
      <AppLayout>{children}</AppLayout>
    </UserProvider>
  );
}
