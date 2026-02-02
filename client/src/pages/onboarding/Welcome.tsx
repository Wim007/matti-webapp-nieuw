import { useLocation } from "wouter";

export default function Welcome() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="flex flex-col gap-8" style={{backgroundColor: '#c7b8ff'}}>
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
              className="w-64 h-64 object-cover rounded-3xl shadow-lg"
            />
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-6">
            {/* Description */}
            <p className="text-base leading-relaxed text-[#333] text-center">
              Matti is een AI chatbuddy voor jongeren van 12-21 jaar. Matti
              luistert, geeft tips en helpt je met school, vrienden, gevoelens
              en meer.
            </p>

            {/* Features */}
            <div className="flex flex-col gap-5">
              {/* Privacy */}
              <div className="bg-[#f0f9ff] p-5 rounded-2xl border-l-4 border-[#3b82f6]">
                <div className="flex gap-3 mb-2">
                  <span className="text-2xl">🔒</span>
                  <h3 className="text-lg font-bold text-foreground">
                    Veilig & Privé
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-[#555]">
                  Alle gesprekken zijn privé en worden alleen op jouw telefoon
                  opgeslagen. Niemand anders kan ze zien.
                </p>
              </div>

              {/* Data */}
              <div className="bg-[#f0fdf4] p-5 rounded-2xl border-l-4 border-[#22c55e]">
                <div className="flex gap-3 mb-2">
                  <span className="text-2xl">📊</span>
                  <h3 className="text-lg font-bold text-foreground">
                    Anonieme Gegevens
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-[#555]">
                  We gebruiken alleen leeftijd en postcode (anoniem) voor
                  onderzoek. Geen namen, geen persoonlijke info.
                </p>
              </div>

              {/* Action */}
              <div className="bg-[#fef3f2] p-5 rounded-2xl border-l-4 border-[#ef4444]">
                <div className="flex gap-3 mb-2">
                  <span className="text-2xl">💪</span>
                  <h3 className="text-lg font-bold text-foreground">
                    Motivatie tot Actie
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-[#555]">
                  Matti helpt je niet alleen met praten, maar ook met concrete
                  acties en volgt op na een paar dagen.
                </p>
              </div>

              {/* Theme Storage */}
              <div className="bg-[#faf5ff] p-5 rounded-2xl border-l-4 border-[#a855f7]">
                <div className="flex gap-3 mb-2">
                  <span className="text-2xl">💬</span>
                  <h3 className="text-lg font-bold text-foreground">
                    9 Verschillende Thema's
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-[#555]">
                  Praat over School, Vrienden, Thuis, Gevoelens, Liefde, Vrije
                  Tijd, Toekomst, Jezelf of gewoon kletsen. Elk gesprek wordt
                  per thema opgeslagen op jouw telefoon, zodat Matti zich
                  herinnert wat je eerder vertelde.
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
