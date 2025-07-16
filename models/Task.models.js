import mongoose from 'mongoose';


const task=new mongoose.Schema({
    title:{
        type:String,
        required:true   
    },
    description:{
        type:String,
        required:true
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:['pending','in-progress','completed'],
        default:'pending'
    },

});
const Task = mongoose.model('Task', task);
export default Task;