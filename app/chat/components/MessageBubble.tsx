import { Markdown } from '@/components/Markdown'
import type { ChatMessage } from '../Chat'

export function MessageBubbleSystem(props: { content: string }) {
  const { content } = props
  return (
    <div className="flex flex-col items-center py-1">
      <div className="text-sm text-transparent">System</div>
      <div className="w-fit max-w-[90%] rounded-xl border border-accent bg-neutral px-4 py-1 text-center text-neutral-content shadow-lg">
        {content}
      </div>
    </div>
  )
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex flex-col ${isUser ? 'items-start' : 'items-end'} py-1`}>
      <div className="w-fit px-1 text-sm">{message.name ?? (isUser ? 'User' : 'Assistant')}</div>
      <div
        className={`w-fit max-w-[90%] rounded-xl border ${
          isUser ? 'border-primary' : 'border-secondary'
        } bg-neutral px-4 py-2 text-neutral-content`}
      >
        <div className="max-w prose prose-neutral">
          <Markdown>{message.content}</Markdown>
        </div>
      </div>
    </div>
  )
}

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  return (
    <div className={`chat ${isUser ? 'chat-start' : 'chat-end'}`}>
      <div className="chat-header text-transparent">
        {message.name ?? (isUser ? 'User' : 'Assistant')}
      </div>
      <div
        className={`${
          isUser ? 'border-secondary' : 'border-accent'
        } prose chat-bubble border shadow-lg`}
      >
        <Markdown>{message.content}</Markdown>
      </div>
    </div>
  )
}
