import "./globals.css";

export const metadata = {
  title: "NEXUS CRM",
  description: "Customer relationship management workspace"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}