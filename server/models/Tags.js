const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({

    name : {
        type  : String,
        trim : true,
        required : true,
    },
    description  :{ 
        type : String,
    },
    course : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Course"
    }

})

module.exports = mongoose.model("Tag",TagSchema);