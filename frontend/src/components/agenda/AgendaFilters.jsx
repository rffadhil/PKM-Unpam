const categories = [
  "Semua",
  "Akademik",
  "Kesiswaan",
  "Ujian",
  "Sekolah",
];

export default function AgendaFilters({
  activeCategory,
  onCategoryChange,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        marginBottom: "24px",
      }}
    >
      {categories.map((category) => {
        const active = activeCategory === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            aria-pressed={active}
            style={{
              padding: "10px 17px",
              borderRadius: "30px",
              border: active
                ? "1px solid #064d00"
                : "1px solid #dce4d9",
              background: active ? "#064d00" : "#ffffff",
              color: active ? "#ffffff" : "#405044",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}