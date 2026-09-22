with open(r'C:\PROJECT - CGPT\cgpt\src\components\SidebarConversations.tsx', 'r') as f:
    content = f.read()

old = """                    <div className="truncate text-sm">{truncate(conversation.title, 25)}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(conversation.updatedAt)}
                    </div>"""

new = """                    <div className="truncate text-sm">{truncate(conversation.title, 25)}</div>
                    <div className="text-xs text-muted-foreground truncate mt-0.5">
                      {conversation.messages.length > 0
                        ? truncate(conversation.messages[conversation.messages.length - 1].content || '', 45)
                        : 'No messages yet'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(conversation.updatedAt)}
                    </div>"""

content = content.replace(old, new, 1)

with open(r'C:\PROJECT - CGPT\cgpt\src\components\SidebarConversations.tsx', 'w') as f:
    f.write(content)
print('Done')
