import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
    >
      <body className="flex min-h-screen flex-col items-center justify-center p-24">{children}</body>
    </html>
  );
}
