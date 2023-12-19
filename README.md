# node-red-contrib-mattermost-apps

Custom nodes for Node-RED to interact with a Mattermost server.

## Install

Run the following command in the root directory of your Node-RED install

```bash
npm install @cedricziel/node-red-contrib-mattermost-apps
```

## Usage

### Send a post to a channel

You have to provide the channel id, a message and everything else is optional.

```javascript
msg.method = 'createPost';
msg.args = [
    {
        channel_id: '1234',
        message: 'hello',
    }
];
return msg;
```

<details>
<summary>Post Object structure</summary>

Properties:

```typescript
export type Post = {
    id: string;
    create_at: number;
    update_at: number;
    edit_at: number;
    delete_at: number;
    is_pinned: boolean;
    user_id: string;
    channel_id: string;
    root_id: string;
    original_id: string;
    message: string;
    type: PostType;
    props: Record<string, any>;
    hashtags: string;
    pending_post_id: string;
    reply_count: number;
    file_ids?: string[];
    metadata: PostMetadata;
    failed?: boolean;
    user_activity_posts?: Post[];
    state?: PostState;
    filenames?: string[];
    last_reply_at?: number;
    participants?: any; //Array<UserProfile | UserProfile['id']>;
    message_source?: string;
    is_following?: boolean;
    exists?: boolean;
};
```
</details>

## License

MIT
