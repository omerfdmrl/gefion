module.exports = {
  testController: async (req, res) => {
    // console.log(cache().get("foo3"));
    // mq()
    //   .queue("test-queue")
    //   .consume((data) => {
    //     console.log(data);
    //   });
    job("WelcomeMail", "test@gmail.com", "Test User");
    try {
      await model("User").insert({
        name: "Ömer Faruk Demirel",
        email: "omerfdmrl@gmail.com",
        password: "123456",
        isEmailVerified: true,
      });
    } catch (error) {
      logger().warn(error.message);
    }
    res.render("test", { title: "hey", message: req.params.tagId });
  },

  testController2: async (req, res) => {
    // mq().queue("test-queue").send("lolo");
    // job("WelcomeMail", "test@gmail.com", "Test User");

    // worker("Test")
    //   .run(123)
    //   .then((val) => {
    //     console.log(val);
    //   });

    // logger.warn("tester");

    // const User = await model("User").findOne({
    //   name: "Ömer",
    // });
    // console.log(await User.can("post-asd"));

    res.render("test", { title: "hey", message: "foo" });
  },
};
