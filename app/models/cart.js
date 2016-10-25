/*
 * The current cart.
 */
exports.definition = {
	config : {
		defaults : {
			total : 0.0
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, {
			castNumber: function(value) {
				return Number(value.replace(/,/g, '.')).toFixed(2);
			},
            increment: function(value) {     
				this.set("total", +this.get("total") + +this.castNumber(value));
				this.trigger("update", this.getFormattedTotal());
            },
            decrement: function(value) {
				this.set("total", +this.get("total") - +this.castNumber(value));
				this.trigger("update", this.getFormattedTotal());
            },
			resetTotal: function(triggerReset) {
				this.set("total", 0.0);
				this.trigger("update", this.getFormattedTotal());
				triggerReset && this.trigger("reset");
			},
            getTotal: function() {
                return this.get("total");
            },
			getFormattedTotal: function() {				
				var val = this.get("total").toFixed(2);
				if (val == 0) {
					return "0,00 €";
				}
				return String(val).replace(".", ",") + " €";
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
