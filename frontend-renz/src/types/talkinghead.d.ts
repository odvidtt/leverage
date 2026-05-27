declare module "talkinghead" {
  export class TalkingHead {
    constructor(container: HTMLElement, options?: Record<string, unknown>)
    showAvatar(config: Record<string, unknown>, callback: () => void): void
    setMood(mood: string): void
    speakText(text: string, options?: Record<string, unknown>): void
    talkingStart(): void
    talkingStop(): void
    stop(): void
  }
}
