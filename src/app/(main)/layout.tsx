import Navbar from "@/components/Navbar";
import LenisProvider from "@/components/Lenisprovider";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <LenisProvider>
            <Navbar />
            {children}
        </LenisProvider>
    );
}