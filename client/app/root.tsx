import { Outlet } from "@remix-run/react";
import Document from "./components/document";

export const unstable_shouldReload = () => false;

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
};
