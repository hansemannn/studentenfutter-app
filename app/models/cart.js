/*
 * The current cart.
 */
exports.definition = {
	config : {
		defaults : {
			summary : 0
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, {
            increment: function(value) {
                this.set("summary", this.get("summary") + value);
            },
            decrement: function(value) {
                this.set("summary", this.get("summary") - value);
            },
            getSummary: function() {
                return this.get("summary")
            }
		});

		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, {
            // Custom collection operations
		});

		return Collection;
	}
};
