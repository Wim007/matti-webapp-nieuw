export default function History() {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-primary px-6 py-4">
        <h1 className="text-2xl font-bold text-white">Geschiedenis</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 bg-background overflow-y-auto">
        <div className="text-center text-muted-foreground">
          <p className="text-lg mb-2">📜</p>
          <p>Nog geen gesprekken opgeslagen</p>
        </div>
      </div>

      {/* Bottom Tab Navigation */}
      <TabNavigation currentTab="history" />
    </div>
  );
}

function TabNavigation({ currentTab }: { currentTab: string }) {
  const tabs = [
    { id: "chat", label: "Chat", icon: "💬", path: "/chat" },
    { id: "history", label: "Geschiedenis", icon: "📜", path: "/history" },
    { id: "themes", label: "Thema's", icon: "🎨", path: "/themes" },
    { id: "profile", label: "Profiel", icon: "👤", path: "/profile" },
    { id: "parent", label: "Ouders", icon: "👨‍👩‍👧", path: "/parent-info" },
  ];

  return (
    <div className="border-t border-border bg-background">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            href={tab.path}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-opacity ${
              currentTab === tab.id ? "opacity-100" : "opacity-50 hover:opacity-75"
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs font-medium text-foreground">
              {tab.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
