function getAuthUser(targetClass) {
    const methodNames = Object.getOwnPropertyNames(targetClass.prototype)
        .filter(name => typeof targetClass.prototype[name] === 'function');

    methodNames.forEach(methodName => {
        const originalMethod = targetClass.prototype[methodName];

        targetClass.prototype[methodName] = function (...args) {
            console.log(`Calling method ${methodName} with arguments: ${args}`);
            const result = originalMethod.apply(this, args);
            console.log(`Method ${methodName} returned: ${result}`);
            return result;
        };
    });

    return targetClass;
}

module.exports = getAuthUser
