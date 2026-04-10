import "./globals.css";

export const metadata = {
  title: "Restaurant App",
  description: "Restaurant Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}