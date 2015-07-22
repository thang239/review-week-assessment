var mongoose = require('mongoose')
var _ = require('lodash')
var Task;
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
	// setup schema here
	parent: { type: Schema.Types.ObjectId, ref: 'Task'},
	name: { type: String, required: true },
	complete: { type: Boolean, required: true, default: false },
	due: Date
  
});

//virtuals

TaskSchema.virtual('timeRemaining').get(function() {
	// return this.due;
	var now = new Date();
	if(!this.due) return Infinity;
	return this.due - now;
})

TaskSchema.virtual('overdue').get(function() {
	var now = new Date();
	if(this.complete) return false;
	if(this.due<now) {
		return true;
	}
	return false;
})

//methods

TaskSchema.methods.addChild = function(params) {
	var self=this;
	return this.constructor.create(params)
				.then(function(child){
					child.parent = self._id;
					return child.save();
				})
}

TaskSchema.methods.getChildren = function() {
	var self = this;
	return this.constructor.find({parent:self._id}).exec();
}

TaskSchema.methods.getSiblings = function() {
	var self = this;
	return this.constructor.find({
				parent:self.parent,
				_id:{$nin:[self._id]}})
				.exec();
}

Task = mongoose.model('Task', TaskSchema);


module.exports = Task;