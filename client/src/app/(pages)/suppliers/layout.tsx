import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suppliers | Levels Living IMS",
  description: "Manage suppliers in the inventory management system"
};

export default function SuppliersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
