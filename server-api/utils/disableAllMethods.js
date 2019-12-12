'use strict';

module.exports = (model, methodsToExpose) => {
	if (!(model && model.sharedClass)) return;

	methodsToExpose = methodsToExpose || [];

	const methods = model.sharedClass.methods();
	const relationMethods = [];
	const hiddenMethods = [];
	const otherMethods = ['prototype.__updateAttributes', 'prototype.__patchAttributes'];

	// Process other native methods that are not disabled by LoopBack.
	if (model.name !== 'appuser') {
		otherMethods.forEach((otherMethod) => {
			if (methodsToExpose.indexOf(otherMethod) < 0) {
				hiddenMethods.push(otherMethod);
				model.disableRemoteMethodByName(otherMethod.replace('__', ''));
			}
		});
	}

	try {
		Object.keys(model.definition.settings.relations).forEach((relation) => {
			relationMethods.push({
				name: `prototype.__findById__${relation}`,
			});
			relationMethods.push({
				name: `prototype.__destroyById__${relation}`,
			});
			relationMethods.push({
				name: `prototype.__updateById__${relation}`,
			});
			relationMethods.push({
				name: `prototype.__exists__${relation}`,
			});
			relationMethods.push({
				name: `prototype.__link__${relation}`,
			});
			relationMethods.push({
				name: `prototype.__get__${relation}`,
			});
			relationMethods.push({
				name: `prototype.__create__${relation}`,
			});
			relationMethods.push({
				name: `prototype.__update__${relation}`,
			});
			relationMethods.push({
				name: `prototype.__destroy__${relation}`,
			});
			relationMethods.push({
				name: `prototype.__unlink__${relation}`,
			});
			relationMethods.push({
				name: `prototype.__count__${relation}`,
			});
			relationMethods.push({
				name: `prototype.__delete__${relation}`,
			});
			relationMethods.push({
				name: 'prototype.verify',
			});
		});
	} catch (err) {
		debug(err);
	}

	methods.concat(relationMethods).forEach((method) => {
		const methodName = method.name;

		if (methodsToExpose.indexOf(methodName) < 0) {
			hiddenMethods.push(methodName);
			model.disableRemoteMethodByName(methodName);
		}
	});

} 