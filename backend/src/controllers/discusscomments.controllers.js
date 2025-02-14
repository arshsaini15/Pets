import { User } from '../models/user.models.js'
import { Discussion } from '../models/discuss.models.js'

export const addComment = async (req, res) => {
    const postId = req.params.id
    const { content } = req.body
    const userId = req.userId

    try {
        const post = await Discussion.findById(postId)
        if (!post) return res.status(404).json({ message: "Post not found" })

        const user = await User.findById(userId).select("username email")
        console.log('user: ',user)

        const newComment = {
            content,
            user
        }

        post.comments.push(newComment)
        await post.save()

        res.status(200).json(newComment)
    } catch (error) {
        console.error("Error adding comment:", error)
        res.status(500).json({ message: "Failed to add comment" })
    }
}