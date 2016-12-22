import moment from 'moment-timezone';

class Post {
  constructor(data) {
    Object.keys(data).forEach(key => {
      if (key !== 'post_meta') {
        this[key] = data[key];
      }
    });
    (data.post_meta || []).forEach(meta => {
      if (meta.meta_key.toLowerCase().indexOf('date') >= 0) {
        this[meta.meta_key] = moment(new Date(meta.meta_value));
      } else if (meta.meta_key === 'author') {
        this.authors = [...(this.authors || []), meta.meta_value];
      } else {
        this[meta.meta_key] = meta.meta_value;
      }
    });
  }
}

export default Post;
