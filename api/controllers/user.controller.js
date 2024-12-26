import User from '../models/user.model.js'
import createError from '../utils/createError.js'

export const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id)

    if(req.userId !== user._id.toString()) {
        return next(createError(403,"You are not authorized to delete this user"))
    }

    await User.findByIdAndDelete(req.params.id)
    res.status(200).send("User has been deleted")
}