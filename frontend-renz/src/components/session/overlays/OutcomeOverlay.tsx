import { useRouter } from "next/navigation"
import type { OutcomeState } from "@/types/session"
import { StageAdvanceToast } from "./StageAdvanceToast"
import { SurrenderOverlay } from "./SurrenderOverlay"
import { DisengagedOverlay } from "./DisengagedOverlay"
import { GameOverOverlay } from "./GameOverOverlay"

type Props = { outcome: OutcomeState; onDismissStage: () => void }

export function OutcomeOverlay({ outcome, onDismissStage }: Props) {
  const router = useRouter()
  const goLeaderboard = () => router.push("/leaderboard")
  const playAgain = () => router.push("/")

  if (outcome.type === "stage_advance") {
    return <StageAdvanceToast stage={outcome.stage} stageName={outcome.stageName} batoHint={outcome.batoHint} prevStage={outcome.prevStage} onContinue={onDismissStage} />
  }
  if (outcome.type === "surrender") {
    return <SurrenderOverlay {...outcome} onLeaderboard={goLeaderboard} onPlayAgain={playAgain} />
  }
  if (outcome.type === "disengaged") {
    return <DisengagedOverlay {...outcome} onTryAgain={playAgain} onLeaderboard={goLeaderboard} />
  }
  if (outcome.type === "gameover") {
    return <GameOverOverlay {...outcome} onTryAgain={playAgain} onLeaderboard={goLeaderboard} />
  }
  return null
}
