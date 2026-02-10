import { useLocation } from "wouter";

export default function Welcome() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{backgroundColor: '#aaf2f3'}}>
      <div className="max-w-2xl w-full">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col items-center gap-4">
            <div className="text-5xl">👋</div>
            <h1 className="text-4xl font-bold text-foreground text-center">
              Welkom bij Matti!
            </h1>
          </div>

          {/* Humorous Teen Image */}
          <div className="flex justify-center">
            <img 
              src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663030245921/idHgRDPaipBPClXU.jpg" 
              alt="Puber met puistjes kijkt geschrokken in de spiegel" 
              className="w-64 h-64 object-cover rounded-full shadow-lg"
            />
          </div>

          {/* Main Content */}
          <div className="w-full bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
            <div className="space-y-6 text-gray-800">
              <div>
                <h3 className="text-xl font-bold text-[#7cd5f3] mb-3 flex items-center gap-2">
                  <span>💬</span> Wat doet Matti?
                </h3>
                <p className="text-base leading-relaxed">
                  Matti is een AI chatbuddy speciaal voor jongeren. Je kunt met Matti praten over alles wat je bezighoudt, 
                  zonder oordeel. Matti luistert, geeft tips en helpt je stappen te zetten.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#7cd5f3] mb-3 flex items-center gap-2">
                  <span>👥</span> Voor wie is Matti?
                </h3>
                <p className="text-base leading-relaxed">
                  Matti is er voor jongeren tussen 12 en 21 jaar. Of je nou 13 bent of 20, Matti snapt waar je doorheen gaat 
                  en past zich aan jouw leeftijd aan.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#7cd5f3] mb-3 flex items-center gap-2">
                  <span>🗨️</span> Waarover kun je praten?
                </h3>
                <div className="text-base leading-relaxed space-y-1">
                  <p><span className="font-semibold text-[#3b82f6]">🏫 School:</span> Faalangst, tentamens, concentratie, huiswerk</p>
                  <p><span className="font-semibold text-[#10b981]">👫 Vrienden:</span> Ruzie, pesten, vriendschap, vertrouwen</p>
                  <p><span className="font-semibold text-[#f97316]">🏠 Thuis:</span> Ouders, gezin, scheiding, ruzie</p>
                  <p><span className="font-semibold text-[#ec4899]">💖 Gevoelens:</span> Angst, stress, somberheid, eenzaamheid</p>
                  <p><span className="font-semibold text-[#ef4444]">❤️ Liefde:</span> Relaties, heartbreak, verliefdheid</p>
                  <p><span className="font-semibold text-[#8b5cf6]">✨ En meer:</span> Vrije tijd, toekomst, jezelf</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#7cd5f3] mb-3 flex items-center gap-2">
                  <span>✨</span> Hoe helpt Matti?
                </h3>
                <p className="text-base leading-relaxed">
                  Matti luistert zonder oordeel, stelt vragen om je te helpen nadenken, geeft praktische tips en acties, 
                  en checkt later hoe het met je gaat. <span className="font-semibold">🔒 Alles wat je vertelt blijft privé.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4 mt-2">
            {/* Primary Button */}
            <button
              onClick={() => setLocation("/onboarding/account")}
              className="theme-general-gradient text-white text-lg font-bold py-[18px] px-8 rounded-2xl hover:opacity-90 transition-opacity"
            >
              Ik snap het, start Matti
            </button>

            {/* Secondary Button */}
            <button
              onClick={() => setLocation("/parent-info")}
              className="bg-white text-[#6366f1] text-base font-semibold py-4 px-8 rounded-2xl border-2 border-[#e5e7eb] hover:opacity-70 transition-opacity"
            >
              Meer info voor ouders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
