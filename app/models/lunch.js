/*
 * A lunch entity
 */
exports.definition = {
	config: {
		columns: {
			id: 'INTEGER PRIMARY KEY',
			title: 'TEXT'
		},
		defaults: {
			id: -1,
			title: ''
		},
		adapter: {
			type: 'sql',
			idAttribute: 'id',
			collection_name: 'lunch'
		}
	},

	extendModel: Model => {
		return Model;
	},
	extendCollection: () => {

	}
};
