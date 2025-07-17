
import React, { ReactNode } from "react";
import "./globals.css";

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
