import { useState } from "react"

function GameZone() {
  const [mode, setMode] = useState("breath")
  const [breathStep, setBreathStep] = useState("Tap start to begin.")
  const [clickScore, setClickScore] = useState(0)

  const startBreathing = () => {
    const steps = [
      "Inhale slowly for 4 seconds…",
      "Hold your breath gently for 2 seconds…",
      "Exhale slowly for 6 seconds…",
      "Notice how your shoulders soften. Let’s repeat.",
    ]
    let i = 0
    setBreathStep(steps[0])
    const id = setInterval(() => {
      i += 1
      if (i >= steps.length) {
        clearInterval(id)
        setBreathStep("Great job. You can tap start again or rest here.")
      } else {
        setBreathStep(steps[i])
      }
    }, 4000)
  }

  const handleBubbleClick = () => {
    setClickScore((s) => s + 1)
  }

  return (
    <div className="me-card p-6 h-full flex flex-col">
      <h2 className="font-bold mb-2 text-[#1e293b]">Stress relief games</h2>
      <p className="text-sm text-[#1e293b]/75 mb-4">
        Use a tiny game to help your nervous system calm down.
      </p>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode("breath")}
          className={`px-3 py-1 rounded-full text-xs ${
            mode === "breath"
              ? "bg-[#5ED3D1] text-[#0B1F4B]"
              : "bg-[#102759] text-[#1e293b]/80"
          }`}
        >
          Breathing
        </button>
        <button
          onClick={() => setMode("focus")}
          className={`px-3 py-1 rounded-full text-xs ${
            mode === "focus"
              ? "bg-[#5ED3D1] text-[#0B1F4B]"
              : "bg-[#102759] text-[#1e293b]/80"
          }`}
        >
          Focus bubbles
        </button>
      </div>

      {mode === "breath" && (
        <div className="flex-1 flex flex-col">
          <p className="text-sm text-[#1e293b]/85 mb-3">
            Follow the simple breathing steps to give your body a short reset.
          </p>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-[#5ED3D1] flex items-center justify-center text-center text-xs px-2">
              {breathStep}
            </div>
            <button
              onClick={startBreathing}
              className="me-btn px-4 py-2 mt-4 text-sm"
            >
              Start 1‑minute breathing
            </button>
          </div>
        </div>
      )}

      {mode === "focus" && (
        <div className="flex-1 flex flex-col">
          <p className="text-sm text-[#1e293b]/85 mb-3">
            Tap the glowing bubbles. Let your mind focus only on this tiny task for a moment.
          </p>
          <div className="flex-1 grid grid-cols-3 gap-3 mt-2">
            {[...Array(6)].map((_, idx) => (
              <button
                key={idx}
                onClick={handleBubbleClick}
                className="rounded-full aspect-square bg-gradient-to-br from-[#5ED3D1] to-[#8AD7FF] shadow-[0_0_18px_rgba(138,215,255,0.55)] hover:scale-105 active:scale-95 transition-transform"
              />
            ))}
          </div>
          <div className="mt-3 text-xs text-[#1e293b]/80">
            Bubbles tapped: <span className="font-semibold">{clickScore}</span>. Even a few seconds of
            playful focus can give your brain a micro‑break.
          </div>
        </div>
      )}
    </div>
  )
}

export default GameZone

