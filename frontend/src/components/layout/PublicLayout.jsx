import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PublicLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        margin: 0,
        padding: 0,
      }}
    >
      <TopBar />
      <Navbar />

      <main
        style={{
          margin: 0,
          padding: 0,
          width: "100%",
        }}
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}