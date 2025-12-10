import "./globals.css";
import ClientLayout from "../components/ClientLayout";

export const metadata = {
  title: "ProMedico Klinik",
  description: "Sistem Booking Klinik ProMedico berbasis Microservices",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-slate-50 text-slate-900">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
