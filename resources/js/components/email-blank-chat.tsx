import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { IconSend, IconSparkles } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

export type ChatMessage =
    | { role: "user"; content: string }
    | { role: "assistant"; type: "summary"; content: string; showConfirm: true }
    | { role: "assistant"; type: "ready"; content: string }
    | { role: "assistant"; type: "declined"; content: string }

interface EmailBlankChatProps {
    messages: ChatMessage[]
    onSend: (prompt: string) => void
    onConfirm: () => void
    onDecline?: () => void
    isGenerating: boolean
    isConfirming?: boolean
    placeholder?: string
}

export function EmailBlankChat({
    messages,
    onSend,
    onConfirm,
    onDecline,
    isGenerating,
    isConfirming = false,
    placeholder = "Describe what your email is about... e.g. Ask guests for feedback about their stay, or promote our new pool for summer bookings",
}: EmailBlankChatProps) {
    const [input, setInput] = useState("")
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, isGenerating, isConfirming])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const text = input.trim()
        if (!text || isGenerating || isConfirming) return
        onSend(text)
        setInput("")
    }

    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant")
    const showConfirmButtons =
        lastAssistant?.role === "assistant" &&
        lastAssistant.type === "summary" &&
        lastAssistant.showConfirm &&
        !isConfirming &&
        !isGenerating

    return (
        <div className="flex flex-col rounded-lg border bg-muted/30 overflow-hidden">
            {/* Chat header */}
            <div className="px-4 py-3 border-b bg-background/80 flex items-center gap-2">
                <IconSparkles className="size-4 text-primary" />
                <span className="text-sm font-medium">Generate with AI</span>
                <span className="text-xs text-muted-foreground ml-1">— describe your email and we&apos;ll create it</span>
            </div>

            {/* Messages */}
            <div className="flex-1 min-h-[240px] max-h-[360px] overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && !isGenerating && !isConfirming && (
                    <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                        <IconSparkles className="size-10 text-muted-foreground/50 mb-3" />
                        <p className="text-sm text-muted-foreground max-w-sm">
                            Describe what your email is about and we&apos;ll generate a professional email that matches your other templates.
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                            Try: &quot;Ask guests for feedback about their stay&quot; or &quot;Remind past guests about early bird discounts&quot;
                        </p>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={cn(
                            "flex",
                            msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                    >
                        {msg.role === "user" ? (
                            <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary text-primary-foreground px-4 py-2.5 text-sm">
                                {msg.content}
                            </div>
                        ) : (
                            <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-muted px-4 py-2.5 text-sm text-foreground">
                                {msg.content}
                            </div>
                        )}
                    </div>
                ))}

                {(isGenerating || isConfirming) && (
                    <div className="flex justify-start">
                        <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-muted px-4 py-2.5 text-sm text-muted-foreground">
                            <span className="flex gap-1">
                                <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                                <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                                <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
                            </span>
                        </div>
                    </div>
                )}

                {showConfirmButtons && (
                    <div className="flex gap-2 pl-1">
                        <Button size="sm" onClick={onConfirm}>
                            Yes, create the email
                        </Button>
                        <Button size="sm" variant="outline" onClick={onDecline}>
                            No
                        </Button>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={placeholder}
                        disabled={isGenerating || isConfirming}
                        className="flex-1 rounded-lg border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!input.trim() || isGenerating || isConfirming}
                        className="shrink-0"
                    >
                        <IconSend className="size-4" />
                    </Button>
                </div>
            </form>
        </div>
    )
}
