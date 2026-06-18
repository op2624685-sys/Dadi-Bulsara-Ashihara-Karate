import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Auth | Dadi Bulsara Ashihara Karate",
    description:
        "Login, Signup, and Forgot Password of Dadi Bulsara Ashihara Karate training platform.",
    keywords: ["Ashihara Karate", "Dadi Bulsara", "martial arts", "Dadi Bulsara Login", "Dadi Bulsara Signup", "Dadi Bulsara Forgot Password"],
    openGraph: {
        title: "Dadi Bulsara Ashihara kai kan Karate",
        description: "Discipline. Strength. Become Unstoppable.",
        type: "website",
    },
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
        </>
    );
}