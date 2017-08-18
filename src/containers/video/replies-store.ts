import { observable } from 'mobx';
import { fetchUtil } from '../../utils/ajax';
import { parseComment } from '../../utils/api';

export class RepliesStore {
    @observable public comments: youtube.Comment[] = [];
    @observable public commentLoading = false;
    @observable public parentId: string | undefined;

    public async loadReplies(parentId: string) {
        this.parentId = parentId;
        this.commentLoading = true;

        try {
            const commentObj = await fetchUtil.get('/api/comments', {
                parentId: this.parentId,
                pageToken: ''
            });

            if (commentObj.items && commentObj.items.length) {
                this.comments = commentObj.items.map(parseComment);           
            }
        } catch (e) {
            console.log(e);
        } finally {
            this.commentLoading = false;
        }
    }

    public reset(): void {
        this.commentLoading = false;
        this.comments = [];
        this.parentId = undefined;
    }
}
