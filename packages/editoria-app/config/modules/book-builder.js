module.exports = {
  instace: 'UCP',
  chapter: {
    dropdownValues: {
      back: ['Appendix A', 'Appendix B', 'Appendix C'],
      front: ['Table of Contents', 'Introduction', 'Preface'],
    },
  },
  stages: [
    {
      title: 'Upload',
      type: 'upload',
    },
    {
      title: 'File Prep',
      type: 'file_prep',
    },
    {
      title: 'Edit',
      type: 'edit',
    },
    {
      title: 'Review',
      type: 'review',
    },
    {
      title: 'Clean Up',
      type: 'clean_up',
    },
    {
      title: 'Page Check',
      type: 'page_check',
    },
    {
      title: 'Final',
      type: 'final',
    },
  ],
  divisions: [
    {
      name: 'front',
      showNumberBeforeComponents: [],
    },
    {
      name: 'body',
      showNumberBeforeComponents: ['chapter'],
    },
    {
      name: 'back',
      showNumberBeforeComponents: [],
    },
  ],
}
