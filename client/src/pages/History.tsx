import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { THEMES, type ThemeId } from "@shared/matti-types";
import { useMattiTheme } from "@/contexts/MattiThemeContext";
import { useLocation } from "wouter";
import { MessageSquare, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { nl } from "date-fns/locale";

export default function History() {
  const { user } = useAuth();
  const { setCurrentThemeId } = useMattiTheme();
  const [, setLocation] = useLocation();

  const { data: conversations, isLoading } = trpc.chat.getAllConversations.useQuery(
    undefined,
    { enabled: !!user }
  );

  const handleResumeConversation = (themeId: ThemeId) => {
    setCurrentThemeId(themeId);
    setLocation("/chat");
  };

  // Group conversations by date
  const groupedConversations = conversations?.reduce((groups, convo) => {
    const date = new Date(convo.updatedAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    let group: string;
    if (diffDays === 0) {
      group = "Vandaag";
    } else if (diffDays < 7) {
      group = "Deze week";
    } else if (diffDays < 30) {
      group = "Deze maand";
    } else {
      group = "Ouder";
    }

    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(convo);
    return groups;
  }, {} as Record<string, typeof conversations>);

  const groupOrder = ["Vandaag", "Deze week", "Deze maand", "Ouder"];

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Geschiedenis</h1>
        </div>

        {/* Loading State */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Geschiedenis laden...</p>
          </div>
        </div>

        {/* Bottom Tab Navigation */}
        <TabNavigation currentTab="history" />
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Geschiedenis</h1>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 bg-gradient-to-br from-purple-50 via-white to-blue-50">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6">
            <MessageSquare className="w-12 h-12 text-purple-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Nog geen gesprekken
          </h2>
          <p className="text-gray-600 text-center max-w-md mb-8">
            Start een gesprek met Matti over een thema dat je bezighoudt. Je gesprekken worden hier bewaard.
          </p>
          <button
            onClick={() => setLocation("/themes")}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg"
          >
            Kies een thema
          </button>
        </div>

        {/* Bottom Tab Navigation */}
        <TabNavigation currentTab="history" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-white">Geschiedenis</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6 bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-y-auto">
        <div className="space-y-8 max-w-2xl mx-auto">
          {groupOrder.map((groupName) => {
            const groupConvos = groupedConversations?.[groupName];
            if (!groupConvos || groupConvos.length === 0) return null;

            return (
              <div key={groupName}>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">
                  {groupName}
                </h2>
                <div className="space-y-3">
                  {groupConvos.map((convo) => {
                    const theme = THEMES.find((t) => t.id === convo.themeId);
                    if (!theme) return null;

                    const [gradientFrom, gradientTo] = theme.colors.gradient;

                    return (
                      <button
                        key={convo.id}
                        onClick={() => handleResumeConversation(convo.themeId)}
                        className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 text-left group"
                      >
                        <div className="flex items-start gap-3">
                          {/* Theme Icon */}
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                            style={{
                              background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                            }}
                          >
                            {theme.emoji}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                                {theme.name}
                              </h3>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {formatDistanceToNow(new Date(convo.updatedAt), {
                                    addSuffix: true,
                                    locale: nl,
                                  })}
                                </span>
                              </div>
                            </div>

                            {/* Summary Preview */}
                            {convo.summary ? (
                              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                {convo.summary}
                              </p>
                            ) : (
                              <p className="text-sm text-gray-400 italic mb-2">
                                Nog geen samenvatting
                              </p>
                            )}

                            {/* Message Count */}
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <MessageSquare className="w-3 h-3" />
                              <span>{convo.messageCount} berichten</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
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
    <div className="border-t border-gray-200 bg-white">
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
            <span className="text-xs font-medium text-gray-700">
              {tab.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
