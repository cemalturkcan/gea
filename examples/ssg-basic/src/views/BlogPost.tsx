import { Component } from '@geajs/core'
import { ssg } from '@geajs/ssg'

export default class BlogPost extends Component {
  template(props: any) {
    const post = ssg.file('blog', props?.slug)

    if (!post) {
      return (
        <div class="view">
          <h1>Post not found</h1>
          <a href="/blog" class="back-link">
            ← Back to blog
          </a>
        </div>
      )
    }

    return (
      <div class="view">
        <a href="/blog" class="back-link">
          ← Back to blog
        </a>
        <article class="post">
          <time>{new Date(post.frontmatter.date).toISOString().split('T')[0]}</time>
          <h1>{post.frontmatter.title}</h1>
          <div class="post-body">{post.html}</div>
        </article>
      </div>
    )
  }
}
