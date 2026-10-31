import {
  Phone,
  Mail,
  ExternalLink,
  BadgeCheck,
} from "lucide-react";

export default function TopBar() {
  return (
    <div
      style={{
        width: "100%",
        height: "48px",
        boxSizing: "border-box",
        background: "#005507",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "calc(100% - 80px)",
          maxWidth: "1740px",
          height: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* BAGIAN KIRI */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
            }}
          >
            <BadgeCheck
              size={16}
              strokeWidth={2}
              color="#e5f000"
            />
            NPSN: 20108392
          </span>

          <span
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "#4c8d48",
            }}
          />

          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
            }}
          >
            <Phone
              size={14}
              strokeWidth={2.2}
              color="#e5f000"
            />
            (021) 7892-3401
          </span>

          <span
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "#4c8d48",
            }}
          />

          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
            }}
          >
            <Mail
              size={14}
              strokeWidth={2}
              color="#e5f000"
            />
            info@smaharapanjaya.sch.id
          </span>
        </div>

        {/* BAGIAN KANAN */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontSize: "12px",
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              background: "#287520",
              padding: "7px 12px",
              borderRadius: "4px",
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            Adiwiyata Mandiri
          </span>

          <span
            style={{
              color: "#e5f000",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Portal SIS / CBT
            <ExternalLink
              size={12}
              strokeWidth={2.2}
            />
          </span>
        </div>
      </div>
    </div>
  );
}