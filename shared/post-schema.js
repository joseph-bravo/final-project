const { object, string, array } = require('yup');

const r = {
  titleMaxChars: 25,
  descriptionMaxChars: 75,
  tagsMaxChars: 10,
  tagsMaxCount: 5
};

const postSchema = object({
  title: string().trim().max(r.titleMaxChars).required(),
  description: string().trim().max(r.descriptionMaxChars),
  tags: array()
    .of(string().trim().max(r.tagsMaxChars).lowercase())
    .transform(tags => {
      const out = [];
      for (let i = 0; i < tags.length; i++) {
        if (!out.includes(tags[i])) {
          out.push(tags[i]);
        }
      }
      return out;
    })
    .compact()
    .max(r.tagsMaxCount)
});

module.exports = postSchema;
