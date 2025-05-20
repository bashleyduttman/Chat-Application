const User = require("../models/user");
const Fdb=require("../models/friendRequest");
const searchUser = async (req, res) => {
    const search = req.query.query;
    const NAME = req.body.NAME;
    console.log(NAME)
    if (!search || !search.trim()) {
        return res.status(400).json({ error: "Search query cannot be empty" });
    }

    try {
        const sender = await User.findOne({ username: NAME }).select("_id");
        if (!sender) {
            return res.status(404).json({ error: "Sender not found" });
        }

       const users = await User.find({
    $and: [
        { username: { $regex: search, $options: 'i' } },
        { username: { $ne: NAME } }
    ]
}).select('username');


        const result = {
            users: [],
            options: []
        };

        for (const user of users) {
            const isFriend = await Fdb.findOne({ sender: sender._id, receiver: user._id });

            result.users.push(user);
            if (isFriend) {
                result.options.push(isFriend.status);
            } else {
                result.options.push("not available");
            }
        }

        console.log(result);
        res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
};
module.exports={searchUser}