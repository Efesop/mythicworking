const pageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: Object,
    default: {
      time: Date.now(),
      blocks: [],
      version: "2.8.1",
    },
  },
  blocks: [blockSchema],
});
