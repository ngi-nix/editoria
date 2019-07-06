module.exports = {
  user: {
    type: 'user',
    username: 'testuser',
    email: 'test@example.com',
    password: 'test',
  },
  addTag: [
    {
      tagType: 'block',
      label: 'tag1',
    },
    {
      tagType: 'inline',
      label: 'tag2',
    },
  ],
  updateTag: [
    {
      tagType: 'inline',
      label: 'tag1new',
    },
  ],
}
