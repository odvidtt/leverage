import styles from "./StageAdvanceToast.module.css"

type Props = {
  stage: 2|3|4|5
  stageName: string
  batoHint: string
  prevStage: { name: string; score: number }
  onContinue: () => void
}

export function StageAdvanceToast({ stage, stageName, batoHint, prevStage, onContinue }: Props) {
  return (
    <div className={styles.backdrop}>
      <div className={styles.toast}>
        <div className={styles.badge}>STAGE UNLOCKED</div>
        <div className={styles.num}>{stage}</div>
        <div className={styles.name}>{stageName}</div>
        <div className={styles.hint}>{batoHint}</div>
        <div className={styles.prevScore}>✓ Stage {stage - 1} — {prevStage.name}: {prevStage.score}/3</div>
        <button className={styles.btn} onClick={onContinue}>Continue →</button>
      </div>
    </div>
  )
}
